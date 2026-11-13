import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const destination = path.resolve("public/vendor/mujoco");
mkdirSync(destination, { recursive: true });
copyFileSync(require.resolve("@mujoco/mujoco"), path.join(destination, "mujoco.js"));
copyFileSync(require.resolve("@mujoco/mujoco/mujoco.wasm"), path.join(destination, "mujoco.wasm"));
console.log("Prepared the local MuJoCo WASM runtime.");
const pythonDestination = path.resolve('public/vendor/python');
mkdirSync(pythonDestination, { recursive: true });
for (const file of ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json']) {
  copyFileSync(require.resolve(`pyodide/${file}`), path.join(pythonDestination, file));
}
console.log('Prepared the local Python policy runtime.');
await import("./prepare-panda.mjs");
