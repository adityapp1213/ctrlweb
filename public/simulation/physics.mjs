// Official Menagerie model data drives physics, controls, visual meshes and reset.
export class ArmSimulation {
  constructor(mujoco, files, entry = "scene.xml", workspace = {}) {
    this.mujoco = mujoco;
    const vfs = new mujoco.MjVFS();
    const root = '/robot';
    mujoco.FS.mkdirTree(root);
    try {
      // VFS.addBuffer copies each byte through Embind. Bulk FS writes avoid a
      // 30-second startup penalty on a 40 MB model without changing the model.
      for (const file of files) {
        const filename = `${root}/${file.name}`;
        mujoco.FS.mkdirTree(filename.slice(0, filename.lastIndexOf('/')));
        mujoco.FS.writeFile(filename, file.bytes);
      }
      this.model = files.some((file) => file.name === 'panda.mjb')
        ? mujoco.MjModel.from_binary_path(`${root}/panda.mjb`, vfs)
        : mujoco.MjModel.from_xml_path(`${root}/${entry}`, vfs);
    } finally {
      vfs.delete();
      for (const file of files) {
        try { mujoco.FS.unlink(`${root}/${file.name}`); } catch { /* Failed loads can leave absent files. */ }
      }
    }
    try {
      this.configureContacts(workspace);
      this.data = new mujoco.MjData(this.model);
      this.home = mujoco.mj_name2id(this.model, mujoco.mjtObj.mjOBJ_KEY.value, 'home');
      if (this.home >= 0) mujoco.mj_resetDataKeyframe(this.model, this.data, this.home);
      else mujoco.mj_resetData(this.model, this.data);
      this.fingers = ['finger_joint1', 'finger_joint2'].map(name => mujoco.mj_name2id(this.model, mujoco.mjtObj.mjOBJ_JOINT.value, name));
      this.isPanda = this.model.nu === 8 && this.fingers.every(id => id >= 0);
      this.drives = Array.from({ length: this.model.nu }, (_, actuator) => {
        const joint = this.model.actuator_trnid[actuator * 2];
        const transmission = this.model.actuator_trntype[actuator];
        const jointDrive = (transmission === 0 || transmission === 1) && joint >= 0;
        const position = jointDrive && this.model.actuator_biasprm[actuator * 10 + 1] < 0;
        const velocity = jointDrive && !position && this.model.actuator_biasprm[actuator * 10 + 2] < 0;
        const hinge = jointDrive && this.model.jnt_type[joint] === 3;
        const scale = (position || velocity) ? (hinge ? 180 / Math.PI : 1000) : 1;
        let min = this.model.actuator_ctrllimited[actuator] ? this.model.actuator_ctrlrange[actuator * 2] : -1;
        let max = this.model.actuator_ctrllimited[actuator] ? this.model.actuator_ctrlrange[actuator * 2 + 1] : 1;
        if (position && this.model.jnt_limited[joint]) {
          min = Math.max(min, this.model.jnt_range[joint * 2]);
          max = Math.min(max, this.model.jnt_range[joint * 2 + 1]);
        }
        const name = this.modelName('actuator', actuator) || 'actuator_' + actuator;
        const label = jointDrive ? (this.modelName('joint', joint) || name) : name;
        return { name, label, actuator, position, velocity, scale, joint,
          address: jointDrive ? this.model.jnt_qposadr[joint] : -1,
          velocityAddress: jointDrive ? this.model.jnt_dofadr[joint] : -1,
          min: min * scale, max: max * scale, home: this.data.ctrl[actuator] * scale,
          unit: position ? (hinge ? '°' : 'mm') : velocity ? (hinge ? '°/s' : 'mm/s') : 'effort',
          mode: position ? 'position' : velocity ? 'velocity' : 'effort', step: .1,
        };
      });
      if (this.isPanda) {
        Object.assign(this.drives[7], { label: 'Gripper opening', min: 0, max: 80, home: 80, unit: 'mm', mode: 'position', position: true, scale: 80 / 255, step: 1, gripper: true });
      }
      this.controls = this.drives.map(({ actuator: id, name, label, min, max, step, unit, home, mode }) => ({ id, name, label, min, max, step, unit, home, mode }));
      this.visibleGeoms = Array.from({ length: this.model.ngeom }, (_, id) => id).filter((id) => this.model.geom_group[id] !== 3);
      const option = this.model.opt;
      this.timestep = option.timestep;
      option.delete();
      this.reset();
      // Some upstream scenes have no home keyframe and start with intersecting
      // closed grippers / folded links. Let native contacts settle those poses
      // before showing them, then keep that valid pose for deterministic reset.
      if (this.contactDepth() < -.001) {
        this.step(Math.ceil(.4 / this.timestep));
        this.resetPose = new Float64Array(this.data.qpos);
        this.reset();
      }
    } catch (error) { this.data?.delete(); this.model.delete(); throw error; }
  }

