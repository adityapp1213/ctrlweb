import { PlatformMode } from "@/components/platform-mode";
import { auth } from "@clerk/nextjs/server";
import styles from "./platform.module.css";

export default async function PlatformPage() {
  await auth.protect();

  return (
    <main className={styles.page}>
      <PlatformMode />
    </main>
  );
}
