import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { syncPlatformUser } from "@/lib/sync-platform-user";
import { PlatformMode } from '@/components/platform-mode';
import styles from './platform.module.css';

export const metadata: Metadata = {
  title: "Platform",
  alternates: { canonical: null },
  robots: { index: false, follow: false },
};

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  // Resource-level protection also applies to future nested platform pages.
  const { userId } = await auth.protect();
  await syncPlatformUser(userId);
  return <main className={styles.page}><PlatformMode>{children}</PlatformMode></main>;
}
