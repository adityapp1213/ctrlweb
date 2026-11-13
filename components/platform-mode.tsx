"use client";

import { useCallback, useId, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { PlaygroundSidebar } from "@/components/playground-sidebar";
import styles from "@/app/platform/platform.module.css";

export function PlatformMode() {
  const [mode, setMode] = useState<"playground" | "research">("playground");
  const groupId = useId();
  const [mobileOpen, setMobileOpen] = useState(false);
  const openSidebar = useCallback(() => {
    if (window.matchMedia("(max-width: 760px)").matches) setMobileOpen(true);
  }, []);
  const closeSidebar = useCallback(() => setMobileOpen(false), []);

  return (
    <div className={styles.layout} data-mode={mode}>
      {mode === "playground" && <PlaygroundSidebar mobileOpen={mobileOpen} onMobileOpen={openSidebar} onClose={closeSidebar} />}
      <div className={styles.stage}>
      <header className={styles.header}>
        {mode === "playground" && <button className={styles.menuButton} onClick={openSidebar} aria-label="Open playground navigation" aria-expanded={mobileOpen} aria-controls="playground-navigation"><Menu size={20} /></button>}
        <fieldset className={styles.modeToggle}>
          <legend className={styles.visuallyHidden}>Platform mode</legend>
          <span className={styles.selection} data-mode={mode} aria-hidden="true" />
          {(["playground", "research"] as const).map((value) => (
            <label key={value} className={styles.option}>
              <input
                className={styles.visuallyHidden}
                type="radio"
                name={groupId}
                value={value}
                checked={mode === value}
                onChange={() => { setMode(value); setMobileOpen(false); }}
                aria-controls={`${groupId}-workspace`}
                title={value === "playground" ? "Explore predefined environments" : "Build custom simulations"}
              />
              <span>{value === "playground" ? "Playground" : "Research"}</span>
            </label>
          ))}
        </fieldset>
        <div className={styles.account}><UserButton /></div>
      </header>
      <section id={`${groupId}-workspace`} className={styles.workspace} data-mode={mode} aria-label={`${mode === "playground" ? "Playground" : "Research"} workspace`} />
      </div>
    </div>
  );
}
