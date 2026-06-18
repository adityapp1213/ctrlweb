"use client";

import { HoverExpand_001 } from "@/components/ui/skiper-ui/skiper52";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";

const section5Images = [
  {
    src: "/assets/ma1.svg",
    alt: "Ctrl horizontal gallery study one",
    code: "# 01",
    title: "Monarch",
    href: "/monarch",
  },
  {
    src: "/assets/is1.svg",
    alt: "Ctrl horizontal gallery study two",
    code: "# 02",
    title: "Interaction system",
    href: "/interaction-systems",
  },
  {
    src: "/assets/gm1.svg",
    alt: "Ctrl horizontal gallery study three",
    code: "# 03",
    title: "Godel model",
    href: "/godel-model",
  },
  {
    src: "/assets/scl.svg",
    alt: "Ctrl horizontal gallery study four",
    code: "# 04",
    title: "Scaling synthetic data",
    href: "/scaling-synthetic-data",
  },
];

export function ResearchSection() {
  return (
    <section
      id="research"
      className="relative z-10 scroll-mt-28 overflow-hidden bg-white px-4 pb-12 pt-2 sm:px-6 sm:pt-4 lg:pb-14 lg:pt-2"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12">
        <TextGradientScroll
          text="Research at atom."
          textOpacity="medium"
          className="mx-auto max-w-3xl text-center text-4xl font-medium leading-none tracking-[-0.055em] text-black sm:text-5xl lg:text-6xl"
        />
        <HoverExpand_001 images={section5Images} className="mx-auto" />
      </div>
    </section>
  );
}

export default function ResearchPage() {
  return <ResearchSection />;
}
