"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const ExpandableResearchGalleryDemo = () => {
  const images = [
    {
      src: "/images/x.com/13.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/32.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/20.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/21.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/19.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/1.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/2.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/3.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/4.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3]">
      <ExpandableResearchGallery className="" images={images} />{" "}
    </div>
  );
};

export { ExpandableResearchGalleryDemo };

const ExpandableResearchGallery = ({
  images,
  className,
}: {
  images: {
    src: string;
    alt: string;
    code: string;
    title?: string;
    href?: string;
    frames?: string[];
    frameOffsets?: { x: number; y: number }[];
  }[];
  className?: string;
}) => {
  const [periodicIndex, setPeriodicIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileCenteredIndex, setMobileCenteredIndex] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const activeIndex = hoveredIndex ?? periodicIndex;

  useEffect(() => {
    if (hoveredIndex !== null) {
      return;
    }

    const interval = window.setInterval(() => {
      setPeriodicIndex((current) => (current + 1) % images.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [hoveredIndex, images.length]);

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    let animationFrame = 0;
    const updateCenteredCard = () => {
      animationFrame = 0;
      const railCenter = rail.getBoundingClientRect().left + rail.clientWidth / 2;
      const cards = rail.querySelectorAll<HTMLElement>("[data-research-card]");
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const bounds = card.getBoundingClientRect();
        const distance = Math.abs(bounds.left + bounds.width / 2 - railCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setMobileCenteredIndex(closestIndex);
    };
    const scheduleUpdate = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateCenteredCard);
      }
    };

    updateCenteredCard();
    rail.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
      rail.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-[80rem] px-0", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div
          ref={railRef}
          className="overflow-x-auto px-1 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-2"
        >
          <div className="flex w-max snap-x snap-mandatory items-center gap-3.5 sm:gap-4 lg:gap-[1.125rem]">
          {images.map((image, index) => (
            <motion.div
              key={image.href ?? `${image.src}-${index}`}
              className={cn(
                "relative h-[22rem] w-[15.25rem] shrink-0 snap-start overflow-hidden rounded-3xl bg-[#fbf8f2] transition-[filter,opacity] duration-500 ease-out sm:h-[23.5rem] sm:w-[16.25rem]",
                hoveredIndex !== null && hoveredIndex !== index
                  ? "opacity-60 blur-[1.5px]"
                  : "opacity-100 blur-0",
                mobileCenteredIndex !== index
                  ? "max-sm:opacity-60 max-sm:blur-[1.5px]"
                  : "max-sm:opacity-100 max-sm:blur-0",
              )}
              data-research-card
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocusCapture={() => setHoveredIndex(index)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setHoveredIndex(null);
                }
              }}
            >
              <div
                className={cn(
                  "research-sequence-mobile absolute inset-x-0 bottom-[5.75rem] top-0",
                  activeIndex === index && "research-sequence-desktop-active",
                  mobileCenteredIndex === index &&
                    "research-sequence-mobile-active",
                )}
                aria-hidden="true"
              >
                {(image.frames ?? [image.src]).map((frame, frameIndex) => (
                  <Image
                    key={frame}
                    src={frame}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 260px, 244px"
                    className="research-frame object-contain"
                    style={
                      {
                        "--research-frame-delay": `${
                          -(((200 - frameIndex * 400) % 2400 + 2400) % 2400)
                        }ms`,
                        "--research-frame-x": `${image.frameOffsets?.[frameIndex]?.x ?? 0}%`,
                        "--research-frame-y": `${image.frameOffsets?.[frameIndex]?.y ?? 0}%`,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>

              <div className="absolute inset-x-4 bottom-4 z-10 flex items-center justify-between gap-2 sm:bottom-5">
                <p className="min-w-0 max-w-[calc(100%-5.75rem)] break-words text-left text-xl font-medium leading-[0.95] tracking-[-0.04em] text-black sm:text-[1.55rem]">
                  {image.title}
                </p>
                <Link
                  href={image.href ?? "#"}
                  className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-black px-2.5 py-2.5 text-xs font-medium text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-colors hover:bg-black/85 sm:px-3 sm:py-2.5 sm:text-xs"
                >
                  See blog
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { ExpandableResearchGallery };

/**
 * Skiper 52 HoverExpand_001 — React + Framer Motion
 * Illustrations by AarzooAly - https://x.com/AarzooAly
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
