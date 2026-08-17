"use client";

import Image from "next/image";
import {
  type MotionValue,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import { RouteTopNav } from "@/components/route-top-nav";
import { ScrollProgressStory } from "@/components/ui/main/scroll-progress-story";

const researchHeroNotes = [
  "we study where current models lose continuity, memory, and grounding.",
  "our systems form meaning before language becomes the final surface.",
  "every research direction has to become architecture, data, or behavior.",
];

type ResearchScientistImage = {
  src: string;
  name: string;
};

const researchScientistColumns: ResearchScientistImage[][] = [
  [
    { src: "/assets/research-hero/4.png", name: "claude shannon" },
    { src: "/assets/research-hero/5.png", name: "alan turing" },
    { src: "/assets/research-hero/1.png", name: "john von neumann" },
    { src: "/assets/research-hero/2.png", name: "frank rosenblatt" },
    { src: "/assets/research-hero/12.png", name: "herbert simon" },
  ],
  [
    { src: "/assets/research-hero/2.png", name: "frank rosenblatt" },
    { src: "/assets/research-hero/12.png", name: "herbert simon" },
    { src: "/assets/research-hero/7.png", name: "john mccarthy" },
    { src: "/assets/research-hero/3.png", name: "kurt godel" },
    { src: "/assets/research-hero/6.png", name: "warren mcculloch" },
  ],
  [
    { src: "/assets/research-hero/3.png", name: "kurt godel" },
    { src: "/assets/research-hero/6.png", name: "warren mcculloch" },
    { src: "/assets/research-hero/9.png", name: "allen newell" },
    { src: "/assets/research-hero/11.png", name: "herbert simon" },
    { src: "/assets/research-hero/4.png", name: "claude shannon" },
  ],
  [
    { src: "/assets/research-hero/11.png", name: "herbert simon" },
    { src: "/assets/research-hero/1.png", name: "john von neumann" },
    { src: "/assets/research-hero/7.png", name: "john mccarthy" },
    { src: "/assets/research-hero/9.png", name: "allen newell" },
    { src: "/assets/research-hero/12.png", name: "herbert simon" },
  ],
];

function ResearchScientistColumn({
  images,
  y,
  className,
}: {
  images: ResearchScientistImage[];
  y: MotionValue<number>;
  className: string;
}) {
  return (
    <motion.div
      className={`relative flex h-full w-1/4 min-w-[250px] flex-col gap-[2vw] ${className}`}
      style={{ y }}
    >
      {images.map((image, index) => (
        <figure
          key={`${image.src}-${image.name}-${index}`}
          className="group relative h-full w-full overflow-hidden rounded-md bg-[#f7f5ef]"
          tabIndex={0}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- Mirrors the source parallax component: a plain image avoids extra wrappers in the moving columns. */}
          <img
            src={image.src}
            alt={`${image.name} archival photograph`}
            draggable={false}
            className="pointer-events-none h-full w-full object-cover object-center"
          />
          <figcaption className="pointer-events-none absolute bottom-2 left-2 z-10 rounded bg-white/90 px-2.5 py-1.5 text-[0.68rem] leading-none text-black opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            {image.name}
          </figcaption>
        </figure>
      ))}
    </motion.div>
  );
}

const researchStoryStanzas = [
  "monarch is our family of thought-grounded models. most ai systems are built around tokens, breaking information into pieces and predicting what comes next. we believe intelligence begins earlier, with understanding.",
  "instead of reasoning through words alone, monarch forms and refines thought vectors that bring language, vision, audio, and memory into a shared understanding. it spends more time on difficult problems and less on simple ones, adapting its reasoning to the task at hand.",
  "our goal is to build intelligence that can connect ideas across domains, adapt to new situations, and reason from meaning rather than patterns.",
];

export default function ResearchRoutePage() {
  const scientistGalleryRef = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const { scrollYProgress } = useScroll({
    target: scientistGalleryRef,
    offset: ["start end", "end start"],
  });
  const { height } = dimension;
  const galleryY = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const galleryY2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const galleryY3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const galleryY4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

  useEffect(() => {
    const lenis = new Lenis();
    let animationFrameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    resize();
    animationFrameId = requestAnimationFrame(raf);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <RouteTopNav />
      <main className="min-h-screen bg-[#fcf5ed] pb-12 text-black">
        <section className="relative mx-auto flex w-full max-w-none flex-col items-center justify-start gap-0">
          <section className="relative flex h-[92vh] w-screen flex-col items-center justify-start overflow-hidden bg-[#fcf5ed] px-5 pt-24 text-center sm:px-8 sm:pt-28 lg:px-10">
            <Image
              src="/assets/research-clouds/1.4.png"
              alt=""
              fill
              sizes="100vw"
              className="pointer-events-none object-cover object-center"
              aria-hidden="true"
            />

            <div className="relative z-10 w-full max-w-[40rem]">
              <Image
                src="/assets/research/research-route-cutout-transparent.png"
                alt="collage of walking figures overlaid with animal studies"
                width={691}
                height={361}
                priority
                className="h-auto w-full"
              />
            </div>

            <div className="relative z-10 mx-auto mt-7 flex w-full max-w-5xl flex-col items-center text-center">
              <h1 className="max-w-md text-center text-[1.9rem] font-normal leading-[0.98] text-black sm:text-[2.1rem] lg:text-[2.25rem]">
                world thinking machines.
              </h1>
              <div className="mt-6 grid w-full max-w-[52rem] gap-4 text-left sm:grid-cols-3 sm:gap-10">
                {researchHeroNotes.map((note) => (
                  <p
                    key={note}
                    className="text-[1rem] leading-6 text-black/78 sm:text-[1.08rem] sm:leading-7"
                  >
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section
            ref={scientistGalleryRef}
            className="relative box-border flex h-[175vh] w-screen gap-[2vw] overflow-hidden bg-[#fcf5ed] p-[2vw]"
          >
            <ResearchScientistColumn
              images={researchScientistColumns[0]}
              y={galleryY}
              className="-top-[45%]"
            />
            <ResearchScientistColumn
              images={researchScientistColumns[1]}
              y={galleryY2}
              className="-top-[95%]"
            />
            <ResearchScientistColumn
              images={researchScientistColumns[2]}
              y={galleryY3}
              className="-top-[45%]"
            />
            <ResearchScientistColumn
              images={researchScientistColumns[3]}
              y={galleryY4}
              className="-top-[75%]"
            />
          </section>

          <section className="relative w-screen max-w-none overflow-hidden bg-[#fcf5ed] px-4 py-8 sm:px-6 sm:py-10">
            <Image
              src="/assets/research-clouds/2.png"
              alt=""
              fill
              sizes="100vw"
              className="pointer-events-none object-cover"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <ScrollProgressStory stanzas={researchStoryStanzas} />
            </div>
          </section>

        </section>
      </main>
    </>
  );
}
