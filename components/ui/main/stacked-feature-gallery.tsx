"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

type HoverExpandImage = {
  src: string;
  alt: string;
  code: string;
  title?: string;
  eyebrow?: string;
  description?: string;
  detail?: string;
};

const StackedFeatureGalleryDemo = () => {
  const images = [
    {
      src: "/images/x.com/13.jpeg",
      alt: "Illustrations by my fav AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/9.jpeg",
      alt: "Illustrations by ©AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/20.jpeg",
      alt: "Illustrations by ©AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/21.jpeg",
      alt: "Illustrations by ©AarzooAly",
      code: "# 23",
    },
    {
      src: "/images/x.com/25.jpeg",
      alt: "Illustrations by ©AarzooAly",
      code: "# 23",
    },

    {
      src: "/images/x.com/32.jpeg",
      alt: "Illustrations by ©AarzooAly",
      code: "# 23",
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3]">
      <StackedFeatureGallery className="" images={images} />
    </div>
  );
};

export { StackedFeatureGalleryDemo };

const StackedFeatureGallery = ({
  images,
  className,
  activeIndex,
  onActiveChange,
}: {
  images: HoverExpandImage[];
  className?: string;
  activeIndex?: number | null;
  onActiveChange?: (index: number) => void;
}) => {
  const [internalActiveImage, setInternalActiveImage] = useState<number | null>(
    1,
  );
  const activeImage = activeIndex ?? internalActiveImage;

  const handleActiveChange = (index: number) => {
    setInternalActiveImage(index);
    onActiveChange?.(index);
  };

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
        <div className="flex w-full flex-col items-center justify-center gap-1">
          {images.map((image, index) => (
            <React.Fragment key={index}>
              <motion.div
                className="group relative cursor-pointer overflow-hidden rounded-3xl"
                initial={{
                  height: "2.5rem",
                  width: "min(24rem, calc(100vw - 2rem))",
                }}
                animate={{
                  height: activeImage === index ? "24rem" : "2.5rem",
                  width: "min(24rem, calc(100vw - 2rem))",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={() => handleActiveChange(index)}
                onHoverStart={() => handleActiveChange(index)}
              >
                <AnimatePresence>
                  {activeImage === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute h-full w-full bg-gradient-to-t from-black/50 to-transparent"
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {activeImage === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute flex h-full w-full flex-col items-end justify-end px-4 pb-5"
                    >
                      <p className="text-left text-xs text-white/50">
                        {image.code}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Image
                  src={image.src}
                  width={768}
                  height={768}
                  className="size-full object-cover"
                  alt={image.alt}
                />
              </motion.div>
              <AnimatePresence>
                {activeImage === index && image.title ? (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
                    className="mb-3 mt-2 w-full max-w-[24rem] px-5 text-left sm:px-3 md:hidden"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-black/35">
                      {image.eyebrow}
                    </p>
                    <h3 className="mt-2 text-2xl font-medium leading-tight tracking-[-0.025em] text-black">
                      {image.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-black/55">
                      {image.description}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export { StackedFeatureGallery };

/**
 * Skiper 53 HoverExpand_002 — React + Framer Motion
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
