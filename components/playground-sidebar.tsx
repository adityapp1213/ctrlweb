"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from 'next/navigation';
import { EXPLORE_PATH, PLAYGROUND_PATH } from '@/lib/simulation/routes';
import { GeistPixelCircle } from "geist/font/pixel";
import { ArrowLeft, Bookmark, Bot, Box, Boxes, ChevronRight, ChevronsLeft, CircuitBoard, Code2, Compass, Home, Layers3, Search, Settings2, SlidersHorizontal, Target, X } from "lucide-react";
import styles from "./playground-sidebar.module.css";

const playgroundGroups = [
  { label: "Explore", items: [
    { label: "Environments", icon: Box, children: [
      { label: 'Open floor', href: `${EXPLORE_PATH}?environment=open-floor` },
      { label: 'Workbench', href: `${EXPLORE_PATH}?environment=workbench` },
      { label: 'Object sorting', href: `${EXPLORE_PATH}?environment=object-sorting` },
    ] },
    { label: "Robots & arms", icon: Bot, children: [
      { label: 'All arms', href: EXPLORE_PATH },
      { label: 'Single arms', href: `${EXPLORE_PATH}?arms=single` },
      { label: 'Dual arms', href: `${EXPLORE_PATH}?arms=dual` },
    ] },
    { label: "Tasks", icon: Target, href: '/platform/library/tasks' },
  ] },
  { label: "Your library", items: [
    { label: "My models", icon: CircuitBoard, href: '/platform/library/models' },
    { label: "Custom modules", icon: Boxes, href: '/platform/library/modules' },
    { label: "Saved environments", icon: Bookmark, href: '/platform/library/environments' },
  ] },
];

