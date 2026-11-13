"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Crosshair, LoaderCircle, Pause, Play, RotateCcw } from "lucide-react";
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { PLAYGROUND_PATH, robotPath } from '@/lib/simulation/routes';
import { SCENE_ASSETS, normalizeSceneProps } from '@/public/simulation/asset-options.mjs';
import { ENVIRONMENTS } from '@/public/simulation/scene.mjs';
import { ROBOT_CATALOG, type RobotControl, type SimulationSetup } from "@/lib/simulation/panda";
import { PythonPolicy, type PolicyHandle } from './python-policy';
import type { ArmRuntime, SimulationState } from "@/lib/simulation/arm-runtime";
import styles from "./arm-playground.module.css";
import tools from './workspace-tools.module.css';

export default function ArmPlayground({ initialSetup, onConfigure }: { initialSetup?: SimulationSetup; onConfigure?: (setup: SimulationSetup) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const runtime = useRef<ArmRuntime | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [state, setState] = useState<SimulationState>({ time: 0, positions: [], running: false });
  const [joints, setJoints] = useState<RobotControl[]>([]);
  const [targets, setTargets] = useState<number[]>([]);
  const [setup, setSetup] = useState<SimulationSetup>(initialSetup || { robotId: 'franka_emika_panda', environment: 'ground', props: [] });
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  const tab = view === 'scene' || view === 'policy' ? view : 'controls';
  const [policyOpened, setPolicyOpened] = useState(false);
  const [policyActive, setPolicyActive] = useState(false);
  const [progress, setProgress] = useState('');
  const [sceneMessage, setSceneMessage] = useState('');
  const { user } = useUser();
  const policy = useRef<PolicyHandle>(null);
  const robot = ROBOT_CATALOG.find((item) => item.id === setup.robotId) || ROBOT_CATALOG[0];
  const presetProps = ENVIRONMENTS.find((environment) => environment.id === setup.environment)?.props || [];
  const id = useId();

  useEffect(() => {
    let cancelled = false;
    let instance: ArmRuntime | undefined;
    import("@/lib/simulation/arm-runtime").then(({ createArmRuntime }) => {
      if (cancelled || !host.current) return;
      instance = createArmRuntime(host.current, {
        onReady: (controls) => { if (!cancelled) { setJoints(controls); setTargets(controls.map((control) => control.home)); setStatus("ready"); } },
        onState: (value) => { if (!cancelled) {
          setState(value);
          if (value.targets) setTargets(value.targets);
          if (value.blocked) policy.current?.stop();
        } },
        onProgress: (loaded, total) => { if (!cancelled) setProgress(`Loading assets ${loaded} / ${total}`); },
        onError: (message) => { if (!cancelled) { setError(message); setStatus("error"); } },
      }, setup);
      runtime.current = instance;
    }).catch(() => { if (!cancelled) { setError("The 3D view could not load. Your browser needs WebGL support."); setStatus("error"); } });
    return () => { cancelled = true; instance?.dispose(); runtime.current = null; };
  }, [retry, setup]);

  function reset() { policy.current?.stop(); runtime.current?.reset(); setTargets(joints.map((joint) => joint.home)); }
  function selectView(view: 'controls' | 'scene' | 'policy') {
    const params = new URLSearchParams(searchParams);
    if (view === 'controls') params.delete('view'); else params.set('view', view);
    window.history.replaceState(null, '', `${pathname}${params.size ? `?${params}` : ''}`);
    if (view === 'policy') setPolicyOpened(true);
  }
  function prepareReload() { policy.current?.stop(); setStatus('loading'); setError(''); setProgress(''); setState({ time: 0, positions: [], running: false }); setJoints([]); setTargets([]); }
  function reload() { prepareReload(); setRetry((value) => value + 1); }
  function configure(next: SimulationSetup) {
    policy.current?.stop();
    runtime.current?.pause();
    if (onConfigure) { onConfigure(next); return; }
    prepareReload(); setSetup(next);
  }
  function saveScene() {
    try { localStorage.setItem(`atom-scene:${user?.id || 'local'}`, JSON.stringify(setup)); setSceneMessage('Scene saved in this browser.'); }
    catch { setSceneMessage('Browser storage is unavailable.'); }
  }
  function loadScene() {
    try {
      const saved = JSON.parse(localStorage.getItem(`atom-scene:${user?.id || 'local'}`) || 'null');
      if (!saved || !ROBOT_CATALOG.some((model) => model.id === saved.robotId) || !['ground','workbench','sorting'].includes(saved.environment) || !Array.isArray(saved.props) || !saved.props.every((prop: unknown) => typeof prop === 'string')) { setSceneMessage('No compatible saved scene found.'); return; }
      configure({ ...saved, props: normalizeSceneProps(saved.props) }); setSceneMessage('Saved scene loaded.');
    } catch { setSceneMessage('The saved scene could not be read.'); }
  }

  return (
    <div className={styles.playground}>
      <div className={styles.heading}>
        <div><p className={styles.eyebrow}>PLAYGROUND / MUJOCO MENAGERIE</p><h1>{robot.label}</h1><p className={styles.subtitle}>Official models · Physical contacts · Local Python policies</p></div>
        <div className={styles.transportButtons}>
          <button className={styles.primaryButton} disabled={status !== "ready"} onClick={() => { if (state.running) { policy.current?.stop(); runtime.current?.pause(); } else runtime.current?.play(); }}>{state.running ? <Pause size={16} /> : <Play size={16} />} {state.running ? "Pause" : "Play"}</button>
          <button className={styles.secondaryButton} disabled={status !== "ready"} onClick={reset}><RotateCcw size={15} />Reset</button>
        </div>
      </div>
      <nav className={styles.sessionBar} aria-label="Simulation location">
        <Link href={PLAYGROUND_PATH}>Playground</Link><span>/</span>
        <Link href={robotPath(setup.robotId)}>{robot.label}</Link><span>/</span>
        <span>{setup.environment === 'ground' ? 'Open floor' : setup.environment === 'workbench' ? 'Workbench' : 'Object sorting'}</span>
      </nav>
      {state.blocked && <p className={tools.notice} role="status">{state.blocked}</p>}
      <div className={styles.simulation}>
        <div className={styles.scene}>
          <div className={styles.sceneToolbar}>
            <span className={styles.sceneLabel}>{robot.label} <span>{joints.length ? `${joints.length} ACTUATORS` : 'OFFICIAL MJCF'}</span></span>
            <button className={styles.iconButton} onClick={() => runtime.current?.home()} disabled={status !== "ready"} aria-label="Reset camera" title="Reset camera"><Crosshair size={17} /></button>
          </div>
          <div ref={host} className={styles.viewport} />
          {status !== "ready" && <div className={styles.overlay} role={status === "error" ? "alert" : "status"}>
            {status === "loading" ? <><LoaderCircle className={styles.spinner} size={24} /><p>{progress || `Loading ${robot.label}…`}</p></> : <><p>{error}</p><button className={styles.secondaryButton} onClick={reload}>Reload scene</button></>}
          </div>}
          <div className={styles.sceneFooter}><span>Drag to orbit · Scroll to zoom</span><span aria-label="Simulation time">{state.time.toFixed(2)} s</span></div>
        </div>
        <aside className={styles.inspector} aria-label="Robot controls">
          <div className={styles.tabs} role="group" aria-label="Inspector view">
            {(['controls', 'scene', 'policy'] as const).map((view) => <button key={view} aria-pressed={tab === view} onClick={() => selectView(view)}>{view === 'controls' ? 'Controls' : view === 'scene' ? 'Scene' : 'Python'}</button>)}
          </div>
          <div className={styles.controlPanel} hidden={tab !== 'controls'}>
          <div className={styles.inspectorHeading}><h2>Actuators</h2><p>Original Menagerie actuators and torque limits. Targets move through MuJoCo dynamics.</p></div>
          <div className={styles.joints}>
            {joints.map((joint, index) => <div className={styles.joint} key={joint.id}>
              <div className={styles.jointLabel}><label htmlFor={`${id}-actuator-${joint.id}`}>{joint.label}</label><output htmlFor={`${id}-actuator-${joint.id}`}>{targets[index]?.toFixed(1)}{joint.unit}</output></div>
              <ActuatorInput id={`${id}-actuator-${joint.id}`} joint={joint} value={targets[index] ?? joint.home} disabled={status !== "ready" || policyActive} onCommit={(value) => {
                setTargets((previous) => previous.map((target, at) => at === index ? value : target));
                runtime.current?.setJoint(index, value);
              }} />
              <div className={styles.jointRange}><span>{joint.min.toFixed(1)}{joint.unit}</span><span>Actual {state.positions[index]?.toFixed(1)}{joint.unit}</span><span>{joint.max.toFixed(1)}{joint.unit}</span></div>
            </div>)}
          </div>
          <div className={styles.controlsFooter}><span className={styles.status} data-running={status === "ready" && state.running} role="status">{status === "error" ? "Unavailable" : status === "loading" ? "Loading" : state.running ? "Simulation running" : "Simulation paused"}</span><p>{state.contacts || 0} contacts · Native MuJoCo constraints</p></div>
          </div>
          <div className={styles.toolPanel} hidden={tab !== 'scene'}>
            <div className={tools.panelHeading}><h2>Scene composition</h2></div>
            <p className={tools.help}>Community assets with robot-specific mounting and workspace dimensions. Applying a scene restores its starting pose.</p>
            {SCENE_ASSETS.map(({ id: prop, label, source }) => <label className={tools.prop} key={prop}><input type="checkbox" checked={presetProps.includes(prop) || setup.props.includes(prop)} disabled={presetProps.includes(prop)} title={`${source}${presetProps.includes(prop) ? ' · Included in this preset' : ''}`} onChange={(event) => configure({ ...setup, props: event.target.checked ? [...setup.props, prop] : setup.props.filter((item) => item !== prop) })}/>{label}</label>)}
            <p className={tools.help}>Props supplied by an environment preset remain in that preset. Switch to Open floor to build your own combination.</p>
            <div className={tools.actions}><button onClick={saveScene}>Save scene</button><button onClick={loadScene}>Load scene</button></div>
            {sceneMessage && <p className={tools.help} role="status">{sceneMessage}</p>}
            <p className={tools.help}>MuJoCo solves floor, fixture, object, and self contacts continuously. Mechanically connected parts retain their contact exclusions.</p>
            <a className={styles.modelLink} href="/environments/ATTRIBUTION.md" target="_blank" rel="noreferrer">Environment sources & licenses ↗</a>
            <a href={robot.license} target="_blank" rel="noreferrer" className={styles.modelLink}>Model source & license ↗</a>
          </div>
          {(policyOpened || tab === 'policy') && <div className={styles.toolPanel} hidden={tab !== 'policy'}><PythonPolicy key={setup.robotId + setup.environment + setup.props.join(',')} ref={policy} runtime={runtime} state={state} controls={joints} robotId={setup.robotId} enabled={status === 'ready'} onActive={setPolicyActive}/></div>}
        </aside>
      </div>
      <div className={styles.transport}>
        <a href={robot.license.replace('/blob/', '/tree/').replace('/LICENSE', '')} target="_blank" rel="noreferrer">Model: Google DeepMind / MuJoCo Menagerie ↗</a>
        <span>Reset restores the official home keyframe.</span>
      </div>
    </div>
  );
}

function ActuatorInput({ id, joint, value, disabled, onCommit }: { id: string; joint: RobotControl; value: number; disabled: boolean; onCommit: (value: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  return <input id={id} type="number" min={joint.min} max={joint.max} step={joint.step} value={draft ?? Number(value.toFixed(2))} disabled={disabled}
    title={`${joint.unit} target · Enter or leave the field to apply`}
    onFocus={(event) => setDraft(event.currentTarget.value)} onChange={(event) => setDraft(event.currentTarget.value)}
    onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); }}
    onBlur={(event) => {
      const raw = event.currentTarget.value;
      const next = Number(raw);
      if (!disabled && raw.trim() && Number.isFinite(next)) onCommit(Math.max(joint.min, Math.min(joint.max, next)));
      setDraft(null);
    }} />;
}
