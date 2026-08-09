"use client";

import {
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";

const defaultStanzas = [
  "monarch is our family of thought-grounded models. most ai systems are built around tokens, breaking information into pieces and predicting what comes next. we believe intelligence begins earlier, with understanding.",
  "instead of reasoning through words alone, monarch forms and refines thought vectors that bring language, vision, audio, and memory into a shared understanding. it spends more time on difficult problems and less on simple ones, adapting its reasoning to the task at hand.",
  "our goal is to build intelligence that can connect ideas across domains, adapt to new situations, and reason from meaning rather than patterns.",
];

const ScrollProgressStory = ({
  stanzas = defaultStanzas,
  dottedWords = { monarch: "/research" },
  dottedPhrases,
}: {
  stanzas?: string[];
  dottedWords?: Record<string, string>;
  dottedPhrases?: Record<string, string>;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
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
  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-10 pt-14 text-center sm:px-6 sm:pb-12 sm:pt-18",
      )}
    >
      <div ref={contentRef} className="grid w-full justify-items-center gap-5 sm:gap-6">
        {stanzas.map((stanza, index) => (
          <TextGradientScroll
            key={stanza}
            text={stanza}
            progress={clampedProgress}
            range={[index / stanzas.length, (index + 1) / stanzas.length]}
            dottedWords={dottedWords}
            dottedPhrases={dottedPhrases}
            textOpacity="medium"
            className="mx-auto w-full max-w-[700px] px-5 py-2 text-justify font-sans text-2xl leading-snug text-black sm:px-4 sm:py-2.5"
          />
        ))}
      </div>
    </div>
  );
};

export { ScrollProgressStory };
