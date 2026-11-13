import Image from "next/image";
import type { BlogArticle } from "@/lib/blog-article";
import { BlogBody } from "./blog-body";
import { BlogReadingProgress } from "./blog-reading-progress";
import { BlogToc } from "./blog-toc";

export function BlogContent({
  article,
  heroImageAlt,
  heroImageSrc,
  plainTitle,
  heroMetaClassName,
  highlights,
}: {
  article: BlogArticle;
  heroImageAlt: string;
  heroImageSrc: string;
  plainTitle: string;
  heroMetaClassName?: string;
  highlights?: Array<{
    title: string;
    description: string;
    tone: "rose" | "blue" | "teal" | "amber";
  }>;
}) {
  const isSvgHero = heroImageSrc.toLowerCase().endsWith(".svg");

  return (
    <section
      id="research-article"
      className="simple-blog-content relative mx-auto w-full px-4 pb-16 sm:px-6 lg:px-0 lg:pb-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mx-auto max-w-4xl text-4xl font-medium leading-[1.14] tracking-[-0.04em] text-black sm:text-5xl lg:text-6xl">
          {plainTitle}
        </h1>
        <div className={`simple-blog-hero-meta${heroMetaClassName ? ` ${heroMetaClassName}` : ""}`}>
          {article.heroMeta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-[1.25rem]">
        <Image
          src={heroImageSrc}
          alt={heroImageAlt}
          width={1600}
          height={900}
          preload
          sizes="(max-width: 700px) calc(100vw - 2.5rem), 700px"
          className={`aspect-[16/8.8] w-full object-cover ${
            isSvgHero ? "grayscale saturate-0 contrast-110" : ""
          }`}
        />
      </div>

      {highlights?.length ? (
        <div className="mx-auto mt-6 grid max-w-4xl gap-px overflow-hidden rounded-[1.1rem] border border-black/[0.07] bg-black/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight) => (
            <div
              key={highlight.title}
              className="group min-h-40 bg-white px-5 py-5 transition-colors duration-300 hover:bg-[#fbfaf8]"
            >
              <span
                aria-hidden="true"
                className={`mb-6 block size-2 rounded-full ${
                  highlight.tone === "rose"
                    ? "bg-black/65"
                    : highlight.tone === "blue"
                      ? "bg-black/50"
                      : highlight.tone === "teal"
                        ? "bg-black/40"
                        : "bg-black/55"
                }`}
              />
              <h2 className="text-[1.05rem] font-medium leading-tight tracking-[-0.02em] text-black">
                {highlight.title}
              </h2>
              <p className="mt-2 text-[0.84rem] leading-[1.55] text-black/55">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="relative mt-12 lg:grid lg:gap-16">
        <BlogReadingProgress />

        <article className="min-w-0">
          <BlogBody
            bodyHtml={`<p>${article.ledeHtml}</p>${article.bodyHtml}`}
            references={article.references}
          />
        </article>

        <aside className="hidden lg:block">
          <BlogToc items={article.toc} />
        </aside>
      </div>
    </section>
  );
}
