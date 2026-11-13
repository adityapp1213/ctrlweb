import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Pinned, unmodified upstream files. Scene composition lives in scene.mjs.
const sources = [
  {
    id: 'menagerie', repo: 'google-deepmind/mujoco_menagerie', revision: '370c43965323c0944b433b202aac5058b5f907a9',
    files: ['aloha/LICENSE', 'aloha/scene.xml', 'aloha/assets/tabletop.obj', 'aloha/assets/tablelegs.obj', 'aloha/assets/small_meta_table_diffuse.png', 'franka_emika_panda/LICENSE', 'franka_emika_panda/mjx_single_cube.xml'],
  },
  {
    id: 'robosuite', repo: 'ARISE-Initiative/robosuite', revision: '5ce6643f3092639d08f7b0f90ed1c6a84f50552c',
    files: ['LICENSE', 'robosuite/models/assets/arenas/bins_arena.xml', 'robosuite/models/assets/objects/can.xml', 'robosuite/models/assets/objects/lemon.xml', 'robosuite/models/assets/objects/meshes/can.msh', 'robosuite/models/assets/objects/meshes/lemon.msh', 'robosuite/models/assets/textures/soda.png', 'robosuite/models/assets/textures/lemon.png', 'robosuite/models/assets/textures/light-wood.png', 'robosuite/models/objects/primitive/ball.py', 'robosuite/controllers/parts/generic/joint_pos.py', 'robosuite/controllers/config/default/parts/joint_position.json'],
  },
];
const files = [];
await Promise.all(sources.map(async (source) => {
  for (const file of source.files) {
    const response = await fetch(`https://raw.githubusercontent.com/${source.repo}/${source.revision}/${file}`);
    if (!response.ok) throw new Error(`Cannot download ${file}: ${response.status}`);
    const name = `${source.id}/${file}`;
    const output = path.join('public/environments', name);
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, new Uint8Array(await response.arrayBuffer()));
    files.push({ name, source: `https://github.com/${source.repo}/blob/${source.revision}/${file}` });
  }
}));
files.sort((a, b) => a.name.localeCompare(b.name));
await writeFile('public/environments/manifest.json', JSON.stringify({ sources, files }, null, 2) + '\n');
await writeFile('public/environments/ATTRIBUTION.md', '# Community environment assets\n\nThe original files are unmodified. Menagerie ALOHA supplies the textured table meshes and collision dimensions; Menagerie Panda supplies the calibration block. Robosuite supplies textured can/lemon meshes, the sorting bin, and the ball/controller references. Original licenses are included in their source folders.\n\nThe application assembles these components, configures table dimensions and placement for each robot, and tunes native MuJoCo contact parameters. It does not rescale robot models or replace their actuator definitions.\n\n' + files.map((file) => `- [${file.name}](${file.source})`).join('\n') + '\n');
console.log(`Downloaded ${files.length} original community source files.`);