  configureContacts({ profile, onTable = false } = {}) {
    const m = this.model;
    const option = m.opt;
    try {
      option.timestep = Math.min(option.timestep, .001);
      option.integrator = this.mujoco.mjtIntegrator.mjINT_IMPLICITFAST.value;
      option.solver = this.mujoco.mjtSolver.mjSOL_NEWTON.value;
      option.iterations = Math.max(option.iterations, 100);
      option.tolerance = Math.min(option.tolerance, 1e-10);
      option.enableflags |= this.mujoco.mjtEnableBit.mjENBL_SPECULATIVE.value;
      option.disableflags &= ~(1 | 8 | 16 | 256); // Constraints, limits, contacts, control clamping.
    } finally { option.delete(); }
    for (let geom = 0; geom < m.ngeom; geom++) {
      if (!m.geom_contype[geom] && !m.geom_conaffinity[geom]) continue; // Visuals stay non-colliding.
      m.geom_margin[geom] = Math.max(m.geom_margin[geom], .001);
      m.geom_solref.set([.004, 1], geom * 2);
      m.geom_solimp.set([.99, .999, .001, .5, 2], geom * 5);
    }
    if (onTable && profile && !profile.nativeTable) {
      const roots = new Set();
      for (let joint = 0; joint < m.njnt; joint++) {
        let body = m.jnt_bodyid[joint];
        // Imported objects have free joints; only mount the fixed robot trees.
        while (m.body_parentid[body] > 0) body = m.body_parentid[body];
        if (m.body_jntnum[body] === 0) roots.add(body);
      }
      for (const body of roots) { m.body_pos[body * 3 + 2] += .0001 - profile.floorZ; m.body_sameframe[body] = 0; }
      for (let geom = 0; geom < m.ngeom; geom++) if (m.geom_type[geom] === 0) { m.geom_pos[geom * 3 + 2] = -.75; m.geom_sameframe[geom] = 0; }
    }
  }

  modelName(kind, index) {
    const offset = this.model[kind === 'joint' ? 'name_jntadr' : `name_${kind}adr`][index];
    if (offset < 0) return '';
    const names = this.model.names;
    let end = offset;
    while (end < names.length && names[end] !== 0) end++;
    return new TextDecoder().decode(names.subarray(offset, end));
  }

  reset() {
    if (this.home >= 0) this.mujoco.mj_resetDataKeyframe(this.model, this.data, this.home);
    else this.mujoco.mj_resetData(this.model, this.data);
    if (this.resetPose) { this.data.qpos.set(this.resetPose); this.data.qvel.fill(0); }
    this.mujoco.mj_forward(this.model, this.data);
    this.targets = this.controls?.map((control) => control.home) ?? [];
    this.blocked = null;
  }

  setJoint(index, value) {
    const control = this.controls[index];
    if (!control || !Number.isFinite(value)) return;
    const bounded = Math.max(control.min, Math.min(control.max, value));
    this.targets[index] = bounded;
    this.blocked = null;
  }

  actualPositions() {
    return this.drives.map(drive => {
      if (drive.gripper) return this.fingers.reduce((sum, id) => sum + this.data.qpos[this.model.jnt_qposadr[id]] * 1000, 0);
      if (drive.position && drive.address >= 0) return this.data.qpos[drive.address] * drive.scale;
      if (drive.velocity && drive.velocityAddress >= 0) return this.data.qvel[drive.velocityAddress] * drive.scale;
      return this.data.actuator_force[drive.actuator];
    });
  }

  contactDepth() {
    const contacts = this.data.contact;
    let minimum = 0;
    try {
      for (let i = 0; i < this.data.ncon; i++) {
        const contact = contacts.get(i);
        try { minimum = Math.min(minimum, contact.dist); } finally { contact.delete(); }
      }
    } finally { contacts.delete(); }
    return minimum;
  }

