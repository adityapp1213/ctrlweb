import type { Metadata } from "next";
import { Blog } from "@/components/blog/blog";
import { getBlogArticle } from "@/lib/blog-article";
import { createArticleMetadata, type ArticleSeo } from "@/lib/seo";

type BlogConfig = {
  sourceFile: string;
  heroImageAlt: string;
  heroImageSrc: string;
  seo: ArticleSeo;
  highlights?: Array<{
    title: string;
    description: string;
    tone: "rose" | "blue" | "teal" | "amber";
  }>;
};

export const blogArticles = {
  monarch: {
    sourceFile: "monarch-source.html",
    heroImageSrc: "/assets/monarch.png",
    heroImageAlt: "monarch model overview",
    seo: {
      path: "/blog/monarch",
      title: "monarch: thought-grounded multimodal intelligence",
      description:
        "monarch is atom ctrl's architecture for turning multimodal experience into structured thought, memory, specialist processing, reasoning, and output.",
      image: "/opengraph-image",
      datePublished: "2026-07-03",
      dateModified: "2026-07-04",
      keywords: [
        "monarch",
        "thought-grounded multimodal intelligence",
        "thoughtvector",
        "persistent ai memory",
        "specialist reasoning",
      ],
    },
    highlights: [
      {
        title: "multi-modal",
        description:
          "text, images, audio, video, and documents enter one shared semantic space.",
        tone: "rose",
      },
      {
        title: "thought formation",
        description:
          "raw experience becomes a structured thoughtvector before reasoning begins.",
        tone: "blue",
      },
      {
        title: "persistent memory",
        description:
          "semantic knowledge and prior episodes stay available across interactions.",
        tone: "teal",
      },
      {
        title: "specialist reasoning",
        description:
          "learned experts contribute context before a fixed-depth reasoning pass.",
        tone: "amber",
      },
    ],
  },
  "interaction-systems": {
    sourceFile: "interaction-systems-source.html",
    heroImageSrc: "/assets/is1.svg",
    heroImageAlt: "interaction systems timing overview",
    seo: {
      path: "/blog/interaction-systems",
      title: "interaction systems: how voice becomes a real conversation",
      description:
        "atom ctrl's interaction architecture preserves turn state, forms partial understanding early, and begins shaping a response while a conversation is still active.",
      image: "/opengraph-image",
      datePublished: "2026-05-30",
      dateModified: "2026-07-04",
      keywords: [
        "voice interaction systems",
        "streaming speech ai",
        "turn state",
        "real-time ai conversation",
        "voice architecture",
      ],
    },
  },
  "godel-model": {
    sourceFile: "godel-source.html",
    heroImageSrc: "/assets/gm1.svg",
    heroImageAlt: "godel 1.6 local-cloud architecture overview",
    seo: {
      path: "/blog/godel-model",
      title: "godel 1.6: a hybrid local-cloud llm architecture",
      description:
        "godel 1.6 is an atom ctrl architecture that handles routine work locally and routes complex tasks to cloud specialists only when required.",
      image: "/opengraph-image",
      datePublished: "2025-08-20",
      dateModified: "2026-07-04",
      keywords: [
        "godel 1.6",
        "hybrid local-cloud ai",
        "local language model",
        "ai routing architecture",
        "private ai",
      ],
    },
  },
  "scaling-synthetic-data": {
    sourceFile: "scaling-source.html",
    heroImageSrc: "/assets/scl.svg",
    heroImageAlt: "scaling synthetic data overview",
    seo: {
      path: "/blog/scaling-synthetic-data",
      title: "scaling synthetic data",
      description:
        "atom ctrl explores using llama-3 to turn raw web text into cleaner, structured synthetic training data for compact language models.",
      image: "/opengraph-image",
      datePublished: "2025-07-28",
      dateModified: "2026-07-04",
      keywords: [
        "synthetic training data",
        "llama-3 rephrasing",
        "compact language models",
        "data quality",
        "ai pretraining",
      ],
    },
  },
} satisfies Record<string, BlogConfig>;

export type BlogSlug = keyof typeof blogArticles;

export function getBlogSlugs() {
  return Object.keys(blogArticles) as BlogSlug[];
}

export function getBlogConfig(slug: string) {
  return blogArticles[slug as BlogSlug] as BlogConfig | undefined;
}

export function createBlogMetadata(slug: BlogSlug): Metadata {
  return createArticleMetadata(blogArticles[slug].seo);
}

export async function BlogArticle({ slug }: { slug: BlogSlug }) {
  const config: BlogConfig = blogArticles[slug];
  const article = await getBlogArticle(config.sourceFile);

  return (
    <Blog
      article={article}
      heroImageSrc={config.heroImageSrc}
      heroImageAlt={config.heroImageAlt}
      seo={config.seo}
      highlights={config.highlights}
    />
  );
}
