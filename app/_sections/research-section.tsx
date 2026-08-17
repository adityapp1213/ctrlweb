"use client";

import { ExpandableResearchGallery } from "@/components/ui/main/expandable-research-gallery";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";

const researchSectionImages = [
  {
    src: "/assets/research/1o1.svg",
    frames: Array.from(
      { length: 6 },
      (_, index) => `/assets/research/1o${index + 1}.svg`,
    ),
    frameOffsets: [
      { x: -1.4, y: 0.3 },
      { x: 0.7, y: 3.3 },
      { x: -1.8, y: -0.1 },
      { x: -2.4, y: -2.4 },
      { x: 0, y: 0.1 },
      { x: 3, y: -0.4 },
    ],
    alt: "ctrl horizontal gallery study one",
    code: "# 01",
    title: "monarch",
    href: "/blog/monarch",
  },
  {
    src: "/assets/research/2o1.svg",
    frames: Array.from(
      { length: 6 },
      (_, index) => `/assets/research/2o${index + 1}.svg`,
    ),
    frameOffsets: [
      { x: 3.6, y: 0.5 },
      { x: -0.2, y: 0.6 },
      { x: 0.2, y: 0.3 },
      { x: 4.4, y: -0.2 },
      { x: -0.5, y: -0.4 },
      { x: -0.7, y: -0.6 },
    ],
    alt: "ctrl horizontal gallery study two",
    code: "# 02",
    title: "interaction system",
    href: "/blog/interaction-systems",
  },
  {
    src: "/assets/research/4o1.svg",
    frames: Array.from(
      { length: 6 },
      (_, index) => `/assets/research/4o${index + 1}.svg`,
    ),
    frameOffsets: [
      { x: -0.5, y: -0.3 },
      { x: -1.2, y: 0.3 },
      { x: 2.3, y: -0.5 },
      { x: 3.1, y: -0.6 },
      { x: 0.1, y: 0.4 },
      { x: -0.1, y: 0.9 },
    ],
    alt: "ctrl horizontal gallery study three",
    code: "# 03",
    title: "godel model",
    href: "/blog/godel-model",
  },
  {
    src: "/assets/research/3o1.svg",
    frames: Array.from(
      { length: 6 },
      (_, index) => `/assets/research/3o${index + 1}.svg`,
    ),
    frameOffsets: [
      { x: 2.3, y: 0 },
      { x: -1.5, y: 0.1 },
      { x: -0.2, y: 2.8 },
      { x: 4.5, y: -1.2 },
      { x: -1.3, y: 0 },
      { x: -0.1, y: -0.8 },
    ],
    alt: "ctrl horizontal gallery study four",
    code: "# 04",
    title: "scaling synthetic data",
    href: "/blog/scaling-synthetic-data",
  },
];

export function ResearchSection() {
  return (
    <section
      id="research"
      className="relative z-10 scroll-mt-28 overflow-hidden bg-white px-4 pb-4 pt-2 sm:px-6 sm:pb-5 sm:pt-4 lg:pb-6 lg:pt-2"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12">
        <TextGradientScroll
          text="research at atom."
          textOpacity="medium"
          className="mx-auto max-w-3xl text-center text-4xl font-medium leading-none tracking-[-0.055em] text-black sm:text-5xl lg:text-6xl"
        />
        <ExpandableResearchGallery
          images={researchSectionImages}
          className="mx-auto"
        />
      </div>
    </section>
  );
}
