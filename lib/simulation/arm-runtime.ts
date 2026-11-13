import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { RobotControl, SimulationSetup } from "./panda";

export type SimulationState = { time: number; positions: number[]; running: boolean; targets?: number[]; blocked?: string | null; contacts?: number; penetration?: number };
type Geom = { type: number; size: number[]; rgba: number[]; shininess: number; vertices?: Float32Array; normals?: Float32Array; uvs?: Float32Array; textureId: number; texrepeat: number[]; framing: boolean };
type Texture = { id: number; width: number; height: number; channels: number; data: Uint8Array };
type WorkerMessage =
  | { type: "ready"; geoms: Geom[]; textures: Texture[]; controls: RobotControl[] }
  | { type: 'progress'; loaded: number; total: number }
  | ({ type: "state"; transforms: Float32Array } & SimulationState)
  | { type: "error"; message: string };

export function createArmRuntime(host: HTMLElement, callbacks: {
  onReady: (controls: RobotControl[]) => void;
  onState: (state: SimulationState) => void;
  onError: (message: string) => void;
  onProgress?: (loaded: number, total: number) => void;
}, setup: SimulationSetup) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.domElement.setAttribute("aria-label", "Official MuJoCo Menagerie robot. Drag to orbit and scroll to zoom.");
  renderer.domElement.setAttribute("role", "img");
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#20242a");
  scene.fog = new THREE.Fog("#20242a", 4, 12);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 30);
  camera.up.set(0, 0, 1);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 0.8;
  controls.maxDistance = 6;
  controls.maxPolarAngle = Math.PI * 0.49;
  controls.target.set(0.1, 0, 0.45);
  const homePosition = new THREE.Vector3(1.5, -1.8, 1.25);
  const homeTarget = new THREE.Vector3(.12, 0, .42);
  const home = () => { camera.position.copy(homePosition); controls.target.copy(homeTarget); controls.update(); requestRender(); };
  scene.add(new THREE.HemisphereLight(0xffffff, 0x747981, 1.5));
  const light = new THREE.DirectionalLight(0xffffff, 2.5);
  light.position.set(-1, -2, 5);
  light.castShadow = true;
  light.shadow.mapSize.set(2048, 2048);
  light.shadow.camera.left = -2;
  light.shadow.camera.right = 2;
  light.shadow.camera.top = 2;
  light.shadow.camera.bottom = -2;
  light.shadow.normalBias = 0.002;
  scene.add(light);
  const textures: THREE.DataTexture[] = [];

  const meshes: THREE.Mesh[] = [];
  let disposed = false;
  let frame = 0;
  let worker: Worker | undefined;
  let failed = false;
  let needsFraming = true;
  function requestRender() {
    if (!disposed && !frame) frame = requestAnimationFrame(() => { frame = 0; renderer.render(scene, camera); });
  }
  function fail(message: string) {
    if (disposed || failed) return;
    failed = true;
    worker?.postMessage({ type: "pause" });
    callbacks.onError(message);
  }
  const onContextLost = (event: Event) => { event.preventDefault(); fail("The 3D view lost its graphics context. Reload the scene to continue."); };
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);
  controls.addEventListener("change", requestRender);
  const resize = new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    requestRender();
  });
  resize.observe(host);
  home();

  function geometry({ type, size, vertices, normals, uvs }: Geom): THREE.BufferGeometry {
    switch (type) {
      case 0: return new THREE.PlaneGeometry(20, 20);
      case 2: return new THREE.SphereGeometry(size[0], 28, 20);
      case 4: return new THREE.SphereGeometry(1, 28, 20).scale(size[0], size[1], size[2]);
      case 3: return new THREE.CapsuleGeometry(size[0], size[1] * 2, 8, 20).rotateX(Math.PI / 2);
      case 5: return new THREE.CylinderGeometry(size[0], size[0], size[1] * 2, 32).rotateX(Math.PI / 2);
      case 6: return new THREE.BoxGeometry(size[0] * 2, size[1] * 2, size[2] * 2);
      case 7: {
        if (!vertices || !normals) throw new Error("Official mesh data is missing.");
        const mesh = new THREE.BufferGeometry();
        mesh.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        mesh.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        if (uvs) mesh.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        mesh.computeBoundingSphere();
        return mesh;
      }
      default: throw new Error(`Unsupported geometry in the predefined scene: ${type}`);
    }
  }

  const timeout = window.setTimeout(() => fail("The official model took too long to load. Check your connection and reload the scene."), 60000);
  try {
    worker = new Worker("/simulation/physics-worker.mjs", { type: "module", name: "atom-mujoco" });
    worker.onmessage = ({ data: message }: MessageEvent<WorkerMessage>) => {
      if (disposed || failed) return;
      try {
        if (message.type === "error") { fail(message.message); return; }
        if (message.type === 'progress') { callbacks.onProgress?.(message.loaded, message.total); return; }
        if (message.type === "ready") {
          for (const geom of message.geoms) {
            const material = new THREE.MeshStandardMaterial({ color: new THREE.Color().fromArray(geom.rgba), roughness: 1 - geom.shininess, metalness: 0.05 });
            const source = message.textures.find((texture) => texture.id === geom.textureId);
            if (source) {
              const pixels = new Uint8Array(source.width * source.height * 4);
              for (let pixel = 0; pixel < source.width * source.height; pixel++) {
                const at = pixel * source.channels;
                pixels.set([source.data[at], source.data[at + (source.channels > 1 ? 1 : 0)], source.data[at + (source.channels > 2 ? 2 : 0)], source.channels === 4 ? source.data[at + 3] : 255], pixel * 4);
              }
              const texture = new THREE.DataTexture(pixels, source.width, source.height, THREE.RGBAFormat);
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
              texture.magFilter = THREE.LinearFilter;
              texture.minFilter = THREE.LinearMipmapLinearFilter;
              texture.generateMipmaps = true;
              texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
              if (!geom.uvs) texture.repeat.fromArray(geom.texrepeat).multiplyScalar(geom.type === 0 ? 20 : 1);
              texture.needsUpdate = true;
              textures.push(texture);
              material.map = texture;
            }
            const mesh = new THREE.Mesh(geometry(geom), material);
            mesh.castShadow = geom.type !== 0;
            mesh.receiveShadow = true;
            mesh.matrixAutoUpdate = false;
            mesh.userData.framing = geom.framing;
            scene.add(mesh);
            meshes.push(mesh);
          }
          clearTimeout(timeout);
          callbacks.onReady(message.controls);
        } else {
          const t = message.transforms;
          meshes.forEach((mesh, i) => {
            const o = i * 12;
            mesh.matrix.set(t[o + 3], t[o + 4], t[o + 5], t[o], t[o + 6], t[o + 7], t[o + 8], t[o + 1], t[o + 9], t[o + 10], t[o + 11], t[o + 2], 0, 0, 0, 1);
            mesh.matrixWorldNeedsUpdate = true;
          });
          if (needsFraming) {
            needsFraming = false;
            scene.updateMatrixWorld(true);
            const bounds = new THREE.Box3();
            meshes.filter((mesh) => mesh.userData.framing).forEach((mesh) => bounds.expandByObject(mesh));
            if (!bounds.isEmpty()) {
              const center = bounds.getCenter(new THREE.Vector3());
              const distance = Math.max(1.2, bounds.getSize(new THREE.Vector3()).length() * 1.7);
              controls.target.copy(center);
              camera.position.copy(center).add(new THREE.Vector3(.6, -.8, .5).normalize().multiplyScalar(distance));
              homePosition.copy(camera.position);
              homeTarget.copy(center);
              controls.minDistance = distance * .25;
              controls.maxDistance = distance * 4;
              controls.update();
            }
          }
          callbacks.onState({ time: message.time, positions: message.positions, running: message.running, targets: message.targets, contacts: message.contacts, penetration: message.penetration });
          requestRender();
        }
      } catch { fail("The scene could not be rendered. Reload it to try again."); }
    };
    worker.onerror = () => fail("MuJoCo could not start. Reload the scene to try again.");
    worker.postMessage({ type: "init", ...setup });
  } catch { fail("Your browser could not start the simulation worker."); }

  const onVisibility = () => { if (document.hidden) worker?.postMessage({ type: "pause" }); };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    play: () => { if (!document.hidden) worker?.postMessage({ type: "play" }); },
    pause: () => worker?.postMessage({ type: "pause" }),
    reset: () => worker?.postMessage({ type: "reset" }),
    setJoint: (index: number, value: number) => worker?.postMessage({ type: "joint", index, value }),
    setTargets: (values: number[]) => { if (!document.hidden) worker?.postMessage({ type: 'targets', values }); },
    home,
    dispose() {
      disposed = true;
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      resize.disconnect();
      controls.removeEventListener("change", requestRender);
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      document.removeEventListener("visibilitychange", onVisibility);
      worker?.terminate(); // Also releases the worker's entire WASM heap.
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      textures.forEach((texture) => texture.dispose());
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

export type ArmRuntime = ReturnType<typeof createArmRuntime>;
