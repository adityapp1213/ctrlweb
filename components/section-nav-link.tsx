"use client";

import type { ReactNode } from "react";

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
  const href = `https://atomctrl.com/#${sectionId}`;

  return (
    <a href={href} onClick={onNavigate} className={className}>
      {children}
    </a>
  );
}
