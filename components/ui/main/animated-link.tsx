"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

import {
  FlappingButterfly,
  InvertedFlappingButterfly,
} from "@/components/butterfly/flapping-butterfly";
import { cn } from "@/lib/utils";
import Button7 from "@/components/ui/button-7";

const monarchCtaButterflies = [
  {
    className: "z-10 -right-20 -top-16 size-24 rotate-12 sm:size-32",
    inverted: true,
  },
  {
    className: "z-10 -right-7 -top-20 size-20 -rotate-6 sm:size-28",
    inverted: true,
  },
  {
    className: "z-10 -left-16 -bottom-16 size-24 rotate-12 sm:size-32",
    inverted: false,
  },
];

const AnimatedLinkDemo = () => {
  return (
    <section className="h-full snap-y snap-mandatory overflow-y-scroll">
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-5">
        <Link001 href="mailto:hi@skiper-ui.com">hi@skiper-ui.com</Link001>
        <Link002 href="mailto:hi@skiper-ui.com">hi@skiper-ui.com</Link002>
        <Link003 href="mailto:hi@skiper-ui.com">hi@skiper-ui.com</Link003>
        <Link004 href="mailto:hi@skiper-ui.com">hi@skiper-ui.com</Link004>
        <Link005 href="mailto:hi@skiper-ui.com">hi@skiper-ui.com</Link005>
      </div>
    </section>
  );
};

export {
  Link000,
  Link001,
  Link002,
  Link003,
  Link004,
  Link005,
  LinkDottedArrow,
  AnimatedLinkDemo,
};

const Link000 = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center",
        className,
        "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:before:origin-left hover:before:scale-x-100",
      )}
    >
      {children}
    </Link>
  );
};
const Link001 = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      className={cn(
        "group relative flex items-center",
        "before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:before:origin-left hover:before:scale-x-100",
        className,
      )}
    >
      {children}
      <svg
        className="ml-[0.3em] mt-[0em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </a>
  );
};
const Link002 = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <a
      href={href}
      className={cn(
        "group relative flex items-center",
        className,
        "before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-left",
        "hover:before:origin-right hover:before:scale-x-100",
      )}
    >
      {children}
      <svg
        className="ml-[0.3em] mt-[0em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </a>
  );
};
const Link003 = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <a
      href={href}
      className={cn(
        "group relative flex items-center",
        className,
        "before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-center",
        "hover:before:scale-x-100",
      )}
    >
      {children}
      <svg
        className="ml-[0.3em] mt-[0em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </a>
  );
};

const Link004 = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <a
      href={href}
      className={cn(
        "group relative flex items-center",
        className,
        "before:pointer-events-none before:absolute before:left-0 before:w-full before:bg-white before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-center md:before:bottom-0",
        "before:z-1 px-2 before:h-0 before:scale-x-100 before:mix-blend-difference hover:before:h-[1.4em]",
      )}
    >
      {children}
      <svg
        className="z-0 ml-[0.6em] mt-[0em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </a>
  );
};
const Link005 = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <a
      href={href}
      className={cn(
        className,
        "group relative flex items-center",
        "before:pointer-events-none before:absolute before:left-0 before:w-full before:bg-white before:content-['']",
        "before:scale-x-1 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-left md:before:top-0",
        "before:z-1 px-2 before:h-full before:scale-x-0 before:mix-blend-difference hover:before:scale-x-100",
      )}
    >
      {children}
      <svg
        className="z-0 ml-[0.6em] mt-[0em] size-[0.55em] -translate-x-1 rotate-45 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    </a>
  );
};

const LinkDottedArrow = ({
  children,
  href,
  className,
  preview = true,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  href: string;
  preview?: boolean;
}) => {
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const previewIsVisible = preview && previewOpen;

  React.useEffect(() => {
    if (!previewOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setPreviewOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [previewOpen]);

  return (
    <span
      ref={triggerRef}
      {...props}
      className={cn(
        "group relative inline-flex items-baseline text-[#e2687d]",
        "transition-colors duration-300 hover:text-[#d95d72]",
        className,
      )}
    >
      <a
        href={href}
        onClick={(event) => {
          if (
            preview &&
            window.matchMedia("(hover: none), (pointer: coarse)").matches
          ) {
            event.preventDefault();
            setPreviewOpen(true);
          }
        }}
        className="border-b border-dotted border-current leading-none"
      >
        {children}
      </a>
      <svg
        className="pointer-events-none ml-0 size-[0.52em] w-0 translate-y-1 opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:ml-[0.3em] group-hover:w-[0.52em] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
      {preview ? (
        <span
          className={cn(
            "pointer-events-none absolute left-0 top-full z-[80] block w-[min(21rem,calc(100vw-2rem))] pt-5 text-left text-black opacity-0 transition-all duration-300 sm:w-[24rem] sm:pt-7 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
            previewIsVisible && "pointer-events-auto translate-y-0 opacity-100",
          )}
        >
          <span className="relative block rounded-[1.35rem] border border-black/8 bg-white p-2 shadow-[0_16px_34px_rgba(0,0,0,0.14)] sm:rounded-[1.7rem] sm:p-2.5 sm:shadow-[0_18px_42px_rgba(0,0,0,0.14)]">
            <span className="relative block overflow-hidden rounded-xl bg-[#f5f1ea] sm:rounded-[1.35rem]">
              <Image
                src="/assets/monarch.png"
                alt="Monarch preview"
                width={512}
                height={360}
                className="aspect-[16/10.5] w-full object-cover"
              />
            </span>
            <span className="relative z-10 block px-4 pb-4 pt-5 sm:px-6 sm:pb-6 sm:pt-7">
              <span className="block">
                <span className="block text-[1.18rem] font-medium leading-tight tracking-[-0.025em] text-black/90 sm:text-[1.42rem]">
                  Explore Monarch
                </span>
                <span className="mt-2 block max-w-[18rem] text-[0.92rem] leading-relaxed text-black/52 sm:mt-3 sm:max-w-[19rem] sm:text-[1.02rem]">
                  Dive deeper into our family of thought-grounded multimodal
                  models.
                </span>
              </span>
              <span className="my-4 block h-px w-full bg-black/10 sm:my-6" />
              <span className="relative inline-flex w-full overflow-visible">
                {monarchCtaButterflies.map((butterfly, index) =>
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
                  ),
                )}
                <Button7
                  onClick={() => {
                    window.location.href = href;
                  }}
                  className="h-12 w-full rounded-xl bg-black px-5 text-[0.98rem] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_8px_18px_rgba(0,0,0,0.18)] hover:bg-black/85 sm:h-14 sm:px-6 sm:text-[1.05rem]"
                >
                  <span className="grid w-full grid-cols-[1fr_auto_1fr] items-center">
                    <span />
                    <span>Go to page</span>
                    <ArrowRight
                      className="ml-auto size-5 sm:size-6"
                      strokeWidth={1.8}
                    />
                  </span>
                </Button7>
              </span>
            </span>
          </span>
        </span>
      ) : null}
    </span>
  );
};

/**
 * Skiper 40 Animated Link — React
 * Inspired by and adapted from https://cursor.com/?from=home
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the cursor.com . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.in
 * Twitter: https://x.com/Gur__vi
 */
