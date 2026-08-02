"use client";

import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { RouteTopNav } from "@/components/route-top-nav";
import { ExpandableResearchGallery } from "@/components/ui/main/expandable-research-gallery";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";

const section5Images = [
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
    alt: "Ctrl horizontal gallery study one",
    code: "# 01",
    title: "Monarch",
    href: "/monarch",
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
    alt: "Ctrl horizontal gallery study two",
    code: "# 02",
    title: "Interaction system",
    href: "/interaction-systems",
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
    alt: "Ctrl horizontal gallery study three",
    code: "# 03",
    title: "Godel model",
    href: "/godel-model",
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
    alt: "Ctrl horizontal gallery study four",
    code: "# 04",
    title: "Scaling synthetic data",
    href: "/scaling-synthetic-data",
  },
];

const thinkingMachineStories = [
  {
    number: "01",
    title: "Beyond language",
    description:
      "Text is not the world. Our models are built to reason across images, actions, memory, and state.",
    image: "/assets/research-3/11.png",
    imageAlt: "Soft colored points dispersed across a white field",
  },
  {
    number: "02",
    title: "Embedded intelligence",
    description:
      "A thinking machine needs a world model: what exists, what changes, what matters, and what comes next.",
    image: "/assets/research-3/2.png",
    imageAlt: "Soft colored points beginning to organize across a white field",
  },
  {
    number: "03",
    title: "Built to reason",
    description:
      "We are moving from fluent outputs to systems that can think, plan, adapt, and act with continuity.",
    image: "/assets/research-3/3.png",
    imageAlt: "Soft colored points gathered into a loose diagonal field",
  },
];

function ResearchHeroImage({
  src,
  name,
  sizes,
  className,
  imageClassName,
}: {
  src: string;
  name: string;
  sizes: string;
  className: string;
  imageClassName: string;
}) {
  return (
    <span
      className={`${className} group`}
      tabIndex={0}
      aria-label={name}
    >
      <Image
        src={src}
        alt={`${name} archival photograph`}
        fill
        sizes={sizes}
        className={imageClassName}
      />
      <span className="pointer-events-none absolute bottom-2 left-2 z-10 rounded bg-white/85 px-2 py-1 text-[10px] font-medium leading-none text-black opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
        {name}
      </span>
    </span>
  );
}

function ThinkingMachinesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextIndex = Math.min(
      thinkingMachineStories.length - 1,
      Math.max(0, Math.floor(latest * thinkingMachineStories.length)),
    );
    setActiveStoryIndex(nextIndex);
  });

  return (
    <section
      ref={sectionRef}
      className="relative w-screen max-w-none bg-[#eee8df] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[24rem_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="flex flex-col gap-12 pt-8 lg:pt-24">
            {thinkingMachineStories.map((story, index) => (
              <article
                key={story.number}
                className="relative min-h-[5.75rem] pl-7"
              >
                <span
                  className={[
                    "absolute left-0 top-2 w-[3px] rounded-full transition-[height,background-color] duration-300",
                    index === activeStoryIndex ? "bg-black" : "bg-black/12",
                    index === activeStoryIndex ? "h-[9.75rem]" : "h-[4.5rem]",
                  ].join(" ")}
                />
                <p className="mb-4 text-xs leading-none text-black/35">
                  {story.number}
                </p>
                <h3
                  className={[
                    "text-2xl font-normal leading-none sm:text-3xl",
                    index === activeStoryIndex ? "text-black" : "text-black/45",
                  ].join(" ")}
                >
                  {story.title}
                </h3>
                <div
                  className={[
                    "grid transition-[grid-template-rows,opacity] duration-300",
                    index === activeStoryIndex
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <p className="mt-4 max-w-xs overflow-hidden text-sm leading-6 text-black/65">
                    {story.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-10 lg:gap-12">
          {thinkingMachineStories.map((story) => (
            <figure
              key={story.image}
              className="relative overflow-hidden rounded-2xl bg-white shadow-[0_18px_60px_rgba(0,0,0,0.08)]"
            >
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 760px, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResearchSection() {
  return (
    <section
      id="research"
      className="relative z-10 scroll-mt-28 overflow-hidden bg-white px-4 pb-4 pt-2 sm:px-6 sm:pb-5 sm:pt-4 lg:pb-6 lg:pt-2"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12">
        <TextGradientScroll
          text="Research at atom."
          textOpacity="medium"
          className="mx-auto max-w-3xl text-center text-4xl font-medium leading-none tracking-[-0.055em] text-black sm:text-5xl lg:text-6xl"
        />
        <ExpandableResearchGallery images={section5Images} className="mx-auto" />
      </div>
    </section>
  );
}

export default function ResearchPage() {
  const horizontalScrollRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: horizontalScrollRef,
    offset: ["start start", "end end"],
  });
  const horizontalX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <>
      <RouteTopNav />
      <main className="min-h-screen bg-[#eee8df] px-5 pb-12 pt-20 text-black sm:px-8 lg:px-10">
        <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl flex-col items-center justify-start gap-6 pt-10 sm:pt-12">
          <div className="relative w-full max-w-[34rem] overflow-visible">
            <Image
              src="/assets/research/research-route-cutout.png"
              alt="Collage of walking figures overlaid with animal studies"
              width={691}
              height={361}
              priority
              className="h-auto w-full object-contain"
            />
          </div>

          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <p className="mb-2 text-xs leading-5 text-black/45">
              Research at Atom Ctrl
            </p>
            <h1 className="max-w-xl text-center text-2xl font-normal leading-none text-black sm:text-3xl lg:text-4xl">
              World thinking machines.
            </h1>
          </div>

          <section
            ref={horizontalScrollRef}
            className="relative mt-20 h-[190vh] w-screen max-w-none sm:mt-24"
          >
            <div className="sticky top-24 flex h-[calc(100vh-6rem)] w-screen items-center overflow-hidden">
              <motion.div
                className="relative left-1/2 flex h-[30rem] w-[160rem] shrink-0 -translate-x-[37rem] items-start sm:h-[38rem] sm:w-[178rem] sm:-translate-x-[41.5rem] lg:h-[42rem]"
                style={{ x: horizontalX }}
              >
                <div
                  className="grid h-full w-[80rem] shrink-0 translate-x-10 grid-cols-[17rem_34rem_17rem] items-start gap-6 sm:w-[89rem] sm:translate-x-12 sm:grid-cols-[19rem_40rem_18rem] sm:gap-6"
                >
                    <div className="mt-[4.5rem] flex flex-col gap-7 sm:mt-[5rem] sm:gap-9">
                      <ResearchHeroImage
                        src="/assets/research-hero/4.png"
                        name="Claude Shannon"
                        sizes="304px"
                        className="relative h-48 w-full overflow-hidden rounded-lg sm:h-56"
                        imageClassName="object-cover object-center grayscale contrast-[.92]"
                      />
                      <ResearchHeroImage
                        src="/assets/research-hero/5.png"
                        name="Alan Turing"
                        sizes="304px"
                        className="relative h-64 w-[92%] overflow-hidden rounded-lg sm:h-80"
                        imageClassName="object-cover object-center grayscale contrast-[.92]"
                      />
                    </div>

                    <ResearchHeroImage
                      src="/assets/research-hero/2.png"
                      name="Frank Rosenblatt"
                      sizes="640px"
                      className="relative mt-[2.5rem] h-64 w-full overflow-hidden rounded-lg sm:mt-[3rem] sm:h-[29rem]"
                      imageClassName="object-cover object-center grayscale contrast-[.96]"
                    />

                    <div className="mt-[6.5rem] flex flex-col gap-7 sm:mt-[7rem] sm:gap-9">
                      <ResearchHeroImage
                        src="/assets/research-hero/3.png"
                        name="Kurt Gödel"
                        sizes="320px"
                        className="relative h-28 w-[92%] overflow-hidden rounded-lg sm:h-32"
                        imageClassName="object-cover object-[72%_center] grayscale contrast-[.92]"
                      />
                      <ResearchHeroImage
                        src="/assets/research-hero/6.png"
                        name="Warren Sturgis McCulloch"
                        sizes="320px"
                        className="relative h-64 w-full overflow-hidden rounded-lg sm:h-[21rem]"
                        imageClassName="object-cover object-[54%_center] grayscale contrast-[.92]"
                      />
                    </div>
                </div>

                <div
                  className="grid h-full w-[80rem] shrink-0 grid-cols-[17rem_34rem_17rem] items-start gap-6 sm:w-[89rem] sm:grid-cols-[19rem_40rem_18rem] sm:gap-6"
                >
                    <div className="mt-[4.5rem] flex flex-col gap-7 sm:mt-[5rem] sm:gap-9">
                      <ResearchHeroImage
                        src="/assets/research-hero/1.png"
                        name="John von Neumann"
                        sizes="304px"
                        className="relative h-48 w-full overflow-hidden rounded-lg sm:h-56"
                        imageClassName="object-cover object-center grayscale contrast-[.92]"
                      />
                      <ResearchHeroImage
                        src="/assets/research-hero/7.png"
                        name="John McCarthy"
                        sizes="304px"
                        className="relative h-64 w-[92%] overflow-hidden rounded-lg sm:h-80"
                        imageClassName="object-cover object-center grayscale contrast-[.92]"
                      />
                    </div>

                    <ResearchHeroImage
                      src="/assets/research-hero/12.png"
                      name="Herbert Simon"
                      sizes="640px"
                      className="relative mt-[2.5rem] h-64 w-full overflow-hidden rounded-lg sm:mt-[3rem] sm:h-[29rem]"
                      imageClassName="object-cover object-center grayscale contrast-[.96]"
                    />

                    <div className="mt-[6.5rem] flex flex-col gap-7 sm:mt-[7rem] sm:gap-9">
                      <ResearchHeroImage
                        src="/assets/research-hero/9.png"
                        name="Allen Newell"
                        sizes="320px"
                        className="relative h-28 w-[92%] overflow-hidden rounded-lg sm:h-32"
                        imageClassName="object-cover object-center grayscale contrast-[.92]"
                      />
                      <ResearchHeroImage
                        src="/assets/research-hero/11.png"
                        name="Herbert Simon"
                        sizes="320px"
                        className="relative h-64 w-full overflow-hidden rounded-lg sm:h-[21rem]"
                        imageClassName="object-cover object-center grayscale contrast-[.92]"
                      />
                    </div>
                </div>
              </motion.div>
            </div>
          </section>

          <ThinkingMachinesSection />

          <section className="relative mt-24 w-screen max-w-none px-5 pb-24 sm:mt-32 sm:px-8">
            <div className="relative mx-auto aspect-[16/8] w-full max-w-5xl overflow-hidden rounded-2xl bg-black/5">
              <Image
                src="/assets/research/research-route-hero.png"
                alt="Research archive image"
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover grayscale"
              />
            </div>
          </section>
        </section>
      </main>
    </>
  );
}
