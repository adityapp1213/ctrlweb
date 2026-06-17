"use client";

import { createContext, useContext, useRef } from "react";
import {
  motion,
  type MotionValue,
  useScroll,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";
import { LinkDottedArrow } from "@/components/ui/skiper-ui/skiper40";

type TextOpacity = "none" | "soft" | "medium";
type ViewType = "word" | "letter";

type TextGradientScrollProps = {
  text: string;
  type?: ViewType;
  className?: string;
  textOpacity?: TextOpacity;
  progress?: MotionValue<number>;
  range?: [number, number];
  dottedWords?: Record<string, string>;
};

type SegmentProps = {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
};

type TextGradientScrollContextValue = {
  textOpacity: TextOpacity;
};

const TextGradientScrollContext =
  createContext<TextGradientScrollContextValue>({
    textOpacity: "soft",
  });

function useGradientScroll() {
  return useContext(TextGradientScrollContext);
}

function TextGradientScroll({
  text,
  className,
  type = "letter",
  textOpacity = "soft",
  progress,
  range: textRange = [0, 1],
  dottedWords,
}: TextGradientScrollProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 85%"],
  });

  const words = text.split(" ");
  const activeProgress = progress ?? scrollYProgress;
  const textRangeSize = textRange[1] - textRange[0];

  return (
    <TextGradientScrollContext.Provider value={{ textOpacity }}>
      <p ref={ref} className={cn("relative m-0", className)}>
        {words.map((word, index) => {
          const wordSize = textRangeSize / words.length;
          const start = textRange[0] + index * wordSize;
          const end = start + wordSize;
          const range: [number, number] = [start, end];
          const normalizedWord = word.replace(/[^\w]/g, "");
          const dottedHref = dottedWords?.[normalizedWord];

          if (dottedHref) {
            return (
              <SpecialWord
                key={`${word}-${index}`}
                progress={activeProgress}
                range={range}
                href={dottedHref}
              >
                {word}
              </SpecialWord>
            );
          }

          return type === "word" ? (
            <Word key={`${word}-${index}`} progress={activeProgress} range={range}>
              {word}
            </Word>
          ) : (
            <Letter
              key={`${word}-${index}`}
              progress={activeProgress}
              range={range}
            >
              {word}
            </Letter>
          );
        })}
      </p>
    </TextGradientScrollContext.Provider>
  );
}

const Word = ({ children, progress, range }: SegmentProps) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative me-3 mt-2 inline-flex">
      <span className="absolute opacity-10">{children}</span>
      <motion.span style={{ transition: "all .5s", opacity }}>
        {children}
      </motion.span>
    </span>
  );
};

const SpecialWord = ({
  children,
  progress,
  range,
  href,
}: SegmentProps & { href: string }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const { textOpacity } = useGradientScroll();

  return (
    <span className="relative me-3 mt-2 inline-flex">
      <span
        className={cn("absolute", {
          "opacity-0": textOpacity === "none",
          "opacity-10": textOpacity === "soft",
          "opacity-30": textOpacity === "medium",
        })}
      >
        <LinkDottedArrow
          href={href}
          preview={false}
          aria-hidden="true"
          className="pointer-events-none"
        >
          {children}
        </LinkDottedArrow>
      </span>
      <motion.span style={{ transition: "all .5s", opacity }}>
        <LinkDottedArrow href={href}>{children}</LinkDottedArrow>
      </motion.span>
    </span>
  );
};

const Letter = ({ children, progress, range }: SegmentProps) => {
  const amount = range[1] - range[0];
  const step = amount / children.length;

  return (
    <span className="relative me-3 mt-2 inline-flex">
      {children.split("").map((char, index) => {
        const start = range[0] + index * step;
        const end = range[0] + (index + 1) * step;

        return (
          <Char key={`${char}-${index}`} progress={progress} range={[start, end]}>
            {char}
          </Char>
        );
      })}
    </span>
  );
};

const Char = ({ children, progress, range }: SegmentProps) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const { textOpacity } = useGradientScroll();

  return (
    <span className="relative inline-block">
      <span
        className={cn("absolute", {
          "opacity-0": textOpacity === "none",
          "opacity-10": textOpacity === "soft",
          "opacity-30": textOpacity === "medium",
        })}
      >
        {children}
      </span>
      <motion.span style={{ transition: "all .5s", opacity }}>
        {children}
      </motion.span>
    </span>
  );
};

export { TextGradientScroll };
