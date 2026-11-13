import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import loadMujoco from '@mujoco/mujoco';
import { ArmSimulation } from '../public/simulation/physics.mjs';

// Measure the original models, rather than resizing robots to a generic table.
const catalog = JSON.parse(await readFile('public/simulation/robot-catalog.json', 'utf8'));
const mujoco = await loadMujoco();
const profiles = {};
for (const robot of catalog) {
  const files = await Promise.all(robot.files.map(async (name) => ({ name, bytes: new Uint8Array(await readFile('.simulation-cache/' + createHash('sha256').update(robot.sources[name]).digest('hex'))) })));
  const sim = new ArmSimulation(mujoco, files, robot.entry);
  try {
    const m = sim.model;
    const roots = [...new Set(sim.drives.filter((drive) => drive.joint >= 0).map((drive) => {
      let body = m.jnt_bodyid[drive.joint];
      while (m.body_parentid[body] > 0) body = m.body_parentid[body];
      return body;
    }))];
    let reach = 0;
    for (const drive of sim.drives.filter((drive) => drive.joint >= 0)) {
      let body = m.jnt_bodyid[drive.joint];
      let length = 0;
      while (m.body_parentid[body] > 0) {
        length += Math.hypot(...m.body_pos.subarray(body * 3, body * 3 + 3));
        body = m.body_parentid[body];
      }
      reach = Math.max(reach, length);
    }
    reach = Math.max(.25, reach);
    const nativeTable = robot.id === 'trossen_wxai';
    const floor = Array.from({ length: m.ngeom }, (_, id) => id).find((id) => m.geom_type[id] === 0);
    const floorZ = floor === undefined ? 0 : sim.data.geom_xpos[floor * 3 + 2];
    const baseX = roots.reduce((sum, body) => sum + sim.data.xpos[body * 3], 0) / roots.length;
    const baseY = roots.reduce((sum, body) => sum + sim.data.xpos[body * 3 + 1], 0) / roots.length;
    const small = reach < .55 && roots.length === 1;
    const large = reach > 1.4 || robot.id.includes('duo');
    const length = small ? .65 : large ? 1.6 : 1.21;
    const width = small ? .5 : large ? 1 : .76;
    profiles[robot.id] = {
      reach: +reach.toFixed(4), floorZ, nativeTable,
      tableLength: length, tableWidth: width,
      center: [+(baseX + Math.min(reach * .2, length * .2)).toFixed(4), +baseY.toFixed(4)],
      objectX: +(baseX + Math.min(reach * .35, length * .40)).toFixed(4), objectY: +baseY.toFixed(4),
    };
    console.log(robot.id, 'reach', reach.toFixed(2), 'workspace', length, 'x', width, nativeTable ? '(original built-in table)' : '');
  } finally { sim.dispose(); }
}
await writeFile('public/simulation/workspace-profiles.json', JSON.stringify(profiles, null, 2) + '\n');
