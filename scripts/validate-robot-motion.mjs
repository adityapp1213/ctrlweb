import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import loadMujoco from '@mujoco/mujoco';
import { ArmSimulation } from '../public/simulation/physics.mjs';
import { composeScene } from '../public/simulation/scene.mjs';

const catalog = JSON.parse(await readFile('public/simulation/robot-catalog.json'));
const profiles = JSON.parse(await readFile('public/simulation/workspace-profiles.json'));
const mujoco = await loadMujoco();
const report = [];
for (const robot of catalog) {
  let sim;
  try {
    const files = await Promise.all(robot.files.map(async (name) => ({ name, bytes: new Uint8Array(await readFile('.simulation-cache/' + createHash('sha256').update(robot.sources[name]).digest('hex'))) })));
    const profile = profiles[robot.id];
    sim = new ArmSimulation(mujoco, composeScene(files, robot.entry, 'ground', [], { profile, robotId: robot.id }), robot.entry);
    const arm = sim.controls.filter((control) => control.unit === '°');
    const commands = [
      [[arm[1]?.id, arm[1]?.max]],
      [[arm[1]?.id, arm[1]?.min], [arm[3]?.id, arm[3]?.min], [arm[5]?.id, arm[5]?.min]],
    ];
    let deepest = 0;
    let contactSamples = 0;
    for (const command of commands) {
      sim.reset();
      for (const [id, target] of command) if (id !== undefined) sim.setJoint(id, target);
      for (let sample = 0; sample < 300; sample++) {
        sim.step(10);
        deepest = Math.min(deepest, sim.contactDepth());
        if (sim.data.ncon) contactSamples++;
        assert.ok(sim.data.qpos.every(Number.isFinite), 'nonfinite joint state');
      }
      assert.ok(sim.data.time > 2.99, 'simulation time rewound or stopped during contact');
    }
    assert.ok(deepest > -.002, `native contact penetration ${deepest.toFixed(6)} m`);
    report.push({ id: robot.id, passed: true, deepest, contactSamples });
    console.log('PASS', robot.id, 'depth', deepest.toFixed(6), 'contact samples', contactSamples);
  } catch (error) {
    report.push({ id: robot.id, passed: false, error: error.message });
    console.log('FAIL', robot.id, error.message);
  } finally { sim?.dispose(); }
}
await writeFile('.simulation-cache/motion-report.json', JSON.stringify(report, null, 2));
console.log('Motion tests:', report.filter((item) => item.passed).length, '/', catalog.length);
if (report.some((item) => !item.passed)) process.exitCode = 1;
