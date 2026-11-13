import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import loadMujoco from '@mujoco/mujoco';
import { ArmSimulation } from '../public/simulation/physics.mjs';
import { composeScene } from '../public/simulation/scene.mjs';

const root = new URL('../public/models/franka-emika-panda/', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('manifest.json', root), 'utf8'));
const files = manifest.files.map((name: string) => ({ name, bytes: new Uint8Array(readFileSync(new URL(name, root))) }));
const environmentManifest = JSON.parse(readFileSync(new URL('../public/environments/manifest.json', import.meta.url), 'utf8'));
const environmentAssets = environmentManifest.files.filter((file: { name: string }) => /\.(xml|obj|msh|png)$/.test(file.name)).map((file: { name: string }) => ({ name: 'environment/' + file.name, bytes: new Uint8Array(readFileSync(new URL('../public/environments/' + file.name, import.meta.url))) }));
const profiles = JSON.parse(readFileSync(new URL('../public/simulation/workspace-profiles.json', import.meta.url), 'utf8'));
const profile = profiles.franka_emika_panda;

test('every catalog robot has an original preview, pinned source, and bundled license', () => {
  const catalog = JSON.parse(readFileSync(new URL('../public/simulation/robot-catalog.json', import.meta.url), 'utf8'));
  const previews = JSON.parse(readFileSync(new URL('../public/previews/manifest.json', import.meta.url), 'utf8'));
  assert.equal(new Set(previews.map((preview: { robotId: string }) => preview.robotId)).size, catalog.length);
  for (const robot of catalog) {
    const preview = previews.find((image: { robotId: string }) => image.robotId === robot.id);
    assert.ok(preview, `missing preview for ${robot.id}`);
    assert.ok(preview.source.includes(`/blob/${robot.revision}/`));
    const image = readFileSync(new URL(`../public${preview.src}`, import.meta.url));
    assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `invalid PNG for ${robot.id}`);
    const license = readFileSync(new URL(`../public${preview.license}`, import.meta.url), 'utf8');
    assert.ok(license.length > 100 && !license.trim().startsWith('../'), `unresolved license for ${robot.id}`);
  }
});

