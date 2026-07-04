import type { Metadata } from "next";
import { Blog } from "@/components/blog/blog";
import { getBlogArticle } from "@/lib/blog-article";
import { createArticleMetadata, type ArticleSeo } from "@/lib/seo";

const seo: ArticleSeo = {
  path: "/monarch",
  title: "Monarch: Thought-Grounded Multimodal Intelligence",
  description:
    "Monarch is Atom Ctrl's architecture for turning multimodal experience into structured thought, memory, specialist processing, reasoning, and output.",
  image: "/opengraph-image",
  datePublished: "2026-07-03",
  dateModified: "2026-07-04",
  keywords: [
    "Monarch",
    "thought-grounded multimodal intelligence",
    "ThoughtVector",
    "persistent AI memory",
    "specialist reasoning",
  ],
};

export const metadata: Metadata = createArticleMetadata(seo);

export default async function MonarchPage() {
  const article = await getBlogArticle("monarch-source.html");

  return (
    <Blog
      article={article}
      heroImageSrc="/assets/monarch.png"
      heroImageAlt="Monarch model overview"
      seo={seo}
      highlights={[
        {
          title: "Multi-modal",
          description: "Text, images, audio, video, and documents enter one shared semantic space.",
          tone: "rose",
        },
        {
          title: "Thought formation",
          description: "Raw experience becomes a structured ThoughtVector before reasoning begins.",
          tone: "blue",
        },
        {
          title: "Persistent memory",
          description: "Semantic knowledge and prior episodes stay available across interactions.",
          tone: "teal",
        },
        {
          title: "Specialist reasoning",
          description: "Learned experts contribute context before a fixed-depth reasoning pass.",
          tone: "amber",
        },
      ]}
    />
  );
}
