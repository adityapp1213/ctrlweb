"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AtomLogo } from "@/components/logo";
import { SectionNavLink } from "@/components/section-nav-link";
import {
  FlappingButterfly,
  InvertedFlappingButterfly,
} from "@/components/flapping-butterfly";

const menuItems = [
  { label: "Description", sectionId: "description" },
  { label: "Features", sectionId: "features" },
  { label: "Why Ctrl", sectionId: "why-ctrl" },
  { label: "Research", sectionId: "research" },
  { label: "About Us", sectionId: "about-us" },
  { label: "FAQ", sectionId: "faq" },
];

const navButterflies = [
  {
    className: "z-[70] -left-20 -top-16 size-24 -rotate-12 sm:size-32",
    inverted: false,
  },
  {
    className: "z-[70] -left-7 -top-20 size-20 rotate-6 sm:size-28",
    inverted: false,
  },
  {
    className: "z-[70] -right-16 -bottom-16 size-24 -rotate-12 sm:size-32",
    inverted: true,
  },
];

function WaitlistCta({
  className,
  wrapperClassName = "",
}: {
  className: string;
  wrapperClassName?: string;
}) {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <span
      className={[
        "relative z-[60] inline-flex overflow-visible",
        wrapperClassName,
      ].join(" ")}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocus={() => setIsInteracting(true)}
      onBlur={() => setIsInteracting(false)}
    >
      {navButterflies.map((butterfly, index) => (
        <span
          key={butterfly.className}
          className={[
            "pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out",
            isInteracting ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          {butterfly.inverted ? (
            <InvertedFlappingButterfly
              className={butterfly.className}
              frameDelay={index * 120}
            />
          ) : (
            <FlappingButterfly
              className={butterfly.className}
              frameDelay={index * 120}
            />
          )}
        </span>
      ))}
      <a
        href="https://form.typeform.com/to/nMrMD9Wh"
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        Join Waitlist
      </a>
    </span>
  );
}

export function BlogNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navShellClass = [
    "mx-auto mt-3 w-full max-w-7xl overflow-visible rounded-[1.35rem] border border-transparent transition-[max-width,background-color,border-color,box-shadow,backdrop-filter] duration-300",
    isScrolled
      ? "max-w-5xl border-black/10 bg-white/85 shadow-lg shadow-black/5 backdrop-blur-md"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header>
      <nav
        data-state={menuOpen ? "active" : "inactive"}
        className="fixed z-[100] w-full overflow-visible px-2"
      >
        <div className={navShellClass}>
          <div className="relative flex h-20 items-center justify-between px-3 sm:px-6">
            <Link href="/" aria-label="home" className="flex items-center gap-1">
              <AtomLogo size={48} title="Ctrl logo" className="shrink-0 text-black" />
              <span className="shadows-into-light-regular text-[1.9rem] tracking-[0.08em] text-black">
                Ctrl
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close Menu" : "Open Menu"}
              className="relative z-20 block cursor-pointer p-3 lg:hidden"
            >
              <Menu className="m-auto size-7 duration-200 in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0" />
              <X className="absolute inset-0 m-auto size-7 -rotate-180 scale-0 opacity-0 duration-200 in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100" />
            </button>

            <div className="absolute inset-0 m-auto hidden size-fit lg:block">
              <ul className="flex gap-10 text-[0.98rem]">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    <SectionNavLink
                      sectionId={item.sectionId}
                      className="block font-normal text-black/55 transition-[color,font-weight] duration-150 hover:font-medium hover:text-black focus-visible:font-medium focus-visible:text-black focus-visible:outline-none"
                    >
                      {item.label}
                    </SectionNavLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden w-fit items-center justify-end lg:flex">
              <WaitlistCta className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-black/85" />
            </div>

            <div className="absolute inset-x-0 top-full mx-4 mt-4 hidden rounded-[1.75rem] border border-black/10 bg-white/92 p-6 shadow-2xl shadow-black/10 backdrop-blur-md in-data-[state=active]:block lg:hidden">
              <div className="space-y-6">
                <ul className="space-y-5 text-base">
                  {menuItems.map((item) => (
                    <li key={item.label}>
                      <SectionNavLink
                        sectionId={item.sectionId}
                        onNavigate={() => setMenuOpen(false)}
                        className="block font-normal text-black/60 transition-[color,font-weight] duration-150 hover:font-medium hover:text-black focus-visible:font-medium focus-visible:text-black focus-visible:outline-none"
                      >
                        {item.label}
                      </SectionNavLink>
                    </li>
                  ))}
                </ul>

                <WaitlistCta
                  wrapperClassName="w-full"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-black px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-black/85"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
