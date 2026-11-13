import { mkdir, readFile, writeFile } from 'node:fs/promises';

const catalog = JSON.parse(await readFile('public/simulation/robot-catalog.json', 'utf8'));
const revision = catalog[0].revision;
const raw = `https://raw.githubusercontent.com/google-deepmind/mujoco_menagerie/${revision}/`;
const response = await fetch(`https://api.github.com/repos/google-deepmind/mujoco_menagerie/git/trees/${revision}?recursive=1`);
if (!response.ok) throw new Error('Could not inspect official preview assets.');
const tree = (await response.json()).tree;
await mkdir('public/previews', { recursive: true });
const manifest = [];
let next = 0;
await Promise.all(Array.from({ length: 5 }, async () => {
  while (next < catalog.length) {
    const robot = catalog[next++];
    const images = tree.filter(file => file.type === 'blob' && file.path.startsWith(robot.id + '/') && /\.(png|jpg|webp)$/i.test(file.path) && !file.path.includes('/assets/'));
    if (!images.length) throw new Error(`No published image for ${robot.id}.`);
    const image = images[0];
    const imageResponse = await fetch(raw + image.path);
    if (!imageResponse.ok) throw new Error(`Could not download ${image.path}.`);
    const extension = image.path.split('.').pop();
    const filename = `${robot.id}.${extension}`;
    await writeFile(`public/previews/${filename}`, new Uint8Array(await imageResponse.arrayBuffer()));
    const licenseResponse = await fetch(raw + robot.id + '/LICENSE');
    if (!licenseResponse.ok) throw new Error(`Could not read the license for ${robot.id}.`);
    let license = await licenseResponse.text();
    // Some robot folders share an upstream license via a Git symlink.
    if (license.trim().startsWith('../') && license.trim().length < 150) {
      const url = new URL(license.trim(), raw + robot.id + '/LICENSE');
      const shared = await fetch(url);
      if (!shared.ok) throw new Error('Could not resolve shared license.');
      license = await shared.text();
    }
    await writeFile(`public/previews/${robot.id}.LICENSE.txt`, license);
    manifest.push({ robotId: robot.id, src: '/previews/' + filename, source: `https://github.com/google-deepmind/mujoco_menagerie/blob/${revision}/${image.path}`, license: '/previews/' + robot.id + '.LICENSE.txt' });
  }
}));
manifest.sort((a, b) => catalog.findIndex(robot => robot.id === a.robotId) - catalog.findIndex(robot => robot.id === b.robotId));
await writeFile('public/previews/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
await writeFile('public/previews/ATTRIBUTION.md', '# Published MuJoCo Menagerie previews\n\nOriginal, unmodified images from Google DeepMind MuJoCo Menagerie and its model contributors. Individual model licenses are preserved alongside the images.\n\n' + manifest.map(image => `- [${image.robotId}](${image.source}) · [license](.${image.license.replace('/previews', '')})`).join('\n') + '\n');
console.log(`Downloaded ${manifest.length} original published robot previews and their licenses.`);
