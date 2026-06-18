"use client";

import Image from "next/image";
import NumberFlow from "@number-flow/react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import type { BlogArticle } from "@/lib/blog-article";
import { BlogBody } from "./blog-body";
import { BlogToc } from "./blog-toc";

export function BlogContent({
  article,
  heroImageAlt,
  heroImageSrc,
  plainTitle,
}: {
  article: BlogArticle;
  heroImageAlt: string;
  heroImageSrc: string;
  plainTitle: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const articleTrackRef = useRef<HTMLDivElement>(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const { scrollYProgress: loaderProgress } = useScroll({
    target: sectionRef,
    offset: ["start 92%", "end 12%"],
  });

  const { scrollYProgress: articleProgress } = useScroll({
    target: articleTrackRef,
    offset: ["start 98%", "end 20%"],
  });

  const clampedLoaderProgress = useTransform(loaderProgress, (value) =>
    Math.min(Math.max(value, 0), 1),
  );
  const clampedArticleProgress = useTransform(articleProgress, (value) =>
    Math.min(Math.max(value, 0), 1),
  );
  const progressAsPercent = useTransform(clampedLoaderProgress, (value) =>
    Math.round(value * 100),
  );

  useMotionValueEvent(progressAsPercent, "change", (value) => {
    setProgressPercent(value);
  });
  const smoothProgress = useSpring(clampedLoaderProgress, {
    damping: 28,
    stiffness: 110,
    mass: 0.75,
  });
  const loaderOpacity = useTransform(
    clampedLoaderProgress,
    [0, 0.035, 0.965, 1],
    [0, 1, 1, 0],
  );
  const smoothLoaderOpacity = useSpring(loaderOpacity, {
    damping: 30,
    stiffness: 120,
    mass: 0.7,
  });

  const svgRadius = 18;
  const circumference = 2 * Math.PI * svgRadius;

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto w-full max-w-[1600px] px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24 lg:pr-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mx-auto max-w-4xl text-4xl font-medium leading-[1.14] tracking-[-0.04em] text-black sm:text-5xl lg:text-6xl">
          {plainTitle}
        </h1>
        <div className="mt-7 flex flex-col items-center gap-2 text-[1.02rem] leading-7 text-black/64">
          {article.heroMeta.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-[1.25rem]">
        <Image
          src={heroImageSrc}
          alt={heroImageAlt}
          width={1600}
          height={900}
          priority
          className="aspect-[16/8.8] w-full object-cover"
        />
      </div>

      <div
        ref={articleTrackRef}
        className="relative mt-12 lg:grid lg:grid-cols-[220px_minmax(0,760px)_220px] lg:gap-16"
      >
        <motion.div
          style={{ opacity: smoothLoaderOpacity }}
          className="group fixed bottom-6 right-6 z-30 hidden items-center gap-1 lg:flex"
        >
          <NumberFlow
            value={progressPercent}
            className="text-foreground/20 absolute top-1 flex h-8 -translate-y-full items-center justify-center px-4 text-xs font-medium tabular-nums opacity-0 group-hover:opacity-100"
            suffix="%"
          />
          <div className="bg-background/85 flex size-12 items-center justify-center rounded-2xl border border-black/12 backdrop-blur-md">
            <svg className="size-10" viewBox="0 0 48 48" role="presentation">
              <circle
                cx="24"
                cy="24"
                r={svgRadius}
                stroke="currentColor"
                strokeWidth="3"
                className="opacity-30"
                fill="none"
              />
              <motion.circle
                cx="24"
                cy="24"
                r={svgRadius}
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                style={{
                  pathLength: smoothProgress,
                  rotate: -90,
                  transformOrigin: "50% 50%",
                }}
              />
            </svg>
          </div>
        </motion.div>

        <aside className="hidden lg:block">
          <BlogToc items={article.toc} />
        </aside>

        <article className="min-w-0">
          <BlogBody
            bodyHtml={`<p>${article.ledeHtml}</p>${article.bodyHtml}`}
            references={article.references}
            progress={clampedArticleProgress}
            progressRange={[0, 1]}
          />
        </article>

        <div className="hidden lg:block" aria-hidden="true" />
      </div>
    </section>
  );
}
