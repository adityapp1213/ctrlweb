"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GeistPixelCircle } from "geist/font/pixel";
import { ArrowLeft, Bookmark, Bot, Box, Boxes, ChevronRight, CircuitBoard, Home, Layers3, Search, Target, X } from "lucide-react";
import styles from "./playground-sidebar.module.css";

const groups = [
  { label: "Explore", items: [
    { label: "Environments", icon: Box, children: ["Tabletop", "Indoor", "Locomotion"] },
    { label: "Robots & arms", icon: Bot, children: ["Robot arms", "Mobile robots", "Humanoids"] },
    { label: "Tasks", icon: Target, children: ["Pick & place", "Navigation", "Manipulation"] },
  ] },
  { label: "Your library", items: [
    { label: "My models", icon: CircuitBoard, empty: "Models you add will appear here." },
    { label: "Custom modules", icon: Boxes, empty: "Your custom modules will appear here." },
    { label: "Saved environments", icon: Bookmark, empty: "Environments you save will appear here." },
  ] },
];

export function PlaygroundSidebar({ mobileOpen, onMobileOpen, onClose }: { mobileOpen: boolean; onMobileOpen: () => void; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("Home");
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onMobileOpen();
        requestAnimationFrame(() => search.current?.focus());
      }
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onMobileOpen, onClose]);

  const term = query.trim().toLowerCase();
  const filtered = groups.map((group) => ({ ...group, items: group.items.filter((item) =>
    item.label.toLowerCase().includes(term) || ("children" in item && item.children?.some((child) => child.toLowerCase().includes(term)))
  ) })).filter((group) => group.items.length);

  function select(label: string) { setActive(label); onClose(); }

  return (
    <>
      {mobileOpen && <button className={styles.backdrop} onClick={onClose} aria-label="Close navigation" />}
      <aside id="playground-navigation" className={styles.sidebar} data-mobile-open={mobileOpen} aria-label="Playground navigation">
        <div className={styles.brandRow}>
          <Link href="/platform" className={`${styles.brand} ${GeistPixelCircle.className}`} aria-label="atom ctrl platform">atom ctrl</Link>
          <button className={styles.close} onClick={onClose} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <label className={styles.search}>
          <Search size={17} aria-hidden="true" />
          <input ref={search} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" aria-label="Search playground categories" />
          <kbd title="Control or Command + K">⌘ K</kbd>
        </label>
        <nav className={styles.navigation} aria-label="Browse playground">
          {!term && <button className={styles.row} data-active={active === "Home"} aria-current={active === "Home" ? "page" : undefined} onClick={() => select("Home")}><Home size={18} /><span>Home</span></button>}
          {filtered.map((group) => (
            <div className={styles.group} key={group.label}>
              <h2>{group.label}</h2>
              {group.items.map((item) => (
                <details className={styles.category} key={item.label} open={term ? true : undefined}>
                  <summary className={styles.row}><item.icon size={18} aria-hidden="true" /><span>{item.label}</span><ChevronRight size={15} className={styles.chevron} aria-hidden="true" /></summary>
                  <div className={styles.children}>
                    {"children" in item ? item.children?.filter((child) => !term || item.label.toLowerCase().includes(term) || child.toLowerCase().includes(term)).map((child) => <button key={child} className={styles.child} data-active={active === child} aria-current={active === child ? "page" : undefined} onClick={() => select(child)}>{child}</button>) : <p className={styles.empty}>{item.empty}</p>}
                  </div>
                </details>
              ))}
            </div>
          ))}
          {term && filtered.length === 0 && <p className={styles.noResults}>No categories found.</p>}
        </nav>
        <div className={styles.bottom}>
          <span><Layers3 size={15} aria-hidden="true" />Playground</span>
          <Link href="/" aria-label="Back to atom ctrl site"><ArrowLeft size={15} aria-hidden="true" />Back to site</Link>
        </div>
        <span className={styles.visuallyHidden} aria-live="polite">Selected category: {active}</span>
      </aside>
    </>
  );
}
