import type { Metadata } from "next";
import { Blog } from "@/components/blog/blog";
import { getBlogArticle } from "@/lib/blog-article";
import { createArticleMetadata, type ArticleSeo } from "@/lib/seo";

const seo: ArticleSeo = {
  path: "/godel-model",
  title: "Gödel 1.6: A Hybrid Local-Cloud LLM Architecture",
  description:
    "Gödel 1.6 is an Atom Ctrl architecture that handles routine work locally and routes complex tasks to cloud specialists only when required.",
  image: "/opengraph-image",
  datePublished: "2025-08-20",
  dateModified: "2026-07-04",
  keywords: [
    "Gödel 1.6",
    "hybrid local-cloud AI",
    "local language model",
    "AI routing architecture",
    "private AI",
  ],
};

export const metadata: Metadata = createArticleMetadata(seo);

export default async function GodelModelPage() {
  const article = await getBlogArticle("godel-source.html");

  return (
    <Blog
      article={article}
      heroImageSrc="/assets/gm1.svg"
      heroImageAlt="Gödel 1.6 local-cloud architecture overview"
      seo={seo}
    />
  );
}
