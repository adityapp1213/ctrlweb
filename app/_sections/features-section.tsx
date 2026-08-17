"use client";

import Image from "next/image";
import { useState } from "react";
import { StackedFeatureGallery } from "@/components/ui/main/stacked-feature-gallery";

const section3Images = [
  {
    src: "/assets/tv.png",
    alt: "ctrl visual study one",
    code: "# 01",
    eyebrow: "thought vectors",
    title: "a thought is formed before an answer is written.",
    description:
      "monarch first binds raw input into a structured thought vector. the thought can hold visual, linguistic, abstract, emotional, and relational meaning at the same time.",
    detail:
      "the vector is refined over several steps until it stabilizes, so the system is reasoning from meaning rather than only predicting the next word.",
  },
  {
    src: "/assets/multimodal.png",
    alt: "ctrl visual study two",
    code: "# 02",
    eyebrow: "multimodal input",
    title: "different inputs enter the same space.",
    description:
      "text, images, audio, video, code, and structured data are projected into one shared vector space. no input type is treated as the main one.",
    detail:
      "this lets monarch form one combined understanding from many signals, instead of stitching together separate text and image interpretations later.",
  },
  {
    src: "/assets/ps.png",
    alt: "ctrl visual study three",
    code: "# 03",
    eyebrow: "persistent self",
    title: "it keeps a model of what it is doing.",
    description:
      "monarch keeps a persistent self vector that tracks capability, context, performance, and state. it uses that self-state to query memory and guide the next step.",
    detail:
      "this is not consciousness in a human sense. it is a practical self-model that helps the system know what it can do, how well it is doing, and when it should adjust.",
  },
  {
    src: "/assets/rs.png",
    alt: "ctrl visual study four",
    code: "# 04",
    eyebrow: "reasoning signals",
    title: "it spends more effort when the problem needs it.",
    description:
      "monarch classifies the problem, selects the most relevant specialists, and runs reasoning passes until the answer is good enough to stop.",
    detail:
      "priority signals like novelty, risk, social context, and uncertainty can change how cautious the reasoning is and how much compute the problem receives.",
  },
  {
    src: "/assets/ms.png",
    alt: "ctrl visual study five",
    code: "# 05",
    eyebrow: "layered memory",
    title: "it remembers across different time scales.",
    description:
      "monarch separates the current moment, the active conversation, recent episodes, long-term knowledge, and its own self-state into different memory layers.",
    detail:
      "that structure lets it remember like a system with short-term, episodic, and semantic memory, instead of treating every interaction as a blank start.",
  },
];

export function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(1);
  const activeFeature = section3Images[activeIndex];

  return (
    <section
      id="features"
      className="relative z-10 scroll-mt-28 overflow-hidden bg-white px-0 pb-10 pt-0 sm:px-6 sm:pb-12 sm:pt-2 lg:pb-14"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[64rem] sm:hidden"
        aria-hidden="true"
      >
        <Image
          src="/assets/cloud3.1.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden h-[54rem] sm:block lg:h-[38rem]"
        aria-hidden="true"
      >
        <Image
          src="/assets/cloud4.1.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center justify-items-center gap-8 lg:grid-cols-[1fr_minmax(24rem,32rem)_1fr] lg:justify-items-stretch">
        <div className="hidden min-h-[24rem] items-center lg:flex">
          <div className="max-w-xs">
            <p className="text-xs tracking-[0.28em] text-black/35">
              {activeFeature.eyebrow}
            </p>
            <h2 className="mt-5 text-4xl font-medium leading-[0.98] tracking-[-0.045em] text-black">
              {activeFeature.title}
            </h2>
          </div>
        </div>

        <StackedFeatureGallery
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
