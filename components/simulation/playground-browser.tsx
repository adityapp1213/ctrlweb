"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, Bot, ChevronRight, Search, X } from 'lucide-react';
import { ROBOT_GALLERY, SCENARIO_GALLERY } from '@/lib/simulation/gallery';
import { EXPLORE_PATH, PLAYGROUND_PATH, robotPath, simulationPath } from '@/lib/simulation/routes';
import styles from './playground-browser.module.css';

export default function PlaygroundBrowser({ robotId }: { robotId?: string }) {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('arms') || 'all';
  const query = searchParams.get('q') || '';
  const environment = SCENARIO_GALLERY.find((scenario) => scenario.slug === searchParams.get('environment'))?.slug;
  const selected = ROBOT_GALLERY.find((robot) => robot.id === robotId);
  const scenarios = SCENARIO_GALLERY.filter((scenario) => !environment || scenario.slug === environment);
  const collectionQuery = new URLSearchParams();
  if (initialFilter === 'single' || initialFilter === 'dual') collectionQuery.set('arms', initialFilter);
  if (query) collectionQuery.set('q', query);
  if (SCENARIO_GALLERY.some((scenario) => scenario.slug === environment)) collectionQuery.set('environment', environment!);
  const suffix = collectionQuery.size ? `?${collectionQuery}` : '';
  const collectionHref = `${EXPLORE_PATH}${suffix}`;
  const robots = ROBOT_GALLERY.filter((robot) =>
    (!['single', 'dual'].includes(initialFilter) || (initialFilter === 'dual' ? robot.paired : !robot.paired)) &&
    `${robot.label} ${robot.id}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  function setQuery(value: string) {
    const params = new URLSearchParams(collectionQuery);
    if (value) params.set('q', value); else params.delete('q');
    // Next.js integrates native history with useSearchParams; filtering stays
    // immediate and does not add a browser-history entry per keystroke.
    window.history.replaceState(null, '', `${EXPLORE_PATH}${params.size ? `?${params}` : ''}`);
  }

  return <div className={styles.browser}>
    <div className={styles.bar}>
      <div className={styles.location}>
        <Link href={selected ? collectionHref : PLAYGROUND_PATH} className={styles.back} aria-label={selected ? 'Back to Explore' : 'Back to Home'} title={selected ? 'Back to Explore' : 'Back to Home'}><ArrowLeft size={17} aria-hidden="true" /></Link>
        <nav className={styles.breadcrumbs} aria-label="Playground location">
          <Link href={PLAYGROUND_PATH}>Home</Link><span>/</span>
          {selected ? <><Link href={collectionHref}>Explore</Link><span>/</span><strong>{selected.label}</strong></> : <strong>{initialFilter === 'dual' ? 'Dual arms' : initialFilter === 'single' ? 'Single arms' : 'Explore'}</strong>}
        </nav>
      </div>
      {!selected ? <label className={styles.search}><Search size={15} aria-hidden="true"/><input type="search" placeholder="Search robots" aria-label="Search robots" value={query} onChange={(event) => setQuery(event.target.value)}/>{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={13}/></button>}</label> : <a className={styles.source} href={selected.preview.source} target="_blank" rel="noreferrer">Model preview source <ArrowUpRight size={13}/></a>}
    </div>
    {selected ? <>
      <div className={styles.sectionLine}><span>Choose an environment</span><span>{scenarios.length} {scenarios.length === 1 ? 'scenario' : 'scenarios'}</span></div>
      <div className={styles.grid} aria-label={`${selected.label} scenarios`}>
        {scenarios.map((scenario) => <Link key={scenario.id} href={simulationPath({ robotId: selected.id, environment: scenario.id, props: [] })} className={`${styles.card} ${styles.scenario}`} aria-label={`Open ${selected.label} in ${scenario.label}`}>
          <div className={styles.preview}>
            <Image src={selected.preview.src} alt={`Published MuJoCo Menagerie preview of ${selected.label}`} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 30vw" className={styles.image}/>
            <span className={styles.scenarioBadge}>{scenario.label}</span>
          </div>
          <div className={styles.scenarioDetails}><div><h2>{scenario.label}</h2><p>{scenario.description}</p><div className={styles.tags}>{scenario.objects.map((object) => <span key={object}>{object}</span>)}</div></div><ArrowRight size={17} aria-hidden="true"/></div>
        </Link>)}
      </div>
      <p className={styles.attribution}>Published robot previews from MuJoCo Menagerie. Scenario names and object tags describe the environment that opens.</p>
    </> : <>
      <div className={styles.sectionLine}><span>Robot collection</span><span>{robots.length} {robots.length === 1 ? 'model' : 'models'}</span></div>
      <div className={styles.grid} aria-label="Robot collection">
        {robots.map((robot, index) => <Link key={robot.id} href={`${robotPath(robot.id)}${suffix}`} className={styles.card} aria-label={`Explore ${robot.label} scenarios`}>
          <div className={styles.preview}>
            <Image src={robot.preview.src} alt={`Official MuJoCo simulation of ${robot.label}`} fill preload={index < 3} sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 30vw" className={styles.image}/>
          </div>
          <div className={styles.reveal}><span className={styles.robotName}><Bot size={16} aria-hidden="true"/>{robot.label}</span><ChevronRight size={15} aria-hidden="true"/></div>
        </Link>)}
      </div>
      {robots.length === 0 && <div className={styles.empty}><p>No robots match “{query}”.</p><button onClick={() => setQuery('')}>Clear search</button></div>}
      <p className={styles.attribution}>Original simulation previews from <a href="https://github.com/google-deepmind/mujoco_menagerie" target="_blank" rel="noreferrer">MuJoCo Menagerie <ArrowUpRight size={11}/></a>. Individual image sources and licenses are preserved with the collection.</p>
    </>}
  </div>;
}
