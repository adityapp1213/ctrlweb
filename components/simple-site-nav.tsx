"use client";

import Link from "next/link";
import { GeistPixelCircle } from "geist/font/pixel";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { CONTACT_URL } from "@/lib/seo";

const navItems = [
  { label: "Ctrl", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Team", href: "/team" },
];

export function SimpleSiteNav({ active }: { active: string }) {
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (menuButtonRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [menuOpen]);

  return (
    <aside
      className="simple-site-nav"
      aria-label="Main navigation"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setMenuOpen(false);
      }}
    >
      <Link href="/" aria-label="atom ctrl home" className={`simple-site-nav-brand ${GeistPixelCircle.className}`}>
        atom
      </Link>
      <nav>
        <ul className="simple-site-links">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={item.label === active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="simple-site-talk">
          <a
            className="simple-site-talk-mobile-link"
            href={CONTACT_URL}
            target="_blank"
            rel="noreferrer"
          >
            Let&apos;s talk
          </a>
          <span className="simple-site-talk-desktop-copy">
            <span className="simple-site-talk-message">
              Request a demo <br></br>or learn more
            </span>
            <span className="simple-site-talk-action">
              <a
                className="simple-site-talk-connect"
                href={CONTACT_URL}
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
              <span className="simple-site-talk-arrow" aria-hidden="true" />
            </span>
          </span>
        </div>
      </nav>
      <button
        ref={menuButtonRef}
        className="simple-site-mobile-menu-button"
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls={menuId}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <Menu className="simple-site-mobile-menu-icon" aria-hidden="true" />
        <X className="simple-site-mobile-menu-close-icon" aria-hidden="true" />
      </button>
      {menuOpen ? (
        <nav
          id={menuId}
          ref={menuRef}
          className="simple-site-mobile-menu"
          aria-label="Navigation menu"
        >
          <div className="simple-site-mobile-menu-links">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                aria-current={item.label === active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a href={CONTACT_URL}>Let&apos;s talk</a>
          </div>
        </nav>
      ) : null}
    </aside>
  );
}