test('official Panda meshes, actuators, coupled gripper, and home-keyframe reset work in real MuJoCo', async () => {
  const mujoco = await loadMujoco();
  const sim = new ArmSimulation(mujoco, files);
  try {
    assert.equal(sim.model.nu, 8);
    assert.equal(sim.model.nq, 9);
    assert.equal(sim.controls.length, 8);
    assert.deepEqual(sim.controls.map((control) => control.id), [0, 1, 2, 3, 4, 5, 6, 7], 'actuator identities must be stable and unique');
    assert.deepEqual(sim.controls.map((control) => control.name), Array.from({ length: 8 }, (_, index) => `actuator${index + 1}`), 'names must be decoded from the model name buffer');
    assert.equal(sim.controls[0].label, 'joint1');
    const initial = sim.snapshot();
    assert.equal(initial.time, 0);
    assert.ok(Math.abs(initial.positions[3] + 90) < .01);
    assert.equal(initial.positions[7], 80);
    const geoms = sim.geometry();
    const visualMeshes = geoms.filter((geom: { type: number }) => geom.type === 7);
    assert.ok(visualMeshes.length > 50, 'renders detailed visual meshes, not collision hulls');
    assert.ok(visualMeshes.every((geom) => geom.vertices?.every(Number.isFinite) && geom.normals?.every(Number.isFinite)));
    sim.setJoint(0, 900);
    assert.equal(sim.snapshot().positions[0], initial.positions[0], 'manual controls never teleport joints');
    assert.equal(sim.snapshot().targets[0], sim.controls[0]?.max);
    sim.setJoint(7, 20);
    assert.equal(sim.snapshot().positions[7], 80, 'the gripper is also driven through physics');
    sim.reset();
    sim.setJoint(0, 30);
    assert.equal(sim.snapshot().positions[0], 0, 'running controls do not teleport the robot');
    sim.setJoint(7, 0);
    sim.step(Math.round(2 / sim.timestep));
    const advanced = sim.snapshot();
    assert.ok(advanced.time > 1.9);
    assert.ok(advanced.positions[0] > 20, 'official actuator moves the arm');
    assert.ok(advanced.positions[7] < 5, 'official tendon closes both fingers');
    assert.ok(advanced.transforms.every(Number.isFinite));
    sim.reset();
    assert.deepEqual(sim.snapshot(), initial);
    assert.ok(sim.data.qvel.every((velocity: number) => velocity === 0));
    sim.setJoint(1, -100);
    sim.setJoint(3, -170);
    sim.setJoint(5, 0);
    let deepest = 0;
    let contactSteps = 0;
    for (let i = 0; i < 400; i++) {
      sim.step(10);
      deepest = Math.min(deepest, sim.contactDepth());
      if (sim.data.ncon) contactSteps++;
    }
    assert.ok(contactSteps > 10, 'native contact constraints must engage');
    assert.ok(deepest > -.0015, `native contact penetration was ${deepest} m`);
    assert.ok(sim.data.time > 3.99, 'contacts must not rewind or freeze simulation time');
    assert.ok(sim.snapshot().positions.some((position: number, index: number) => Math.abs(position - sim.snapshot().targets[index]) > 10), 'physical contact must prevent an unreachable target');
    sim.reset();
    sim.setJoint(1, 100);
    const floorId = mujoco.mj_name2id(sim.model, mujoco.mjtObj.mjOBJ_GEOM.value, 'floor');
    let floorContact = false;
    for (let sample = 0; sample < 400; sample++) {
      sim.step(10);
      const contacts = sim.data.contact;
      try {
        for (let i = 0; i < sim.data.ncon; i++) {
          const contact = contacts.get(i);
          try { if (Array.from(contact.geom).includes(floorId)) floorContact = true; } finally { contact.delete(); }
        }
      } finally { contacts.delete(); }
      assert.ok(sim.contactDepth() > -.0015, 'floor contact must resist the commanded motion');
    }
    assert.ok(floorContact, 'the actual native floor collider must participate');
    assert.ok(sim.snapshot().positions[1] < 60, 'the shoulder cannot drive the arm through the floor toward its 100-degree target');
    sim.reset();
    const buffer = new mujoco.Uint8Buffer(Number(mujoco.mj_sizeModel(sim.model)));
    try {
      mujoco.mj_saveModel(sim.model, null, buffer);
      const compiled = new ArmSimulation(mujoco, [{ name: 'panda.mjb', bytes: new Uint8Array(buffer.GetView()) }]);
      try { assert.deepEqual(compiled.snapshot(), initial); } finally { compiled.dispose(); }
    } finally { buffer.delete(); }
  } finally { sim.dispose(); }
});

test('workbench scene props compile with real gravity, contacts, and deterministic reset', async () => {
  const mujoco = await loadMujoco();
  const scene = composeScene(files, 'scene.xml', 'sorting', [], { assets: environmentAssets, profile, robotId: 'franka_emika_panda' });
  const sim = new ArmSimulation(mujoco, scene, 'scene.xml', { profile, onTable: true });
  try {
    assert.equal(sim.model.nu, 8);
    assert.equal(sim.model.nq, 30, 'three community objects add twenty-one coordinates');
    const initial = sim.snapshot();
    sim.step(1000);
    assert.ok(sim.data.time > .99);
    const geom = mujoco.mj_name2id(sim.model, mujoco.mjtObj.mjOBJ_GEOM.value, 'env_box');
    assert.ok(sim.data.geom_xpos[geom * 3 + 2] > .028 && sim.data.geom_xpos[geom * 3 + 2] < .032, 'block must settle on the original ALOHA tabletop');
    const floor = mujoco.mj_name2id(sim.model, mujoco.mjtObj.mjOBJ_GEOM.value, 'floor');
    assert.ok(Math.abs(sim.data.geom_xpos[floor * 3 + 2] + .75) < 1e-8, 'the floor must sit below the table, not through the mounted robot');
    const geoms = sim.geometry();
    assert.ok(geoms.filter((geom) => geom.uvs?.length).length >= 4, 'preserves table and object UV coordinates');
    assert.ok(sim.textures().length >= 5, 'preserves actual community textures');
    assert.ok(sim.contactDepth() > -.0015);
    sim.reset();
    assert.deepEqual(sim.snapshot(), initial);
  } finally { sim.dispose(); }
});
