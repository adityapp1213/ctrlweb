const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const cache = new Map();

// Exercise the source modules directly without producing build artifacts.
function loadTypeScript(filename, overrides = {}) {
  const absolute = path.resolve(root, filename);
  const hasOverrides = Object.keys(overrides).length > 0;
  if (!hasOverrides && cache.has(absolute)) return cache.get(absolute).exports;
  const mod = new Module(absolute, module);
  mod.filename = absolute;
  mod.paths = Module._nodeModulePaths(path.dirname(absolute));
  if (!hasOverrides) cache.set(absolute, mod);
  const originalRequire = mod.require.bind(mod);
  mod.require = (specifier) => {
    if (Object.hasOwn(overrides, specifier)) return overrides[specifier];
    if (specifier.endsWith(".module.css")) {
      return { __esModule: true, default: new Proxy({}, { get: (_, name) => `mapped-${String(name)}` }) };
    }
    if (specifier.startsWith("@/") || specifier.startsWith(".")) {
      const base = specifier.startsWith("@/")
        ? path.join(root, specifier.slice(2))
        : path.resolve(path.dirname(absolute), specifier);
      const target = [base, `${base}.ts`, `${base}.tsx`].find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
      if (target && /\.tsx?$/.test(target)) return loadTypeScript(target);
    }
    return originalRequire(specifier);
  };
  const { outputText } = ts.transpileModule(fs.readFileSync(absolute, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2017,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: absolute,
  });
  mod._compile(outputText, absolute);
  return mod.exports;
}

module.exports = { loadTypeScript, root };
