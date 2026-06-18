"use client";

import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

type SectionNavLinkProps = {
  sectionId: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
};

export function SectionNavLink({
  sectionId,
  className,
  children,
  onNavigate,
}: SectionNavLinkProps) {
  const pathname = usePathname();
  const hash = `#${sectionId}`;
  const nestedHash = `##${sectionId}`;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate?.();

    if (pathname !== "/") {
      window.location.href = `/${nestedHash}`;
      return;
    }

    const target = document.getElementById(sectionId);

    if (!target) {
      window.location.href = `/${hash}`;
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", hash);
  };

  return (
    <a
      href={pathname === "/" ? `/${hash}` : `/${nestedHash}`}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