export function PlaygroundSidebar({ mode = 'playground', collapsed = false, onToggleCollapse, mobileOpen, onMobileOpen, onClose }: { mode?: 'playground' | 'research'; collapsed?: boolean; onToggleCollapse?: () => void; mobileOpen: boolean; onMobileOpen: () => void; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [openedCategory, setOpenedCategory] = useState<string | null>(null);
  const categoryRefs = useRef(new Map<string, HTMLDetailsElement>());
  const pathname = usePathname();
  const params = useSearchParams();
  const research = mode === 'research';
  const modeLabel = research ? 'Research' : 'Playground';
  const homeHref = research ? '/platform/research' : PLAYGROUND_PATH;
  function workspaceHref(changes: Record<string, string | null>) {
    const next = new URLSearchParams(pathname === '/platform/research' ? params : undefined);
    next.delete('presets');
    for (const [key, value] of Object.entries(changes)) { if (value === null) next.delete(key); else next.set(key, value); }
    return `/platform/research${next.size ? `?${next}` : ''}`;
  }
  const groups = research ? [
    { label: 'Workspace', items: [
      { label: 'Code editor', icon: Code2, href: workspaceHref({ view: 'policy' }) },
      { label: 'Scene composition', icon: Settings2, href: workspaceHref({ view: 'scene' }) },
      { label: 'Joint controls', icon: SlidersHorizontal, href: workspaceHref({ view: 'controls' }) },
    ] },
    { label: 'Explore', items: [
      { label: 'Environments', icon: Box, children: [
        { label: 'Open floor', href: workspaceHref({ environment: 'open-floor', props: null, view: 'scene', ...(!params.has('robot') ? { presets: 'all' } : {}) }) },
        { label: 'Workbench', href: workspaceHref({ environment: 'workbench', props: null, view: 'scene', ...(!params.has('robot') ? { presets: 'all' } : {}) }) },
        { label: 'Object sorting', href: workspaceHref({ environment: 'object-sorting', props: null, view: 'scene', ...(!params.has('robot') ? { presets: 'all' } : {}) }) },
      ] },
      { label: 'Robots & arms', icon: Bot, children: [
        { label: 'All arms', href: workspaceHref({ presets: 'all' }) },
        { label: 'Single arms', href: workspaceHref({ presets: 'single' }) },
        { label: 'Dual arms', href: workspaceHref({ presets: 'dual' }) },
      ] },
      { label: 'Tasks', icon: Target, href: '/platform/library/tasks?mode=research' },
    ] },
    { ...playgroundGroups[1], items: playgroundGroups[1].items.map((item) => ({ ...item, href: `${item.href}?mode=research` })) },
  ] : playgroundGroups;
  function isActive(href: string) {
    const [path, query] = href.split('?');
    if (path !== pathname && !(path === EXPLORE_PATH && pathname.startsWith(`${PLAYGROUND_PATH}/`))) return false;
    const expected = new URLSearchParams(query);
    if (research && path === '/platform/research' && expected.get('view') === 'policy' && !params.has('view') && !params.has('robot')) return false;
    return expected.size ? [...expected].every(([key, value]) => (key === 'view' && research ? params.get(key) || 'policy' : params.get(key)) === value) : !params.has('arms') && !params.has('environment') && !params.has('robot');
  }
  const search = useRef<HTMLInputElement>(null);
  function expandSearch() {
    onMobileOpen();
    requestAnimationFrame(() => search.current?.focus());
  }
  function expandCategory(label: string) {
    setOpenedCategory(label);
    onMobileOpen();
    requestAnimationFrame(() => categoryRefs.current.get(label)?.querySelector('summary')?.focus());
  }

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
      <aside id="platform-navigation" className={styles.sidebar} data-mobile-open={mobileOpen} data-collapsed={collapsed} aria-label={`${modeLabel} navigation`}>
        <div className={styles.brandRow}>
          <Link href={homeHref} onClick={onClose} className={`${styles.brand} ${GeistPixelCircle.className}`} aria-label="atom ctrl platform">atom ctrl</Link>
          <button className={`${styles.brandRestore} ${GeistPixelCircle.className}`} onClick={onToggleCollapse} aria-label="Expand sidebar" aria-expanded={!collapsed} aria-controls="platform-navigation" title="Expand sidebar">a</button>
          <button className={styles.collapse} onClick={onToggleCollapse} aria-label="Collapse sidebar" aria-expanded={!collapsed} aria-controls="platform-navigation" title="Collapse sidebar"><ChevronsLeft size={18}/></button>
          <button className={styles.close} onClick={onClose} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <button className={styles.searchToggle} onClick={() => expandSearch()} aria-label="Search navigation" title="Search navigation"><Search size={18}/></button>
        <label className={styles.search}>
          <Search size={17} aria-hidden="true" />
          <input ref={search} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" aria-label={`Search ${mode} categories`} />
          <kbd title="Control or Command + K">⌘ K</kbd>
        </label>
        <nav className={styles.navigation} aria-label={`Browse ${mode}`}>
          {!term && <Link href={homeHref} onClick={onClose} className={styles.row} title={research ? 'Workspace' : 'Home'} aria-label={research ? 'Workspace' : 'Home'} data-active={pathname === homeHref && !params.size} aria-current={pathname === homeHref && !params.size ? 'page' : undefined}><Home size={18} /><span className={styles.rowText}>{research ? 'Workspace' : 'Home'}</span></Link>}
          {!research && (!term || 'explore'.includes(term)) && <Link href={EXPLORE_PATH} onClick={onClose} className={styles.row} title="Explore" aria-label="Explore" data-active={pathname.startsWith(`${PLAYGROUND_PATH}/`)} aria-current={pathname === EXPLORE_PATH ? 'page' : undefined}><Compass size={18} aria-hidden="true" /><span className={styles.rowText}>Explore</span></Link>}
          {filtered.map((group) => (
            <div className={styles.group} key={group.label}>
              <h2>{group.label}</h2>
              {group.items.map((item) => 'children' in item ? (
                <details key={item.label} ref={(node) => { if (node) categoryRefs.current.set(item.label, node); else categoryRefs.current.delete(item.label); }} className={styles.category} onToggle={(event) => { if (!event.currentTarget.open && openedCategory === item.label) setOpenedCategory(null); }} open={term || openedCategory === item.label || item.children?.some((child) => child.href.includes('?') && isActive(child.href)) ? true : undefined}>
                  <summary className={styles.row} title={item.label} aria-label={item.label} onClick={(event) => {
                    if (collapsed && window.matchMedia('(min-width: 761px)').matches) {
                      event.preventDefault();
                      expandCategory(item.label);
                    }
                  }}><item.icon size={18} aria-hidden="true" /><span className={styles.rowText}>{item.label}</span><ChevronRight size={15} className={styles.chevron} aria-hidden="true" /></summary>
                  <div className={styles.children}>
                    {item.children?.filter((child) => !term || item.label.toLowerCase().includes(term) || child.label.toLowerCase().includes(term)).map((child) => <Link key={child.href} href={child.href} onClick={onClose} className={styles.child} data-active={isActive(child.href)} aria-current={isActive(child.href) ? 'page' : undefined}>{child.label}</Link>)}
                  </div>
                </details>
              ) : <Link key={item.label} href={item.href!} onClick={onClose} className={styles.row} title={item.label} aria-label={item.label} data-active={isActive(item.href!)} aria-current={isActive(item.href!) ? 'page' : undefined}><item.icon size={18} aria-hidden="true"/><span className={styles.rowText}>{item.label}</span><ChevronRight size={15} className={styles.chevron}/></Link>)}
            </div>
          ))}
          {term && filtered.length === 0 && <p className={styles.noResults}>No categories found.</p>}
        </nav>
        <div className={styles.bottom}>
          <span title={modeLabel}><Layers3 size={15} aria-hidden="true" /><span className={styles.footerLabel}>{modeLabel}</span></span>
          <Link href="/" aria-label="Back to atom ctrl site" title="Back to site"><ArrowLeft size={15} aria-hidden="true" /><span className={styles.footerLabel}>Back to site</span></Link>
        </div>
      </aside>
    </>
  );
}
