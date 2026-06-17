"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AtomLogo } from "@/components/logo";
import Button7 from "@/components/ui/button-7";

const menuItems = ["Features", "Why Ctrl", "Research", "About Us"];

const navTargets: Partial<Record<(typeof menuItems)[number], string>> = {
  Features: "features",
  "Why Ctrl": "why-ctrl",
  Research: "research",
  "About Us": "about-us",
};

const butterflyFrames = [
  "/assets/butterfly1.svg",
  "/assets/butterfly2.svg",
  "/assets/butterfly3.svg",
  "/assets/butterfly4.svg",
];

const invertedButterflyFrames = [
  "/assets/butterfly1(inverted).svg",
  "/assets/butterfly2(inverted).svg",
  "/assets/butterfly3(inverted).svg",
  "/assets/butterfly4(inverted).svg",
];

function FlappingButterfly({
  className,
  frameDelay = 0,
  inverted = false,
}: {
  className: string;
  frameDelay?: number;
  inverted?: boolean;
}) {
  const frames = inverted ? invertedButterflyFrames : butterflyFrames;

  return (
    <div
      className={["pointer-events-none absolute z-[70]", className].join(" ")}
    >
      {frames.map((frame, index) => (
        <Image
          key={frame}
          src={frame}
          alt=""
          width={160}
          height={160}
          aria-hidden="true"
          className="absolute inset-0 size-full object-contain opacity-0 [animation:butterfly-flap_640ms_steps(1,end)_infinite]"
          style={{
            animationDelay: `${frameDelay + index * 160}ms`,
          }}
        />
      ))}
    </div>
  );
}

const navButterflies = [
  {
    className: "-left-20 -top-16 size-24 -rotate-12 sm:size-32",
    inverted: false,
  },
  {
    className: "-left-7 -top-20 size-20 rotate-6 sm:size-28",
    inverted: false,
  },
  {
    className: "-right-16 -bottom-16 size-24 -rotate-12 sm:size-32",
    inverted: true,
  },
];

function ButterflyCta({
  children,
  className,
  wrapperClassName = "",
  onClick,
  showButterflies,
}: {
  children: React.ReactNode;
  className: string;
  wrapperClassName?: string;
  onClick: () => void;
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
          <FlappingButterfly
            className={butterfly.className}
            frameDelay={index * 120}
            inverted={butterfly.inverted}
          />
        </span>
      ))}
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    </span>
  );
}

export function Hero() {
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

  const handleNavClick = (item: (typeof menuItems)[number]) => {
    const targetId = navTargets[item];

    if (!targetId) {
      return;
    }

    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <header>
        <nav
          data-state={menuOpen ? "active" : "inactive"}
          className="fixed z-[100] w-full overflow-visible px-2"
        >
          <div className={navShellClass}>
            <div className="relative flex h-20 items-center justify-between px-3 sm:px-6">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center gap-1"
              >
                <AtomLogo
                  size={48}
                  title="Ctrl logo"
                  className="shrink-0 text-black"
                />
                <span
                  className="shadows-into-light-regular text-[1.9rem] tracking-[0.08em] text-black"
                >
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
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => handleNavClick(item)}
                        className="block font-normal text-black/55 transition-[color,font-weight] duration-150 hover:font-medium hover:text-black focus-visible:font-medium focus-visible:text-black focus-visible:outline-none"
                      >
                        <span>{item}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hidden w-fit items-center justify-end lg:flex">
                <ButterflyCta
                  showButterflies={!isScrolled}
                  onClick={() => {
                    window.open(
                      "https://forms.gle/NYkQTh2EeLP3Jc5Z9",
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-black/85"
                >
                  <span>Join Waitlist</span>
                </ButterflyCta>
              </div>

              <div className="absolute inset-x-0 top-full mx-4 mt-4 hidden rounded-[1.75rem] border border-black/10 bg-white/92 p-6 shadow-2xl shadow-black/10 backdrop-blur-md in-data-[state=active]:block lg:hidden">
                <div className="space-y-6">
                  <ul className="space-y-5 text-base">
                    {menuItems.map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={() => {
                            handleNavClick(item);
                            setMenuOpen(false);
                          }}
                          className="block font-normal text-black/60 transition-[color,font-weight] duration-150 hover:font-medium hover:text-black focus-visible:font-medium focus-visible:text-black focus-visible:outline-none"
                        >
                          <span>{item}</span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <ButterflyCta
                    showButterflies={!isScrolled}
                    wrapperClassName="w-full"
                    onClick={() => {
                      setMenuOpen(false);
                      window.open(
                        "https://forms.gle/NYkQTh2EeLP3Jc5Z9",
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-black px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-black/85"
                  >
                    <span>Join Waitlist</span>
                  </ButterflyCta>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="sticky top-0 z-0 min-h-screen bg-white text-black">
        <section className="relative min-h-screen overflow-hidden bg-white">
          <div className="absolute inset-0">
            <Image
              src="/assets/mainback3.png"
              alt="Hero background"
              fill
              sizes="(min-width: 640px) 100vw, 0vw"
              priority
              className="hidden object-cover object-center sm:block"
            />
            <Image
              src="/assets/mainback(mobile).svg"
              alt="Hero background"
              fill
              sizes="(max-width: 639px) 100vw, 0vw"
              priority
              className="object-cover object-center sm:hidden"
            />
          </div>

          <div className="absolute inset-0 flex items-end justify-center px-4 pb-36 pt-24 sm:px-6 sm:pb-40 sm:pt-28 md:pb-36 lg:pb-42">
            <div className="mx-auto flex w-full max-w-4xl justify-center">
              <Button7
                onClick={() => {
                  window.open(
                    "https://forms.gle/NYkQTh2EeLP3Jc5Z9",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="h-[58px] w-[178px] rounded-xl bg-black px-0 text-[1.12rem] font-semibold text-white shadow-none hover:bg-black/85 sm:h-[60px] sm:w-[150px] sm:px-0"
              >
                See Research
              </Button7>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
