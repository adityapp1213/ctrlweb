import Link from "next/link";
import { GeistPixelCircle } from "geist/font/pixel";

const navItems = [
  { label: "Ctrl", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Team", href: "/team" },
];

export function SimpleSiteNav({ active }: { active: string }) {
  return (
    <aside className="simple-site-nav" aria-label="Main navigation">
      <div className={`simple-site-nav-brand ${GeistPixelCircle.className}`}>
        atom
      </div>
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
        <div className="simple-site-nav-rule" />
      </nav>
    </aside>
  );
}
