import styles from './platform.module.css';

export default function PlatformLoading() {
  return <p className={styles.simulationLoading} role="status">Loading workspace…</p>;
}
