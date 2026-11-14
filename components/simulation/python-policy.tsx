"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { useUser } from '@clerk/nextjs';
import type { ArmRuntime, SimulationState } from '@/lib/simulation/arm-runtime';
import type { RobotControl } from '@/lib/simulation/panda';
import styles from './workspace-tools.module.css';

const TEMPLATE = `import math

def policy(obs):
    """Return one target per actuator, in the UI's units."""
    targets = list(obs["home"])
    # A slow, small sweep of the first position-controlled joint.
    for i, control in enumerate(obs["controls"]):
        if control["mode"] == "position" and control["unit"] == "°":
            amplitude = min(12, (control["max"] - control["min"]) * 0.05)
            targets[i] += amplitude * math.sin(obs["time"] * 0.7)
            break
    return targets
`;
const EDITOR_EXTENSIONS = [python()];
const STUDIO_EXTENSIONS = [...EDITOR_EXTENSIONS, EditorView.lineWrapping];
const EDITOR_SETUP = { foldGutter: false, highlightActiveLine: true };
export type PolicyHandle = { stop: () => void };

export const PythonPolicy = forwardRef<PolicyHandle, {
  runtime: React.RefObject<ArmRuntime | null>;
  state: SimulationState;
  controls: RobotControl[];
  robotId: string;
  enabled: boolean;
  onActive: (active: boolean) => void;
  expanded?: boolean;
  source?: string;
  onSourceChange?: (source: string) => void;
}>(function PythonPolicy({ runtime, state, controls, robotId, enabled, onActive, expanded = false, source: controlledSource, onSourceChange }, ref) {
  const [localSource, setLocalSource] = useState(TEMPLATE);
  const source = controlledSource ?? localSource;
  function setSource(value: string) { setLocalSource(value); onSourceChange?.(value); }
  const [status, setStatus] = useState<'idle' | 'loading' | 'running' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const worker = useRef<Worker | null>(null);
  const watchdog = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef(false);
  const lastSent = useRef(0);
  const { user } = useUser();
  const draftKey = `atom-policy:${user?.id || 'local'}:${robotId}`;
  function saveDraft() { try { localStorage.setItem(draftKey, source); setLogs((previous) => [...previous.slice(-30), 'Draft saved in this browser.']); } catch { setLogs((previous) => [...previous, 'Browser storage is unavailable.']); } }
  function loadDraft() { try { const saved = localStorage.getItem(draftKey); if (saved) setSource(saved); else setLogs((previous) => [...previous.slice(-30), 'No draft saved for this robot.']); } catch { setLogs((previous) => [...previous, 'Browser storage is unavailable.']); } }

  function clearWatchdog() { if (watchdog.current) clearTimeout(watchdog.current); watchdog.current = null; }
  function stop() { clearWatchdog(); worker.current?.terminate(); worker.current = null; pending.current = false; setStatus('idle'); onActive(false); runtime.current?.pause(); }
  function fail(message: string) { stop(); setStatus('error'); setLogs((previous) => [...previous.slice(-30), message]); }
  useImperativeHandle(ref, () => ({ stop }));
  useEffect(() => () => { if (watchdog.current) clearTimeout(watchdog.current); worker.current?.terminate(); }, []);

  function run() {
    stop();
    setLogs(['Starting local Python…']);
    setStatus('loading');
    onActive(true);
    const instance = new Worker('/simulation/python-worker.mjs', { type: 'module', name: 'atom-python-policy' });
    worker.current = instance;
    watchdog.current = setTimeout(() => fail('Python did not load in time. Stop and try again.'), 60000);
    instance.onerror = () => fail('The Python worker failed.');
    instance.onmessage = ({ data: message }) => {
      if (worker.current !== instance) return;
      if (message.type === 'log') setLogs((previous) => [...previous.slice(-30), message.message]);
      if (message.type === 'booted') { clearWatchdog(); watchdog.current = setTimeout(() => fail('Policy initialization exceeded 3 seconds. Worker stopped.'), 3000); }
      if (message.type === 'ready') { clearWatchdog(); setStatus('running'); setLogs((previous) => [...previous, 'Policy ready · 10 Hz · standard-library Python']); runtime.current?.play(); }
      if (message.type === 'error') fail(message.message);
      if (message.type === 'action') {
        clearWatchdog();
        pending.current = false;
        if (!Array.isArray(message.values) || message.values.length !== controls.length || !message.values.every((value: unknown) => typeof value === 'number' && Number.isFinite(value))) { fail(`Return a list of ${controls.length} finite actuator targets.`); return; }
        const values = message.values.map((value: number, index: number) => Math.max(controls[index].min, Math.min(controls[index].max, value)));
        runtime.current?.setTargets(values);
      }
    };
    instance.postMessage({ type: 'init', source });
  }

  useEffect(() => {
    if (status !== 'running' || !worker.current || pending.current || !state.running || state.blocked || performance.now() - lastSent.current < 100) return;
    lastSent.current = performance.now();
    pending.current = true;
    worker.current.postMessage({ type: 'observe', observation: { time: state.time, positions: state.positions, targets: state.targets, home: controls.map((control) => control.home), controls } });
    watchdog.current = setTimeout(() => {
      worker.current?.terminate(); worker.current = null; pending.current = false;
      setStatus('error'); onActive(false); runtime.current?.pause();
      setLogs((previous) => [...previous.slice(-30), 'Policy step exceeded 2 seconds. Worker stopped.']);
    }, 2000);
  }, [state, status, controls, runtime, onActive]);

  return <div className={styles.policy} data-expanded={expanded}>
    <div className={styles.panelHeading}><h2>{expanded ? 'policy.py' : 'Python policy'}</h2><span>Local · 10 Hz</span></div>
    <p className={styles.help}>{expanded ? <>Define <code>policy(obs)</code> and return actuator targets.</> : <>Define <code>policy(obs)</code>. Return actuator targets in the units shown under Controls. Native actuator limits and MuJoCo contact constraints apply.</>}</p>
    <div className={styles.actions}><button onClick={run} disabled={!enabled || status === 'loading' || status === 'running'}>Run policy</button><button onClick={stop} disabled={status === 'idle'}>Stop</button>{expanded && <><button onClick={saveDraft}>Save draft</button><button onClick={loadDraft}>Load draft</button></>}</div>
    <CodeMirror className={styles.editor} value={source} onChange={setSource} extensions={expanded ? STUDIO_EXTENSIONS : EDITOR_EXTENSIONS} theme="dark" height={expanded ? '100%' : '300px'} basicSetup={EDITOR_SETUP} aria-label="Python policy source" />
    {!expanded && <div className={styles.actions}><button onClick={saveDraft}>Save draft</button><button onClick={loadDraft}>Load draft</button></div>}
    <pre className={styles.console} aria-label="Policy console">{logs.length ? logs.join('\n') : 'Output and Python tracebacks appear here.'}</pre>
    <p className={styles.help}>{expanded ? 'Browser Python · Standard library · Drafts saved on this device' : 'Runs your code in a separate browser worker. Stop terminates it. Standard library only; this is not RL training or a Python backend.'}</p>
  </div>;
});
