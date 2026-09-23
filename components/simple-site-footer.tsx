"use client";

import Link from "next/link";
import { GeistPixelCircle, GeistPixelSquare } from "geist/font/pixel";
import { useRef, useState } from "react";
import { CONTACT_URL } from "@/lib/seo";

const footerLinks = [
  { label: "Ctrl", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Team", href: "/team" },
];

export function SimpleSiteFooter() {
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = wordmarkRef.current?.getBoundingClientRect();
    if (!bounds) return;

    setPointer({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  };

  return (
    <footer className="simple-site-footer">
      <div className="simple-site-footer-inner">
        <div
          ref={wordmarkRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setPointer(null)}
          className={`simple-site-footer-wordmark ${GeistPixelCircle.className} relative`}
        >
          <span>atom ctrl</span>
          <span
            aria-hidden="true"
            className={`${GeistPixelSquare.className} pointer-events-none absolute inset-0`}
            style={
              pointer
                ? {
                    WebkitMaskImage: `radial-gradient(circle 4.5rem at ${pointer.x}px ${pointer.y}px, #000 0%, #000 70%, transparent 100%)`,
                    maskImage: `radial-gradient(circle 4.5rem at ${pointer.x}px ${pointer.y}px, #000 0%, #000 70%, transparent 100%)`,
                  }
                : { opacity: 0 }
            }
          >
            atom ctrl
          </span>
        </div>
        <nav className="simple-site-footer-links" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <a href={CONTACT_URL} target="_blank" rel="noreferrer">
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
