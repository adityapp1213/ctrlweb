import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Pin upstream assets so future Menagerie changes cannot silently change physics.
const revision = "370c43965323c0944b433b202aac5058b5f907a9";
const source = `https://raw.githubusercontent.com/google-deepmind/mujoco_menagerie/${revision}/franka_emika_panda`;
const destination = path.resolve("public/models/franka-emika-panda");
await mkdir(path.join(destination, "assets"), { recursive: true });
async function download(file) {
  const response = await fetch(`${source}/${file}`);
  if (!response.ok) throw new Error(`Could not download ${file}: ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  await writeFile(path.join(destination, file), bytes);
  return bytes;
}
const robot = new TextDecoder().decode(await download("panda.xml"));
const assets = [...new Set([...robot.matchAll(/file="([^"]+)"/g)].map((match) => `assets/${match[1]}`))];
const files = ["scene.xml", "LICENSE", "README.md", ...assets];
let next = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (next < files.length) await download(files[next++]);
}));
await writeFile(path.join(destination, "manifest.json"), JSON.stringify({
  name: "Franka Emika Panda", revision, source,
  files: ["scene.xml", "panda.xml", ...assets],
}, null, 2) + "\n");
console.log(`Downloaded the unchanged official Panda model (${assets.length} meshes), scene, and license.`);
