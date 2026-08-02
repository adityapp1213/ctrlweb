"use client";

import Image from "next/image";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FlappingButterfly,
  InvertedFlappingButterfly,
} from "@/components/butterfly/flapping-butterfly";
import { AtomLogo } from "@/components/logo";
import Button7 from "@/components/ui/button-7";

const menuItems = [
  { label: "Research", href: "/research" },
  { label: "Firth", href: "/firth" },
  { label: "Company", href: "/company" },
] as const;

const siteUrl = "https://atomctrl.com";
const labHref = "https://lab.atomctrl.com";

const labNavFrames = [
  ...Array.from({ length: 25 }, (_, index) => `/assets/lab-new/${index + 1}.png`),
];

const researchMenuItems = [
  {
    title: "Monarch",
    description: "Thought-grounded multimodal architecture.",
    href: `${siteUrl}/monarch`,
    image: "/assets/research/1o1.svg",
    frames: Array.from(
      { length: 6 },
      (_, index) => `/assets/research/1o${index + 1}.svg`,
    ),
    frameOffsets: [
      { x: -1.4, y: 0.3 },
      { x: 0.7, y: 3.3 },
      { x: -1.8, y: -0.1 },
      { x: -2.4, y: -2.4 },
      { x: 0, y: 0.1 },
      { x: 3, y: -0.4 },
    ],
  },
  {
    title: "Interaction system",
    description: "Interfaces for reasoning with thinking machines.",
    href: `${siteUrl}/interaction-systems`,
    image: "/assets/research/2o1.svg",
    frames: Array.from(
      { length: 6 },
      (_, index) => `/assets/research/2o${index + 1}.svg`,
    ),
    frameOffsets: [
      { x: 3.6, y: 0.5 },
      { x: -0.2, y: 0.6 },
      { x: 0.2, y: 0.3 },
      { x: 4.4, y: -0.2 },
      { x: -0.5, y: -0.4 },
      { x: -0.7, y: -0.6 },
    ],
  },
  {
    title: "Godel model",
    description: "Reflective model structure and recursive checks.",
    href: `${siteUrl}/godel-model`,
    image: "/assets/research/4o1.svg",
    frames: Array.from(
      { length: 6 },
      (_, index) => `/assets/research/4o${index + 1}.svg`,
    ),
    frameOffsets: [
      { x: -0.5, y: -0.3 },
      { x: -1.2, y: 0.3 },
      { x: 2.3, y: -0.5 },
      { x: 3.1, y: -0.6 },
      { x: 0.1, y: 0.4 },
      { x: -0.1, y: 0.9 },
    ],
  },
  {
    title: "Scaling synthetic data",
    description: "How generated data changes training behavior.",
    href: `${siteUrl}/scaling-synthetic-data`,
    image: "/assets/research/3o1.svg",
    frames: Array.from(
      { length: 6 },
      (_, index) => `/assets/research/3o${index + 1}.svg`,
    ),
    frameOffsets: [
      { x: 2.3, y: 0 },
      { x: -1.5, y: 0.1 },
      { x: -0.2, y: 2.8 },
      { x: 4.5, y: -1.2 },
      { x: -1.3, y: 0 },
      { x: -0.1, y: -0.8 },
    ],
  },
] as const;

const firthMenuItems = [
  {
    title: "Firth overview",
    description: "Monarch v3 and the JEPA-centered architecture.",
    href: `${siteUrl}/##description`,
  },
  {
    title: "Architecture notes",
    description: "A future research brief for the next model track.",
    href: `${siteUrl}/##research`,
  },
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

const heroCtaButterflies = [
  {
    className: "z-[20] -left-14 -top-12 size-20 rotate-12 sm:hidden",
    inverted: false,
  },
  {
    className: "z-[20] -right-16 -top-10 size-24 -rotate-12 sm:hidden",
    inverted: true,
  },
  {
    className: "z-[20] -right-3 -bottom-14 size-20 rotate-6 sm:hidden",
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
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    </span>
  );
}

function updateCardShader(event: React.MouseEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    "--spot-x",
    `${event.clientX - rect.left}px`,
  );
  event.currentTarget.style.setProperty(
    "--spot-y",
    `${event.clientY - rect.top}px`,
  );
}

