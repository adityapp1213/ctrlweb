import { loadPyodide } from '/vendor/python/pyodide.mjs';

let python;
let namespace;
let logWindow = 0;
let logCount = 0;
function log(message) {
  const now = performance.now();
  if (now - logWindow > 1000) { logWindow = now; logCount = 0; }
  if (logCount++ < 20) self.postMessage({ type: 'log', message: String(message).slice(0, 1000) });
}
self.onmessage = async ({ data: message }) => {
  try {
    if (message.type === 'init') {
      python = await loadPyodide({ indexURL: '/vendor/python/', stdout: log, stderr: log });
      self.postMessage({ type: 'booted' });
      const dictionary = python.globals.get('dict');
      try { namespace = dictionary(); } finally { dictionary.destroy(); }
      await python.runPythonAsync(message.source + '\nimport json as _policy_json\nassert callable(policy), "Define policy(obs)."', { globals: namespace });
      self.postMessage({ type: 'ready' });
    } else if (message.type === 'observe' && namespace) {
      namespace.set('_observation_json', JSON.stringify(message.observation));
      const result = await python.runPythonAsync('_policy_json.dumps(policy(_policy_json.loads(_observation_json)), allow_nan=False)', { globals: namespace });
      self.postMessage({ type: 'action', values: JSON.parse(result) });
    }
  } catch (error) { self.postMessage({ type: 'error', message: String(error?.message || error).slice(-2500) }); }
};
