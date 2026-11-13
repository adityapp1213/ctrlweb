import loadMujoco from "/vendor/mujoco/mujoco.js";
import { ArmSimulation } from "./physics.mjs";
import { composeScene } from "./scene.mjs";

let simulation;
let running = false;
let timer;
let lastTime = 0;
let accumulator = 0;
let lastPublish = 0;

function publish() {
  const state = simulation.snapshot();
  self.postMessage({ type: "state", ...state, running }, [state.transforms.buffer]);
}

function stop() { running = false; clearTimeout(timer); accumulator = 0; }

function fail(error) {
  stop();
  self.postMessage({ type: "error", message: error instanceof Error ? error.message : "Simulation could not start." });
}

function tick() {
  if (!running) return;
  try {
    const now = performance.now();
    accumulator += Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const steps = Math.min(25, Math.floor(accumulator / simulation.timestep));
    if (steps) {
      simulation.step(steps);
      accumulator -= steps * simulation.timestep;
    }
    if (now - lastPublish >= 1000 / 30) { publish(); lastPublish = now; }
    timer = setTimeout(tick, 8);
  } catch (error) { fail(error); }
}

self.onmessage = async ({ data: message }) => {
  try {
    if (message.type === "init") {
      const mujoco = await loadMujoco({ locateFile: (file) => `/vendor/mujoco/${file}` });
      const catalog = await (await fetch('/simulation/robot-catalog.json')).json();
      const robot = catalog.find(item => item.id === message.robotId);
      if (!robot) throw new Error('Unknown robot.');
      const environment = message.environment || 'ground';
      const props = message.props || [];
      const profiles = await (await fetch('/simulation/workspace-profiles.json')).json();
      const profile = profiles[robot.id];
      if (!profile) throw new Error('The robot workspace profile is missing.');
      let files;
      if (robot.id === 'franka_emika_panda' && environment === 'ground' && !props.length) {
        const response = await fetch('/vendor/mujoco/panda.mjb');
        if (!response.ok) throw new Error('The prepared Panda model is missing. Restart the development server.');
        files = [{ name: 'panda.mjb', bytes: new Uint8Array(await response.arrayBuffer()) }];
      } else {
        let cache;
        try { cache = await caches.open('menagerie-' + robot.revision); } catch { /* Browser cache can be unavailable. */ }
        const names = robot.id === 'franka_emika_panda'
          ? (await (await fetch('/models/franka-emika-panda/manifest.json')).json()).files
          : robot.files;
        files = new Array(names.length);
        let next = 0;
        let loaded = 0;
        await Promise.all(Array.from({ length: 5 }, async () => {
          while (next < names.length) {
            const index = next++;
            const name = names[index];
            const url = robot.id === 'franka_emika_panda' ? '/models/franka-emika-panda/' + name : robot.sources[name];
            let response = await cache?.match(url);
            if (!response) {
              response = await fetch(url);
              if (response.ok) try { await cache?.put(url, response.clone()); } catch { /* Best-effort asset caching. */ }
            }
            if (!response.ok) throw new Error('Could not load model asset: ' + name);
            files[index] = { name, bytes: new Uint8Array(await response.arrayBuffer()) };
            self.postMessage({ type: 'progress', loaded: ++loaded, total: names.length });
          }
        }));
        let assets = [];
        if (environment !== 'ground' || props.length) {
          const manifest = await (await fetch('/environments/manifest.json')).json();
          assets = await Promise.all(manifest.files.filter((file) => /\.(xml|obj|msh|png)$/.test(file.name)).map(async (file) => {
            const response = await fetch('/environments/' + file.name);
            if (!response.ok) throw new Error('Could not load community asset: ' + file.name);
            return { name: 'environment/' + file.name, bytes: new Uint8Array(await response.arrayBuffer()) };
          }));
        }
        files = composeScene(files, robot.entry, environment, props, { assets, profile, robotId: robot.id });
      }
      simulation = new ArmSimulation(mujoco, files, robot.entry, { profile, onTable: environment !== 'ground' || props.includes('table') });
      self.postMessage({ type: "ready", geoms: simulation.geometry(), textures: simulation.textures(), controls: simulation.controls });
      publish();
      return;
    }
    if (!simulation) return;
    switch (message.type) {
      case "play":
        if (!running) { running = true; lastTime = performance.now(); lastPublish = 0; tick(); }
        break;
      case "pause": stop(); publish(); break;
      case "reset": stop(); simulation.reset(); publish(); break;
      case "joint":
        simulation.setJoint(message.index, message.value);
        // Manual edits drive actuators through physics; never teleport qpos.
        if (!running) { running = true; lastTime = performance.now(); lastPublish = 0; tick(); }
        break;
      case 'targets':
        if (!Array.isArray(message.values) || message.values.length !== simulation.controls.length || !message.values.every(Number.isFinite)) throw new Error('Policy must return one finite target per actuator.');
        message.values.forEach((value, index) => simulation.setJoint(index, value));
        if (!running) { running = true; lastTime = performance.now(); lastPublish = 0; tick(); }
        break;
      case "dispose": stop(); simulation.dispose(); self.close(); break;
    }
  } catch (error) { fail(error); }
};