function ResearchMegaMenu() {
  const [hoveredResearchIndex, setHoveredResearchIndex] = useState<
    number | null
  >(null);
  const [isLabHovered, setIsLabHovered] = useState(false);

  return (
    <div className="absolute left-1/2 top-full hidden w-[min(72rem,calc(100vw-2rem))] -translate-x-1/2 pt-3 lg:block">
      <div className="grid min-h-[22rem] grid-cols-[1fr_20rem] gap-6 rounded-[1.75rem] border border-black/10 bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
        <div className="grid content-start gap-4">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.18em] text-black/35">
                Research
              </p>
              <h2 className="mt-2 text-2xl font-normal leading-none text-black">
                Current briefs and model notes
              </h2>
            </div>
            <a
              href="https://atomctrl.com/##research"
              className="inline-flex items-center gap-1 text-sm text-black/45 transition-colors hover:text-black"
            >
              View all
              <ArrowUpRight className="size-4" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {researchMenuItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                onMouseMove={updateCardShader}
                onMouseEnter={() => setHoveredResearchIndex(index)}
                onMouseLeave={() => setHoveredResearchIndex(null)}
                onFocus={() => setHoveredResearchIndex(index)}
                onBlur={() => setHoveredResearchIndex(null)}
                className={[
                  "group relative grid min-h-[8.35rem] overflow-hidden rounded-2xl border border-black/[0.07] bg-white p-3 transition-[background-color,border-color,filter,opacity,transform] duration-300 hover:-translate-y-0.5 hover:border-black/15 hover:bg-[#f7f3ea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20",
                  hoveredResearchIndex !== null && hoveredResearchIndex !== index
                    ? "opacity-60 blur-[1.5px]"
                    : "opacity-100 blur-0",
                ].join(" ")}
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(12rem circle at var(--spot-x,50%) var(--spot-y,50%), rgba(255,255,255,0.82), rgba(255,255,255,0.12) 34%, transparent 62%)",
                  }}
                />
                <span className="relative grid grid-cols-[1fr_7rem] gap-3">
                  <span className="flex min-w-0 flex-col justify-between">
                    <span>
                      <span className="block text-lg font-normal leading-tight text-black">
                        {item.title}
                      </span>
                      <span className="mt-2 block text-sm leading-5 text-black/50">
                        {item.description}
                      </span>
                    </span>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs text-black/42 transition-colors group-hover:text-black">
                      Read brief
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </span>
                  <span
                    className={[
                      "relative min-h-[6.8rem] overflow-hidden rounded-xl bg-white",
                      hoveredResearchIndex === index
                        ? "research-sequence-desktop-active"
                        : "",
                    ].join(" ")}
                  >
                    {item.frames.map((frame, frameIndex) => (
                      <Image
                        key={frame}
                        src={frame}
                        alt=""
                        fill
                        sizes="112px"
                        className="research-frame object-contain p-1.5 transition-transform duration-300 group-hover:scale-[1.03]"
                        style={
                          {
                            "--research-frame-delay": `${
                              -(((200 - frameIndex * 400) % 2400 + 2400) %
                                2400)
                            }ms`,
                            "--research-frame-x": `${
                              item.frameOffsets[frameIndex]?.x ?? 0
                            }%`,
                            "--research-frame-y": `${
                              item.frameOffsets[frameIndex]?.y ?? 0
                            }%`,
                          } as React.CSSProperties
                        }
                      />
                    ))}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <a
          href={labHref}
          onMouseMove={updateCardShader}
          onMouseEnter={() => setIsLabHovered(true)}
          onMouseLeave={() => setIsLabHovered(false)}
          onFocus={() => setIsLabHovered(true)}
          onBlur={() => setIsLabHovered(false)}
          className="group relative overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-4 transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-black/15 hover:bg-[#f7f3ea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(14rem circle at var(--spot-x,50%) var(--spot-y,50%), rgba(255,255,255,0.74), rgba(255,255,255,0.12) 38%, transparent 66%)",
            }}
          />
          <span className="relative flex h-full flex-col justify-between">
            <span>
              <span className="relative block aspect-[1.35] overflow-hidden rounded-xl bg-white">
                <span
                  className={[
                    "absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2",
                    isLabHovered ? "lab-nav-sequence-active" : "",
                  ].join(" ")}
                >
                  {labNavFrames.map((frame, frameIndex) => (
                    <Image
                      key={frame}
                      src={frame}
                      alt=""
                      fill
                      unoptimized
                      sizes="320px"
                      className="lab-nav-frame object-contain p-3"
                      style={
                        {
                          "--lab-nav-frame-delay": `${
                            -(((6500 - frameIndex * 260) % 6500 + 6500) %
                              6500)
                          }ms`,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </span>
              </span>
              <span className="mt-5 block text-2xl font-normal leading-none text-black">
                Atom Ctrl Lab
              </span>
              <span className="mt-3 block text-sm leading-6 text-black/54">
                Experiments, prototypes, and working notes connected to the
                Monarch research track.
              </span>
            </span>
            <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition-colors group-hover:bg-black/85">
              Open Lab
              <ArrowUpRight className="size-4" />
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}

function FirthMegaMenu() {
  return (
    <div className="absolute left-1/2 top-full hidden w-[min(58rem,calc(100vw-2rem))] -translate-x-1/2 pt-3 lg:block">
      <div className="grid min-h-[18rem] grid-cols-[1fr_19rem] gap-5 rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
        <div className="grid content-start gap-5">
          <div>
            <p className="text-xs tracking-[0.18em] text-black/35">Firth</p>
            <h2 className="mt-2 text-2xl font-normal leading-none text-black">
              Monarch v3 model track
            </h2>
            <p className="mt-3 max-w-[32rem] text-sm leading-6 text-black/50">
              The next version of Monarch, built around JEPA as the primary
              model architecture.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {firthMenuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group inline-flex min-w-[15rem] items-center justify-between gap-5 rounded-xl border border-black/[0.08] bg-white px-5 py-3 text-left transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-black/15 hover:bg-[#f7f3ea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
              >
                <span>
                  <span className="block text-base font-normal leading-tight text-black">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-black/45">
                    {item.description}
                  </span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-black/35 transition-colors group-hover:text-black" />
              </a>
            ))}
          </div>
        </div>

        <a
          href={`${siteUrl}/##research`}
          onMouseMove={updateCardShader}
          className="group relative overflow-hidden rounded-2xl border border-black/[0.08] bg-white p-4 transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-black/15 hover:bg-[#f7f3ea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        >
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(14rem circle at var(--spot-x,50%) var(--spot-y,50%), rgba(255,255,255,0.74), rgba(255,255,255,0.12) 38%, transparent 66%)",
            }}
          />
          <span className="relative flex h-full flex-col justify-between">
            <span>
              <span className="flex aspect-[1.35] items-center justify-center rounded-xl bg-[#f7f3ea] px-6 text-center">
                <span className="text-2xl font-normal leading-tight text-black">
                  Firth research brief
                </span>
              </span>
              <span className="mt-5 block text-2xl font-normal leading-none text-black">
                Coming next
              </span>
              <span className="mt-3 block text-sm leading-6 text-black/54">
                A focused note for the JEPA-based Monarch v3 direction.
              </span>
            </span>
            <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition-colors group-hover:bg-black/85">
              View research
              <ArrowUpRight className="size-4" />
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}

export function Hero() {
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

  useEffect(() => {
    let retryTimeout: number | null = null;

    const normalizeNestedHash = () => {
      const currentHash = window.location.hash;

      if (!currentHash.startsWith("##")) {
        return;
      }

      const sectionId = currentHash.slice(2);
      const target = document.getElementById(sectionId);

      if (!target) {
        retryTimeout = window.setTimeout(normalizeNestedHash, 60);
        return;
      }

      target.scrollIntoView({
        behavior: "auto",
        block: "start",
      });

      window.history.replaceState(null, "", `/#${sectionId}`);
    };

    normalizeNestedHash();

    return () => {
      if (retryTimeout) {
        window.clearTimeout(retryTimeout);
      }
    };
  }, []);

  const navShellClass = [
    "relative mx-auto mt-4 w-full max-w-[50rem] overflow-visible rounded-xl border border-black/10 bg-white/85 shadow-sm shadow-black/5 backdrop-blur-md transition-[max-width,background-color,border-radius,background-color,border-color,box-shadow,backdrop-filter] duration-300",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header>
        <nav
          data-state={menuOpen ? "active" : "inactive"}
          className="fixed z-[100] w-full overflow-visible px-2"
        >
          <div
            className={navShellClass}
          >
            <div
              className="relative flex h-14 items-center justify-between px-3 sm:px-5"
            >
              <a
                href={siteUrl}
                aria-label="home"
                className="flex items-center gap-1"
              >
                <AtomLogo
                  size={38}
                  title="Ctrl logo"
                  className="shrink-0 text-black"
                />
                <span
                  className="shadows-into-light-regular text-[1.55rem] tracking-[0.08em] text-black"
                >
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
                  {menuItems.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="block font-normal text-black/55 transition-[color,font-weight] duration-150 hover:font-medium hover:text-black focus-visible:font-medium focus-visible:text-black focus-visible:outline-none"
                      >
                        <span>{item.label}</span>
                      </a>
                    </li>
                  ))}
                  {/* Temporarily hidden until the Lab is ready to launch.
                  <li>
                    <a
                      href={labHref}
                      className="block font-normal text-black/55 transition-[color,font-weight] duration-150 hover:font-medium hover:text-black focus-visible:font-medium focus-visible:text-black focus-visible:outline-none"
                    >
                      Lab
                    </a>
                  </li>
                  */}
                </ul>
              </div>

              <div className="hidden w-fit items-center justify-end lg:flex">
                <ButterflyCta
                  showButterflies={!isScrolled}
                  onClick={() => {
                    window.open(
                      "https://form.typeform.com/to/nMrMD9Wh",
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-[0.95rem] font-medium text-white transition-colors hover:bg-black/85"
                >
                  <span>Join Waitlist</span>
                </ButterflyCta>
              </div>

              <div className="absolute inset-x-0 top-full mx-4 mt-4 hidden rounded-[1.75rem] border border-black/10 bg-white/92 p-6 shadow-2xl shadow-black/10 backdrop-blur-md in-data-[state=active]:block lg:hidden">
                <div className="space-y-6">
                  <ul className="space-y-5 text-base">
                    {menuItems.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="block font-normal text-black/60 transition-[color,font-weight] duration-150 hover:font-medium hover:text-black focus-visible:font-medium focus-visible:text-black focus-visible:outline-none"
                        >
                          <span>{item.label}</span>
                        </a>
                      </li>
                    ))}
                    {/* Temporarily hidden until the Lab is ready to launch.
                    <li>
                      <a
                        href={labHref}
                        onClick={() => setMenuOpen(false)}
                        className="block font-normal text-black/60 transition-[color,font-weight] duration-150 hover:font-medium hover:text-black focus-visible:font-medium focus-visible:text-black focus-visible:outline-none"
                      >
                        Lab
                      </a>
                    </li>
                    */}
                  </ul>

                  <ButterflyCta
                    showButterflies={!isScrolled}
                    wrapperClassName="w-full"
                    onClick={() => {
                      setMenuOpen(false);
                      window.open(
                        "https://form.typeform.com/to/nMrMD9Wh",
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-black px-5 py-2.5 text-[0.95rem] font-medium text-white transition-colors hover:bg-black/85"
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
        <section
          id="hero"
          className="relative min-h-screen scroll-mt-28 overflow-hidden bg-white"
        >
          <div className="absolute inset-0">
            <Image
              src="/assets/mainback6.png"
              alt="Hero background"
              fill
              sizes="(min-width: 640px) 100vw, 0vw"
              priority
              className="hidden object-cover object-center sm:block"
            />
            <Image
              src="/assets/mobileback.svg"
              alt="Hero background"
              fill
              sizes="(max-width: 639px) 100vw, 0vw"
              priority
              className="object-cover object-center sm:hidden"
            />
          </div>

          <div className="absolute inset-0 flex items-end justify-center px-4 pb-36 pt-24 sm:px-6 sm:pb-40 sm:pt-28 md:pb-36 lg:pb-42">
            <div className="mx-auto flex w-full max-w-4xl justify-center">
              <span className="relative inline-flex overflow-visible">
                {heroCtaButterflies.map((butterfly, index) => (
                  butterfly.inverted ? (
                    <InvertedFlappingButterfly
                      key={butterfly.className}
                      className={butterfly.className}
                      frameDelay={index * 90}
                    />
                  ) : (
                    <FlappingButterfly
                      key={butterfly.className}
                      className={butterfly.className}
                      frameDelay={index * 90}
                    />
                  )
                ))}
                <Button7
                  onClick={() => {
                    document.getElementById("research")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="relative z-10 h-[58px] w-[178px] rounded-xl bg-black px-0 text-[1.16rem] font-medium text-white shadow-none hover:bg-black/85 sm:h-[60px] sm:w-[150px] sm:px-0"
                >
                  See Research
                </Button7>
              </span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
