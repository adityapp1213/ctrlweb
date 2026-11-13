import Link from 'next/link';
import { PLAYGROUND_PATH } from '@/lib/simulation/routes';
import styles from './platform.module.css';

export default function PlatformNotFound() {
  return <div className={styles.library}><h1>Workspace not found</h1><p>This robot, environment, or library page is unavailable.</p><Link href={PLAYGROUND_PATH}>Back to playground →</Link></div>;
}
