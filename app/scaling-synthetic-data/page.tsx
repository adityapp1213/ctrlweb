import type { Metadata } from "next";
import { Blog } from "@/components/blog/blog";
import { getBlogArticle } from "@/lib/blog-article";
import { createArticleMetadata, type ArticleSeo } from "@/lib/seo";

const seo: ArticleSeo = {
  path: "/scaling-synthetic-data",
  title: "Scaling Synthetic Data",
  description:
    "Atom Ctrl explores using LLaMA-3 to turn raw web text into cleaner, structured synthetic training data for compact language models.",
  image: "/opengraph-image",
  datePublished: "2025-07-28",
  dateModified: "2026-07-04",
  keywords: [
    "synthetic training data",
    "LLaMA-3 rephrasing",
    "compact language models",
    "data quality",
    "AI pretraining",
  ],
};

export const metadata: Metadata = createArticleMetadata(seo);

export default async function ScalingSyntheticDataPage() {
  const article = await getBlogArticle("scaling-source.html");

  return (
    <Blog
      article={article}
      heroImageSrc="/assets/scl.svg"
      heroImageAlt="Scaling synthetic data overview"
      seo={seo}
    />
  );
}
