'use client';

import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SimulationSetup } from '@/lib/simulation/panda';
import { simulationPath } from '@/lib/simulation/routes';
import { researchPath } from '@/lib/simulation/research';
import styles from './playground-browser.module.css';

const Simulation = dynamic(() => import('./arm-playground'), {
  ssr: false,
  loading: () => <p className={styles.loading} role="status">Opening simulation…</p>,
});

export default function SimulationSession({ setup, research = false, onChooseRobot, onClear, policySource, onPolicySourceChange }: { setup: SimulationSetup; research?: boolean; onChooseRobot?: () => void; onClear?: () => void; policySource?: string; onPolicySourceChange?: (source: string) => void }) {
  const router = useRouter();
  const params = useSearchParams();
  function configure(next: SimulationSetup) {
    let href = research ? researchPath(next) : simulationPath(next);
    const view = params.get('view');
    if (view === 'scene' || view === 'policy') href += `${href.includes('?') ? '&' : '?'}view=${view}`;
    router.push(href, { scroll: false });
  }
  return <Simulation key={research ? researchPath(setup) : simulationPath(setup)} initialSetup={setup} onConfigure={configure} research={research} onChooseRobot={onChooseRobot} onClear={onClear} policySource={policySource} onPolicySourceChange={onPolicySourceChange} />;
}
