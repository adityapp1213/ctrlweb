'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpRight, Bot, Search, X } from 'lucide-react';
import { ROBOT_GALLERY } from '@/lib/simulation/gallery';
import type { SimulationSetup } from '@/lib/simulation/panda';
import { EMPTY_RESEARCH_SETUP, researchPath } from '@/lib/simulation/research';
import { findScenario } from '@/lib/simulation/routes';
import SimulationSession from './simulation-session';
import styles from './research-workspace.module.css';

export default function ResearchWorkspace({ setup }: { setup: SimulationSetup }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [policySource, setPolicySource] = useState<string>();
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const presetFilter = params.get('presets');
  const showPicker = pickerOpen || ['all', 'single', 'dual'].includes(presetFilter || '');
  useEffect(() => {
    if (showPicker) { dialog.current?.showModal(); search.current?.focus(); }
    else dialog.current?.close();
  }, [showPicker]);
  function closePicker() {
    setPickerOpen(false);
    if (params.has('presets')) {
      const next = new URLSearchParams(params);
      next.delete('presets');
      window.history.replaceState(null, '', `/platform/research${next.size ? `?${next}` : ''}`);
    }
  }
  function choose(robotId: string) {
    closePicker(); setQuery('');
    router.push(researchPath({ robotId, environment: findScenario(params.get('environment') || '')?.id || setup.environment, props: setup.props }), { scroll: false });
  }
  const robots = ROBOT_GALLERY.filter((robot) => (presetFilter !== 'single' || !robot.paired) && (presetFilter !== 'dual' || robot.paired) && `${robot.label} ${robot.id}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <SimulationSession setup={setup} research onChooseRobot={() => setPickerOpen(true)} onClear={() => router.push(researchPath(EMPTY_RESEARCH_SETUP), { scroll: false })} policySource={policySource} onPolicySourceChange={setPolicySource} />
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="robot-picker-heading" onCancel={(event) => { event.preventDefault(); closePicker(); }} onClick={(event) => { if (event.target === event.currentTarget) closePicker(); }}>
      <div className={styles.dialogHeader}><div><span>MUJOCO MENAGERIE</span><h2 id="robot-picker-heading">Choose a robot preset</h2><p>Original models, actuators, and collision geometry.</p></div><button onClick={closePicker} aria-label="Close robot presets"><X size={19}/></button></div>
      <label className={styles.search}><Search size={17}/><input ref={search} type="search" placeholder="Search 26 robot models…" aria-label="Search robot presets" value={query} onChange={(event) => setQuery(event.target.value)}/><span>{robots.length} models</span></label>
      <div className={styles.presetGrid}>{robots.map((robot) => <button key={robot.id} className={styles.preset} onClick={() => choose(robot.id)} aria-label={`Use ${robot.label} preset`}><div className={styles.presetImage}><Image src={robot.preview.src} alt={robot.label} fill sizes="(max-width: 600px) 45vw, 240px"/></div><span><Bot size={14}/>{robot.label}<ArrowUpRight size={14}/></span></button>)}</div>
      {!robots.length && <p className={styles.emptyResults}>No models match “{query}”.</p>}
      <div className={styles.dialogFooter}>One active robot preset per workspace. Replace or remove it at any time.</div>
    </dialog>
  </>;
}