  step(count = 1) {
    for (let i = 0; i < count; i++) {
      for (let index = 0; index < this.drives.length; index++) {
        const drive = this.drives[index];
        const desired = this.targets[index] / drive.scale;
        const rate = drive.mode === 'position' ? (drive.unit === '°' ? Math.PI / 3 : drive.gripper ? 255 : .1) : Math.max(1, (drive.max - drive.min) / drive.scale);
        const change = Math.max(-rate * this.timestep, Math.min(rate * this.timestep, desired - this.data.ctrl[index]));
        this.data.ctrl[index] += change;
      }
      this.mujoco.mj_step(this.model, this.data);
      if (!Number.isFinite(this.data.time) || !this.data.qpos.every(Number.isFinite)) throw new Error('The simulation became unstable. Reset to try again.');
    }
    this.mujoco.mj_forward(this.model, this.data);
    return true;
  }

  geometry() {
    const model = this.model;
    return this.visibleGeoms.map((id) => {
      const material = model.geom_matid[id];
      const geom = { type: model.geom_type[id], size: Array.from(model.geom_size.slice(id * 3, id * 3 + 3)),
        rgba: Array.from(material < 0 ? model.geom_rgba.slice(id * 4, id * 4 + 4) : model.mat_rgba.slice(material * 4, material * 4 + 4)),
        shininess: material < 0 ? 0.25 : model.mat_shininess[material],
        vertices: /** @type {Float32Array | undefined} */ (undefined),
        normals: /** @type {Float32Array | undefined} */ (undefined),
        uvs: /** @type {Float32Array | undefined} */ (undefined),
        framing: model.geom_type[id] !== 0 && !(model.geom_type[id] === 7 && /(?:tabletop|tablelegs)$/.test(this.modelName('mesh', model.geom_dataid[id]))),
        textureId: material < 0 ? -1 : model.mat_texid[material * 10 + 1],
        texrepeat: material < 0 ? [1, 1] : Array.from(model.mat_texrepeat.slice(material * 2, material * 2 + 2)) };
      if (geom.type === 7) {
        const mesh = model.geom_dataid[id];
        const faceStart = model.mesh_faceadr[mesh] * 3;
        const faceCount = model.mesh_facenum[mesh];
        const vertexStart = model.mesh_vertadr[mesh] * 3;
        const normalStart = model.mesh_normaladr[mesh] * 3;
        const vertices = new Float32Array(faceCount * 9);
        const normals = new Float32Array(faceCount * 9);
        const texcoordStart = model.mesh_texcoordadr[mesh];
        const uvs = texcoordStart >= 0 ? new Float32Array(faceCount * 6) : undefined;
        for (let corner = 0; corner < faceCount * 3; corner++) {
          const vertex = vertexStart + model.mesh_face[faceStart + corner] * 3;
          const normal = normalStart + model.mesh_facenormal[faceStart + corner] * 3;
          vertices.set(model.mesh_vert.subarray(vertex, vertex + 3), corner * 3);
          normals.set(model.mesh_normal.subarray(normal, normal + 3), corner * 3);
          if (uvs) {
            const uv = (texcoordStart + model.mesh_facetexcoord[faceStart + corner]) * 2;
            uvs.set(model.mesh_texcoord.subarray(uv, uv + 2), corner * 2);
          }
        }
        geom.vertices = vertices;
        geom.normals = normals;
        geom.uvs = uvs;
      }
      return geom;
    });
  }

  textures() {
    const m = this.model;
    return Array.from({ length: m.ntex }, (_, id) => id).filter((id) => m.tex_type[id] === 0).map((id) => ({
      id, width: m.tex_width[id], height: m.tex_height[id], channels: m.tex_nchannel[id],
      data: new Uint8Array(m.tex_data.slice(m.tex_adr[id], m.tex_adr[id] + m.tex_width[id] * m.tex_height[id] * m.tex_nchannel[id])),
    }));
  }

  snapshot() {
    const transforms = new Float32Array(this.visibleGeoms.length * 12);
    this.visibleGeoms.forEach((id, index) => {
      transforms.set(this.data.geom_xpos.subarray(id * 3, id * 3 + 3), index * 12);
      transforms.set(this.data.geom_xmat.subarray(id * 9, id * 9 + 9), index * 12 + 3);
    });
    return { time: this.data.time,
      positions: this.actualPositions(), targets: [...this.targets], blocked: null,
      contacts: this.data.ncon, penetration: Math.max(0, -this.contactDepth()), transforms };
  }
  dispose() { this.data.delete(); this.model.delete(); }
}
