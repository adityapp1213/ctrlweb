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
  dottedPhrases?: Record<string, string>;
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
  dottedPhrases,
}: TextGradientScrollProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 85%"],
  });

  const words = text.split(" ");
  const activeProgress = progress ?? scrollYProgress;
  const textRangeSize = textRange[1] - textRange[0];
  const normalizedWords = words.map(normalizeTextToken);
  const normalizedDottedWords = Object.entries(dottedWords ?? {}).reduce<
    Record<string, string>
  >((acc, [word, href]) => {
    acc[normalizeTextToken(word)] = href;
    return acc;
  }, {});
  const phraseEntries = Object.entries(dottedPhrases ?? {}).map(
    ([phrase, href]) => ({
      href,
      phrase,
      tokens: phrase.split(" ").map(normalizeTextToken),
    }),
  );
  const renderedSegments = [];

  for (let index = 0; index < words.length; index += 1) {
    const wordSize = textRangeSize / words.length;
    const start = textRange[0] + index * wordSize;
    const matchingPhrase = phraseEntries.find(({ tokens }) =>
      tokens.every((token, tokenIndex) => normalizedWords[index + tokenIndex] === token),
    );

    if (matchingPhrase) {
      const phraseWords = words.slice(index, index + matchingPhrase.tokens.length);
      const end = start + wordSize * matchingPhrase.tokens.length;

      renderedSegments.push(
        <Fragment key={`${matchingPhrase.phrase}-${index}`}>
          <SpecialWord
            progress={activeProgress}
            range={[start, end]}
            href={matchingPhrase.href}
          >
            {phraseWords.join(" ")}
          </SpecialWord>{" "}
        </Fragment>,
      );

      index += matchingPhrase.tokens.length - 1;
      continue;
    }

    const end = start + wordSize;
    const range: [number, number] = [start, end];
    const normalizedWord = normalizeTextToken(words[index]);
    const dottedHref = normalizedDottedWords[normalizedWord];

    if (dottedHref) {
      renderedSegments.push(
        <Fragment key={`${words[index]}-${index}`}>
          <SpecialWord
            progress={activeProgress}
            range={range}
            href={dottedHref}
          >
            {words[index]}
          </SpecialWord>{" "}
        </Fragment>,
      );
      continue;
    }

    const segment =
      type === "word" ? (
        <Word progress={activeProgress} range={range}>
          {words[index]}
        </Word>
      ) : (
        <Letter progress={activeProgress} range={range}>
          {words[index]}
        </Letter>
      );

    renderedSegments.push(
      <Fragment key={`${words[index]}-${index}`}>
        {segment}
        {" "}
      </Fragment>,
    );
  }

  return (
    <TextGradientScrollContext.Provider value={{ textOpacity }}>
      <p ref={ref} className={cn("relative m-0", className)}>
        {renderedSegments}
      </p>
    </TextGradientScrollContext.Provider>
  );
}

function normalizeTextToken(token: string) {
  return token.replace(/[^\w]/g, "").toLowerCase();
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
