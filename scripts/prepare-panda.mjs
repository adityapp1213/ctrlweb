import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import loadMujoco from "@mujoco/mujoco";
import { ArmSimulation } from "../public/simulation/physics.mjs";

const root = path.resolve("public/models/franka-emika-panda");
const manifest = JSON.parse(readFileSync(path.join(root, "manifest.json"), "utf8"));
const files = manifest.files.map((name) => ({ name, bytes: new Uint8Array(readFileSync(path.join(root, name))) }));
const runtime = path.resolve("public/vendor/mujoco");
const binary = path.join(runtime, "panda.mjb");
const stamp = path.join(runtime, "panda-build.json");
const hash = createHash("sha256").update(readFileSync("node_modules/@mujoco/mujoco/package.json"));
for (const file of files) hash.update(file.bytes);
const key = hash.digest("hex");
if (!existsSync(binary) || !existsSync(stamp) || JSON.parse(readFileSync(stamp, "utf8")).key !== key) {
  console.log("Compiling the official Panda once for fast browser loading…");
  const mujoco = await loadMujoco();
  const simulation = new ArmSimulation(mujoco, files);
  const buffer = new mujoco.Uint8Buffer(Number(mujoco.mj_sizeModel(simulation.model)));
  try {
    mujoco.mj_saveModel(simulation.model, null, buffer);
    writeFileSync(binary, new Uint8Array(buffer.GetView()));
    writeFileSync(stamp, JSON.stringify({ key, engine: mujoco.mj_versionString(), source: manifest.revision }));
  } finally { buffer.delete(); simulation.dispose(); }
}
console.log("Official Panda binary model ready.");
