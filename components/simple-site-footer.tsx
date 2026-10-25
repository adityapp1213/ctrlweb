"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { CONTACT_URL } from "@/lib/seo";
import { PixelHoverMark } from "@/components/pixel-hover-mark";

const footerLinks = [
  { label: "Ctrl", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Team", href: "/team" },
];

export function SimpleSiteFooter({ reveal = false }: { reveal?: boolean }) {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!reveal) {
      return;
    }

    const footer = footerRef.current;
    const stack = footer?.parentElement;

    if (!footer || !stack) {
      return;
    }

    const updateFooterSpace = () => {
      stack.style.setProperty(
        "--simple-site-footer-space",
        `${footer.getBoundingClientRect().height}px`,
      );
    };

    updateFooterSpace();
    const observer = new ResizeObserver(updateFooterSpace);
    observer.observe(footer);

    return () => {
      observer.disconnect();
      stack.style.removeProperty("--simple-site-footer-space");
    };
  }, [reveal]);

  return (
    <footer
      ref={footerRef}
      className={`simple-site-footer${reveal ? " simple-site-footer-reveal" : ""}`}
    >
      <div className="simple-site-footer-inner">
        <PixelHoverMark text="atom ctrl" className="simple-site-footer-wordmark relative" />
        <nav className="simple-site-footer-links" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <a href={CONTACT_URL} target="_blank" rel="noreferrer" aria-label="Let&apos;s talk (opens in a new tab)">
            Let&apos;s talk
          </a>
        </nav>
        <div className="simple-site-footer-bottom">
          <p>designer aditya &amp; co designer supriya</p>
          <p>all rights reserved © 2026</p>
        </div>
      </div>
    </footer>
  );
}
