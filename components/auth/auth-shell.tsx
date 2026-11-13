import Image from "next/image";
import Link from "next/link";
import { GeistPixelCircle } from "geist/font/pixel";
import styles from "./auth-shell.module.css";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.artwork} aria-label="atom ctrl">
          <Image src="/assets/auth/grain-study.png" alt="" fill preload sizes="(max-width: 760px) 100vw, 37.5vw" className={styles.image} />
          <div className={styles.brandStory}>
            <Link href="/" className={`${styles.brand} ${GeistPixelCircle.className}`} aria-label="atom ctrl home">atom ctrl</Link>
            <p className={styles.statement}>Give your ideas a<br />world to move in.</p>
          </div>
        </aside>
        <section className={styles.panel} aria-label="Your atom ctrl account">
          <Link href="/" className={styles.home}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20 12H4m0 0 7-7m-7 7 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Home
          </Link>
          <div className={styles.form}>{children}</div>
        </section>
      </div>
    </main>
  );
}
