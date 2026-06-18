"use client";

import { useState } from "react";
import { HoverExpand_002 } from "@/components/ui/skiper-ui/skiper53";

const section3Images = [
  {
    src: "/assets/tv.png",
    alt: "Ctrl visual study one",
    code: "# 01",
    eyebrow: "Thought vectors",
    title: "A thought is formed before an answer is written.",
    description:
      "Monarch first binds raw input into a structured thought vector. The thought can hold visual, linguistic, abstract, emotional, and relational meaning at the same time.",
    detail:
      "The vector is refined over several steps until it stabilizes, so the system is reasoning from meaning rather than only predicting the next word.",
  },
  {
    src: "/assets/multimodal.png",
    alt: "Ctrl visual study two",
    code: "# 02",
    eyebrow: "Multimodal input",
    title: "Different inputs enter the same space.",
    description:
      "Text, images, audio, video, code, and structured data are projected into one shared vector space. No input type is treated as the main one.",
    detail:
      "This lets Monarch form one combined understanding from many signals, instead of stitching together separate text and image interpretations later.",
  },
  {
    src: "/assets/ps.png",
    alt: "Ctrl visual study three",
    code: "# 03",
    eyebrow: "Persistent self",
    title: "It keeps a model of what it is doing.",
    description:
      "Monarch keeps a persistent self vector that tracks capability, context, performance, and state. It uses that self-state to query memory and guide the next step.",
    detail:
      "This is not consciousness in a human sense. It is a practical self-model that helps the system know what it can do, how well it is doing, and when it should adjust.",
  },
  {
    src: "/assets/rs.png",
    alt: "Ctrl visual study four",
    code: "# 04",
    eyebrow: "Reasoning signals",
    title: "It spends more effort when the problem needs it.",
    description:
      "Monarch classifies the problem, selects the most relevant specialists, and runs reasoning passes until the answer is good enough to stop.",
    detail:
      "Priority signals like novelty, risk, social context, and uncertainty can change how cautious the reasoning is and how much compute the problem receives.",
  },
  {
    src: "/assets/ms.png",
    alt: "Ctrl visual study five",
    code: "# 05",
    eyebrow: "Layered memory",
    title: "It remembers across different time scales.",
    description:
      "Monarch separates the current moment, the active conversation, recent episodes, long-term knowledge, and its own self-state into different memory layers.",
    detail:
      "That structure lets it remember like a system with short-term, episodic, and semantic memory, instead of treating every interaction as a blank start.",
  },
];

export function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(1);
  const activeFeature = section3Images[activeIndex];

  return (
    <section
      id="features"
      className="relative z-10 scroll-mt-28 bg-white px-0 pb-10 pt-0 sm:px-6 sm:pb-12 sm:pt-2 lg:pb-14"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center justify-items-center gap-8 lg:grid-cols-[1fr_minmax(24rem,32rem)_1fr] lg:justify-items-stretch">
        <div className="hidden min-h-[24rem] items-center lg:flex">
          <div className="max-w-xs">
            <p className="text-xs uppercase tracking-[0.28em] text-black/35">
              {activeFeature.eyebrow}
            </p>
            <h2 className="mt-5 text-4xl font-medium leading-[0.98] tracking-[-0.045em] text-black">
              {activeFeature.title}
            </h2>
          </div>
        </div>

        <HoverExpand_002
          images={section3Images}
          activeIndex={activeIndex}
          onActiveChange={setActiveIndex}
          className="mx-auto"
        />

        <div className="hidden min-h-[24rem] items-center justify-end lg:flex">
          <div className="max-w-sm">
            <p className="text-xl leading-relaxed tracking-[-0.02em] text-black/62">
              {activeFeature.description}
            </p>
            <p className="mt-6 border-t border-black/10 pt-6 text-sm leading-relaxed text-black/45">
              {activeFeature.detail}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function FeaturesPage() {
  return <FeaturesSection />;
}
