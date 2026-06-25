"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

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
  }[];
  className?: string;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(1);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full max-w-6xl px-0 sm:px-5", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="flex w-full items-center justify-center gap-1">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="relative cursor-pointer overflow-hidden rounded-3xl"
              initial={{
                width: "clamp(2.25rem, 10vw, 5rem)",
                height: "clamp(18rem, 70vw, 24rem)",
              }}
              animate={{
                width:
                  activeImage === index
                    ? "min(24rem, calc(100vw - 3.5rem))"
                    : "clamp(2.25rem, 10vw, 5rem)",
                height: "clamp(18rem, 70vw, 24rem)",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActiveImage(index)}
              onHoverStart={() => setActiveImage(index)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 384px, 70vw"
                className={cn(
                  "object-cover transition-[filter,opacity,transform] duration-500 ease-out",
                  activeImage === index
                    ? "scale-100 opacity-100 blur-0"
                    : "scale-[1.02] opacity-70 blur-[1.5px]",
                )}
              />
              {activeImage !== index && (
                <div className="absolute inset-0 bg-white/8" aria-hidden="true" />
              )}
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 via-black/18 to-transparent backdrop-blur-[2px]"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-x-3 bottom-4 z-10 flex items-end justify-between gap-2 sm:inset-x-5 sm:bottom-5 sm:gap-4"
                  >
                    <p className="max-w-[48%] text-left text-xl font-medium leading-[0.95] tracking-[-0.04em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:max-w-[58%] sm:text-3xl">
                      {image.title}
                    </p>
                    <Link
                      href={image.href ?? "#"}
                      onClick={(event) => event.stopPropagation()}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-black px-3 py-2.5 text-sm font-medium text-white shadow-[0_14px_30px_rgba(0,0,0,0.24)] transition-colors hover:bg-black/85 sm:gap-2 sm:px-5 sm:py-3 sm:text-base"
                    >
                      See blog
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
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
