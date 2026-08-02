"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FlappingButterfly,
  InvertedFlappingButterfly,
} from "@/components/butterfly/flapping-butterfly";
import { AtomLogo } from "@/components/logo";

const routeNavItems = [
  { label: "Research", href: "/research" },
  { label: "Firth", href: "/firth" },
  { label: "Company", href: "/company" },
] as const;

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

function ButterflyWaitlistLink({
  className,
  wrapperClassName = "",
  showButterflies,
}: {
  className: string;
  wrapperClassName?: string;
  showButterflies: boolean;
}) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [butterfliesVisible, setButterfliesVisible] = useState(showButterflies);

  useEffect(() => {
    const shouldShowButterflies = showButterflies || isInteracting;
    const timeout = window.setTimeout(() => {
      setButterfliesVisible(shouldShowButterflies);
    }, shouldShowButterflies ? 0 : 420);

    return () => window.clearTimeout(timeout);
  }, [showButterflies, isInteracting]);

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
            butterfliesVisible ? "opacity-100" : "opacity-0",
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

export function RouteTopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        data-state={menuOpen ? "active" : "inactive"}
        className="fixed inset-x-0 top-0 z-[100] w-full overflow-visible px-2"
      >
        <div className="relative mx-auto mt-4 w-full max-w-[50rem] overflow-visible rounded-xl border border-black/10 bg-white/85 shadow-sm shadow-black/5 backdrop-blur-md">
          <div className="relative flex h-14 items-center justify-between px-3 sm:px-5">
            <a href="/" aria-label="home" className="flex items-center gap-1">
              <AtomLogo
                size={38}
                title="Ctrl logo"
                className="shrink-0 text-black"
              />
              <span className="shadows-into-light-regular text-[1.55rem] tracking-[0.08em] text-black">
                Ctrl
              </span>
            </a>

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
              <ul className="flex gap-8 text-[0.92rem]">
                {routeNavItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block font-normal text-black/55 transition-[color,font-weight] duration-150 hover:font-medium hover:text-black focus-visible:font-medium focus-visible:text-black focus-visible:outline-none"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden w-fit items-center justify-end lg:flex">
              <ButterflyWaitlistLink
                showButterflies={!isScrolled}
                className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-[0.95rem] font-medium text-white transition-colors hover:bg-black/85"
              />
            </div>

            <div className="absolute inset-x-0 top-full mx-4 mt-4 hidden rounded-[1.75rem] border border-black/10 bg-white/92 p-6 shadow-2xl shadow-black/10 backdrop-blur-md in-data-[state=active]:block lg:hidden">
              <div className="space-y-6">
                <ul className="space-y-5 text-base">
                  {routeNavItems.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block font-normal text-black/60 transition-[color,font-weight] duration-150 hover:font-medium hover:text-black focus-visible:font-medium focus-visible:text-black focus-visible:outline-none"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>

                <ButterflyWaitlistLink
                  showButterflies={!isScrolled}
                  wrapperClassName="w-full"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-black px-5 py-2.5 text-[0.95rem] font-medium text-white transition-colors hover:bg-black/85"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
