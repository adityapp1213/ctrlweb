import Link from "next/link";
import { GeistPixelCircle } from "geist/font/pixel";

const footerLinks = [
  { label: "Ctrl", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Team", href: "/team" },
];

export function SimpleSiteFooter() {
  return (
    <footer className="simple-site-footer">
      <div className="simple-site-footer-inner">
        <div className={`simple-site-footer-wordmark ${GeistPixelCircle.className}`}>
          atom ctrl
        </div>
        <nav className="simple-site-footer-links" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <span>Let&apos;s talk</span>
        </nav>
        <div className="simple-site-footer-bottom">
          <p>designer aditya &amp; co designer supriya</p>
          <p>all rights reserved © 2026</p>
        </div>
      </div>
    </footer>
  );
}
