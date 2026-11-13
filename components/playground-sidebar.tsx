"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from 'next/navigation';
import { PLAYGROUND_PATH } from '@/lib/simulation/routes';
import { GeistPixelCircle } from "geist/font/pixel";
import { ArrowLeft, Bookmark, Bot, Box, Boxes, ChevronRight, CircuitBoard, Home, Layers3, Search, Target, X } from "lucide-react";
import styles from "./playground-sidebar.module.css";

const groups = [
  { label: "Explore", items: [
    { label: "Environments", icon: Box, children: [
      { label: 'Open floor', href: `${PLAYGROUND_PATH}?environment=open-floor` },
      { label: 'Workbench', href: `${PLAYGROUND_PATH}?environment=workbench` },
      { label: 'Object sorting', href: `${PLAYGROUND_PATH}?environment=object-sorting` },
    ] },
    { label: "Robots & arms", icon: Bot, children: [
      { label: 'All arms', href: PLAYGROUND_PATH },
      { label: 'Single arms', href: `${PLAYGROUND_PATH}?arms=single` },
      { label: 'Dual arms', href: `${PLAYGROUND_PATH}?arms=dual` },
    ] },
    { label: "Tasks", icon: Target, href: '/platform/library/tasks' },
  ] },
  { label: "Your library", items: [
    { label: "My models", icon: CircuitBoard, href: '/platform/library/models' },
    { label: "Custom modules", icon: Boxes, href: '/platform/library/modules' },
    { label: "Saved environments", icon: Bookmark, href: '/platform/library/environments' },
  ] },
];

export function PlaygroundSidebar({ mobileOpen, onMobileOpen, onClose }: { mobileOpen: boolean; onMobileOpen: () => void; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const params = useSearchParams();
  function isActive(href: string) {
    const [path, query] = href.split('?');
    if (path !== pathname && !(path === PLAYGROUND_PATH && pathname.startsWith(`${PLAYGROUND_PATH}/`))) return false;
    const expected = new URLSearchParams(query);
    return expected.size ? [...expected].every(([key, value]) => params.get(key) === value) : !params.has('arms') && !params.has('environment');
  }
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
    item.label.toLowerCase().includes(term) || ("children" in item && item.children?.some((child) => child.label.toLowerCase().includes(term)))
  ) })).filter((group) => group.items.length);

  return (
    <>
      {mobileOpen && <button className={styles.backdrop} onClick={onClose} aria-label="Close navigation" />}
      <aside id="playground-navigation" className={styles.sidebar} data-mobile-open={mobileOpen} aria-label="Playground navigation">
        <div className={styles.brandRow}>
          <Link href={PLAYGROUND_PATH} onClick={onClose} className={`${styles.brand} ${GeistPixelCircle.className}`} aria-label="atom ctrl platform">atom ctrl</Link>
          <button className={styles.close} onClick={onClose} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <label className={styles.search}>
          <Search size={17} aria-hidden="true" />
          <input ref={search} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" aria-label="Search playground categories" />
          <kbd title="Control or Command + K">⌘ K</kbd>
        </label>
        <nav className={styles.navigation} aria-label="Browse playground">
          {!term && <Link href={PLAYGROUND_PATH} onClick={onClose} className={styles.row} data-active={pathname === PLAYGROUND_PATH && !params.size} aria-current={pathname === PLAYGROUND_PATH && !params.size ? 'page' : undefined}><Home size={18} /><span>Home</span></Link>}
          {filtered.map((group) => (
            <div className={styles.group} key={group.label}>
              <h2>{group.label}</h2>
              {group.items.map((item) => 'children' in item ? (
                <details className={styles.category} key={item.label} open={term || item.children?.some((child) => child.href.includes('?') && isActive(child.href)) ? true : undefined}>
                  <summary className={styles.row}><item.icon size={18} aria-hidden="true" /><span>{item.label}</span><ChevronRight size={15} className={styles.chevron} aria-hidden="true" /></summary>
                  <div className={styles.children}>
                    {item.children?.filter((child) => !term || item.label.toLowerCase().includes(term) || child.label.toLowerCase().includes(term)).map((child) => <Link key={child.href} href={child.href} onClick={onClose} className={styles.child} data-active={isActive(child.href)} aria-current={isActive(child.href) ? 'page' : undefined}>{child.label}</Link>)}
                  </div>
                </details>
              ) : <Link key={item.label} href={item.href!} onClick={onClose} className={styles.row} data-active={isActive(item.href!)} aria-current={isActive(item.href!) ? 'page' : undefined}><item.icon size={18} aria-hidden="true"/><span>{item.label}</span><ChevronRight size={15} className={styles.chevron}/></Link>)}
            </div>
          ))}
          {term && filtered.length === 0 && <p className={styles.noResults}>No categories found.</p>}
        </nav>
        <div className={styles.bottom}>
          <span><Layers3 size={15} aria-hidden="true" />Playground</span>
          <Link href="/" aria-label="Back to atom ctrl site"><ArrowLeft size={15} aria-hidden="true" />Back to site</Link>
        </div>
      </aside>
    </>
  );
}
