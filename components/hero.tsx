"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AtomLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const menuItems = ["Features", "Why Ctrl", "About Us", "Research"];
const heroHeadlines = [ "Take CTRL", "AI, Your Way", "Friend First AI", "Human like AI"];

export function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [headlineVisible, setHeadlineVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => {
      setHeadlineVisible(false);
    }, 3200);

    return () => {
      window.clearTimeout(hideTimer);
    };
  }, [headlineIndex]);

  useEffect(() => {
    if (headlineVisible) {
      return;
    }

    const showTimer = window.setTimeout(() => {
      setHeadlineIndex((current) => (current + 1) % heroHeadlines.length);
      setHeadlineVisible(true);
    }, 320);

    return () => {
      window.clearTimeout(showTimer);
    };
  }, [headlineVisible]);

  const navShellClass = [
    "mx-auto mt-3 w-full max-w-7xl transition-all duration-300",
    isScrolled
      ? "max-w-5xl rounded-[1.35rem] border border-black/10 bg-white/85 shadow-lg shadow-black/5 backdrop-blur-md"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="min-h-screen bg-white text-black">
      <header>
        <nav
          data-state={menuOpen ? "active" : "inactive"}
          className="fixed z-20 w-full px-2"
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
                        className="block text-black/55 transition-all duration-150 hover:font-semibold hover:text-black focus-visible:font-semibold focus-visible:text-black focus-visible:outline-none"
                      >
                        <span>{item}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="hidden w-fit items-center justify-end lg:flex">
                <button
                  type="button"
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
                </button>
              </div>

              <div className="absolute inset-x-0 top-full mx-4 mt-4 hidden rounded-[1.75rem] border border-black/10 bg-white/92 p-6 shadow-2xl shadow-black/10 backdrop-blur-md in-data-[state=active]:block lg:hidden">
                <div className="space-y-6">
                  <ul className="space-y-5 text-base">
                    {menuItems.map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={() => setMenuOpen(false)}
                          className="block text-black/60 transition-all duration-150 hover:font-semibold hover:text-black focus-visible:font-semibold focus-visible:text-black focus-visible:outline-none"
                        >
                          <span>{item}</span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
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
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <section className="flex min-h-screen items-start justify-center bg-white px-3 pb-6 pt-24 sm:px-6 sm:pb-10 sm:pt-28">
        <div className="relative w-full max-w-7xl overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-2xl shadow-black/10">
          <Image
            src="/assets/2.png"
            alt="Hero background"
            width={1600}
            height={900}
            priority
            className="h-[560px] w-full object-cover object-center sm:h-[620px] md:h-[500px] lg:h-[560px]"
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,18,0.14)_0%,rgba(7,11,18,0.24)_48%,rgba(7,11,18,0.38)_100%)]" />

          <div className="absolute inset-0 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center text-white">
              <h1 className="max-w-3xl text-balance font-serif text-[2.8rem] leading-[0.92] tracking-[-0.045em] [text-shadow:0_6px_24px_rgba(0,0,0,0.24)] sm:text-5xl md:text-6xl lg:text-[5.2rem]">
                <span
                  key={heroHeadlines[headlineIndex]}
                  className={[
                    "block transition-all duration-500",
                    headlineVisible
                      ? "translate-y-0 scale-100 opacity-100 blur-0"
                      : "translate-y-3 scale-[0.985] opacity-0 blur-sm",
                  ].join(" ")}
                >
                  {heroHeadlines[headlineIndex]}
                </span>
              </h1>

              <p className="mt-3 max-w-xl px-2 text-balance text-[0.95rem] leading-6 font-medium text-white/92 [text-shadow:0_4px_18px_rgba(0,0,0,0.22)] sm:mt-4 sm:max-w-2xl sm:px-0 sm:text-base md:mt-6 md:text-lg">
                Take control of your life, one conversation at a time.
              </p>

              <form className="mt-6 w-full max-w-xl sm:mt-8 sm:max-w-2xl md:mt-10">
                <div className="flex flex-col gap-2 rounded-[1.35rem] border border-white/75 bg-white/95 p-2.5 shadow-[0_18px_45px_rgba(6,26,84,0.24)] sm:flex-row sm:items-center sm:gap-2.5 sm:p-2">
                  <input
                    type="email"
                    placeholder="Enter your work email..."
                    className="h-12 flex-1 rounded-[1.05rem] border border-slate-200/80 bg-white/82 px-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-300 sm:border-0 sm:bg-transparent sm:px-5 sm:text-base"
                  />
                  <Button
                    onClick={() => {
                      window.open(
                        "https://forms.gle/NYkQTh2EeLP3Jc5Z9",
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="group relative h-12 w-full cursor-pointer overflow-hidden rounded-[1.35rem] border-transparent bg-black p-1 ps-5 pe-13 text-sm font-semibold text-white transition-all duration-500 hover:bg-black sm:min-w-[220px] sm:ps-6 sm:pe-14 sm:text-base sm:hover:ps-14 sm:hover:pe-6 md:w-fit"
                  >
                    <span className="relative z-10 transition-all duration-500">
                      Join Waitlist
                    </span>
                    <span className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-[1.05rem] bg-white text-black transition-all duration-500 sm:group-hover:right-[calc(100%-44px)] sm:group-hover:rotate-45">
                      <ArrowUpRight size={16} />
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
