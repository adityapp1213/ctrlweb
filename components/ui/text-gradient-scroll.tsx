"use client";

import { createContext, Fragment, useContext, useRef } from "react";
import {
  motion,
  type MotionValue,
  useScroll,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";
import { LinkDottedArrow } from "@/components/ui/main/animated-link";

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

function getRestingOpacity(textOpacity: TextOpacity) {
  if (textOpacity === "none") return 0;
  if (textOpacity === "medium") return 0.3;
  return 0.1;
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
              <Fragment key={`${word}-${index}`}>
                <SpecialWord
                  progress={activeProgress}
                  range={range}
                  href={dottedHref}
                >
                  {word}
                </SpecialWord>{" "}
              </Fragment>
            );
          }

          const segment =
            type === "word" ? (
              <Word progress={activeProgress} range={range}>
                {word}
              </Word>
            ) : (
              <Letter progress={activeProgress} range={range}>
                {word}
              </Letter>
            );

          return (
            <Fragment key={`${word}-${index}`}>
              {segment}
              {" "}
            </Fragment>
          );
        })}
      </p>
    </TextGradientScrollContext.Provider>
  );
}

const Word = ({ children, progress, range }: SegmentProps) => {
  const { textOpacity } = useGradientScroll();
  const opacity = useTransform(
    progress,
    range,
    [getRestingOpacity(textOpacity), 1],
  );

  return (
    <motion.span className="mt-2 inline-block" style={{ transition: "all .5s", opacity }}>
      {children}
    </motion.span>
  );
};

const SpecialWord = ({
  children,
  progress,
  range,
  href,
}: SegmentProps & { href: string }) => {
  const { textOpacity } = useGradientScroll();
  const opacity = useTransform(
    progress,
    range,
    [getRestingOpacity(textOpacity), 1],
  );

  return (
    <motion.span className="mt-2 inline-block" style={{ transition: "all .5s", opacity }}>
      <LinkDottedArrow href={href}>{children}</LinkDottedArrow>
    </motion.span>
  );
};

const Letter = ({ children, progress, range }: SegmentProps) => {
  const amount = range[1] - range[0];
  const step = amount / children.length;

  return (
    <span className="mt-2 inline-block">
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
  const { textOpacity } = useGradientScroll();
  const opacity = useTransform(
    progress,
    range,
    [getRestingOpacity(textOpacity), 1],
  );

  return (
    <motion.span className="inline-block" style={{ transition: "all .5s", opacity }}>
      {children}
    </motion.span>
  );
};

export { TextGradientScroll };
