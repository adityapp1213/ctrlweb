"use client";

import NumberFlow from "@number-flow/react";
import {
  motion,
  useSpring,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";

const ScrollProgressStory = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [loaderTravelDistance, setLoaderTravelDistance] = useState(0);
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start 85%", "end 85%"],
  });
  const [progressPercent, setProgressPercent] = useState(0);

  const clampedProgress = useTransform(scrollYProgress, (value) =>
    Math.min(Math.max(value, 0), 1),
  );
  const progressAsPercent = useTransform(clampedProgress, (value) =>
    Math.round(value * 100),
  );

  useMotionValueEvent(progressAsPercent, "change", (value) => {
    setProgressPercent(value);
  });

  useLayoutEffect(() => {
    const content = contentRef.current;
    const loader = loaderRef.current;

    if (!content || !loader) {
      return;
    }

    const updateTravelDistance = () => {
      const distance = content.offsetHeight - loader.offsetHeight - 16;
      setLoaderTravelDistance(Math.max(distance, 0));
    };

    updateTravelDistance();

    const observer = new ResizeObserver(updateTravelDistance);
    observer.observe(content);
    observer.observe(loader);
    window.addEventListener("resize", updateTravelDistance);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateTravelDistance);
    };
  }, []);

  const loaderTravel = useTransform(
    clampedProgress,
    [0, 1],
    [0, loaderTravelDistance],
  );
  const smoothLoaderTravel = useSpring(loaderTravel, {
    damping: 36,
    stiffness: 90,
    mass: 0.7,
  });

  const svgRadius = 18;
  const circumference = 2 * Math.PI * svgRadius;
  const stanzas = [
    "Monarch is our family of thought-grounded models. Most AI systems are built around tokens, breaking information into pieces and predicting what comes next. We believe intelligence begins earlier, with understanding.",
    "Instead of reasoning through words alone, Monarch forms and refines thought vectors that bring language, vision, audio, and memory into a shared understanding. It spends more time on difficult problems and less on simple ones, adapting its reasoning to the task at hand.",
    "Our goal is to build intelligence that can connect ideas across domains, adapt to new situations, and reason from meaning rather than patterns.",
  ];

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-10 pt-14 text-center sm:px-6 sm:pb-12 sm:pt-18",
      )}
    >
      <motion.div
        ref={loaderRef}
        drag
        dragMomentum={false}
        style={{ y: smoothLoaderTravel }}
        className={cn(
          "group absolute right-4 top-[4.9rem] z-20 cursor-grab items-center gap-1 active:cursor-grabbing sm:right-6 sm:top-[5.15rem]",
        )}
      >
        <NumberFlow
          value={progressPercent}
          className={cn(
            "text-foreground/20 absolute top-1 flex h-8 -translate-y-full items-center justify-center px-4 text-xs font-medium tabular-nums opacity-0 group-hover:opacity-100",
          )}
          suffix="%"
        />
        <div className="bg-background/30 flex size-12 items-center justify-center rounded-2xl border backdrop-blur">
          <svg
            className={cn("size-10")}
            viewBox="0 0 48 48"
            role="presentation"
          >
            <circle
              cx="24"
              cy="24"
              r={svgRadius}
              stroke="currentColor"
              strokeWidth="3"
              className={cn("opacity-30")}
              fill="none"
            />
            <motion.circle
              cx="24"
              cy="24"
              r={svgRadius}
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              style={{
                pathLength: clampedProgress,
                rotate: -90,
                transformOrigin: "50% 50%",
              }}
            />
          </svg>
        </div>
      </motion.div>

      <div ref={contentRef} className="grid w-full justify-items-center gap-10">
        {stanzas.map((stanza, index) => (
          <TextGradientScroll
            key={stanza}
            text={stanza}
            progress={clampedProgress}
            range={[index / stanzas.length, (index + 1) / stanzas.length]}
            dottedWords={{ Monarch: "/monarch" }}
            textOpacity="medium"
            className="mx-auto w-full max-w-[700px] px-5 py-4 text-justify font-sans text-2xl leading-snug text-black sm:p-4"
          />
        ))}
      </div>
    </div>
  );
};

export { ScrollProgressStory };
