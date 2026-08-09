"use client";

import Image from "next/image";
import {
  type MotionValue,
  motion,
  useMotionValueEvent,
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

function ResearchLegacyImage({
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
    <span className={`${className} group`} tabIndex={0} aria-label={name}>
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

const researchStoryStanzas = [
  "monarch is our family of thought-grounded models. most ai systems are built around tokens, breaking information into pieces and predicting what comes next. we believe intelligence begins earlier, with understanding.",
  "instead of reasoning through words alone, monarch forms and refines thought vectors that bring language, vision, audio, and memory into a shared understanding. it spends more time on difficult problems and less on simple ones, adapting its reasoning to the task at hand.",
  "our goal is to build intelligence that can connect ideas across domains, adapt to new situations, and reason from meaning rather than patterns.",
];

const researchCarouselSlides = [
  {
    code: "01",
    title: "could machines think?",
    caption: "the first question was not language. it was intelligence.",
    image: "/assets/research-hero/5.png",
  },
  {
    code: "02",
    title: "symbols gave us structure.",
    caption: "early systems proved that reasoning needs form.",
    image: "/assets/research-hero/12.png",
  },
  {
    code: "03",
    title: "learning made it move.",
    caption: "machines stopped only following rules and began adapting.",
    image: "/assets/research-hero/2.png",
  },
  {
    code: "04",
    title: "language became the surface.",
    caption: "fluency arrived before stable understanding.",
    image: "/assets/research/research-route-cutout-transparent.png",
  },
  {
    code: "05",
    title: "we begin before words.",
    caption: "monarch builds internal meaning first, then speaks.",
    image: "/assets/monarch.png",
  },
  {
    code: "06",
    title: "thinking becomes architecture.",
    caption: "the old question becomes memory, grounding, and control.",
    image: "/assets/tv.png",
  },
];

function getCarouselOffset(index: number, activeIndex: number) {
  const total = researchCarouselSlides.length;
  let offset = index - activeIndex;

  if (offset > total / 2) {
    offset -= total;
  }

  if (offset < total / -2) {
    offset += total;
  }

  return offset;
}

export default function ResearchRoutePage() {
  const scientistGalleryRef = useRef<HTMLDivElement>(null);
  const carouselScrollRef = useRef<HTMLElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [scientistView, setScientistView] = useState<"wall" | "legacy">("wall");
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: scientistGalleryRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: legacyScientistProgress } = useScroll({
    target: scientistGalleryRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: carouselProgress } = useScroll({
    target: carouselScrollRef,
    offset: ["start start", "end end"],
  });
  const { height } = dimension;
  const galleryY = useTransform(scrollYProgress, [0, 1], [0, height * 2]);
  const galleryY2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
  const galleryY3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
  const galleryY4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);
  const legacyScientistX = useTransform(
    legacyScientistProgress,
    [0, 1],
    ["0%", "-50%"],
  );

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

  useMotionValueEvent(carouselProgress, "change", (latest) => {
    const carousel = carouselScrollRef.current;

    if (carousel) {
      const { bottom, top } = carousel.getBoundingClientRect();

      if (top > window.innerHeight || bottom < 0) {
        return;
      }
    }

    const rawIndex = latest * (researchCarouselSlides.length - 1);
    const nextIndex = Math.min(
      researchCarouselSlides.length - 1,
      Math.max(0, Math.round(rawIndex)),
    );

    setActiveCarouselIndex((currentIndex) =>
      currentIndex === nextIndex ? currentIndex : nextIndex,
    );
  });

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

            <div
              className="relative z-10 w-full max-w-[40rem] overflow-hidden rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-[1px]"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.38)",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E\")",
                backgroundBlendMode: "overlay",
              }}
            >
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

          <section
            ref={carouselScrollRef}
            className="relative h-[205vh] w-screen max-w-none bg-[#fcf5ed]"
          >
            <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4">
              <div className="relative h-[32rem] w-full max-w-5xl sm:h-[38rem]">
                {researchCarouselSlides.map((slide, index) => {
                  const offset = getCarouselOffset(index, activeCarouselIndex);
                  const isCenter = offset === 0;
                  const isVisibleSide = Math.abs(offset) === 1;
                  const isVisible = isCenter || isVisibleSide;
                  const visibleOffset = Math.max(-1, Math.min(1, offset));
                  const direction = offset < 0 ? -1 : 1;

                  return (
                    <motion.article
                      key={slide.code}
                      className="absolute left-1/2 top-1/2 h-[25rem] w-[18rem] overflow-hidden rounded-[2rem] bg-[#ebe7dc] opacity-0 shadow-[0_24px_60px_rgba(0,0,0,0.12)] will-change-transform sm:h-[30rem] sm:w-[21rem]"
                      initial={false}
                      animate={{
                        x: isVisible
                          ? `calc(-50% + ${visibleOffset * 21.5}rem)`
                          : `calc(-50% + ${direction * 35}rem)`,
                        y: "-50%",
                        rotate: 0,
                        scale: isCenter ? 1 : isVisibleSide ? 0.88 : 0.84,
                        opacity: isVisible ? (isCenter ? 1 : 0.82) : 0,
                        filter: isCenter ? "blur(0px)" : "blur(2px)",
                      }}
                      transition={{ duration: 0.34, ease: [0.33, 1, 0.68, 1] }}
                      style={{
                        zIndex: isCenter ? 30 : isVisibleSide ? 20 : 0,
                      }}
                      aria-hidden={!isCenter}
                    >
                      <Image
                        src={slide.image}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 336px, 288px"
                        className="object-cover"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.01),rgba(0,0,0,0.045))]"
                      />
                      <div className="absolute inset-x-5 bottom-5 min-h-[6.2rem] rounded-[1.35rem] bg-[#e8dcc7]/92 px-5 py-4 text-black shadow-[0_12px_28px_rgba(70,48,24,0.16)] backdrop-blur-md sm:min-h-[6.6rem] sm:px-6 sm:py-5">
                        <p className="line-clamp-2 text-[1.48rem] font-normal leading-[0.95] sm:text-[1.68rem]">
                          {slide.title}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-black/58">
                          {slide.caption}
                        </p>
                      </div>
                    </motion.article>
                  );
                })}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fcf5ed] to-transparent sm:w-40" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#fcf5ed] to-transparent sm:w-40" />
              </div>
            </div>
          </section>

        </section>
      </main>
    </>
  );
}
