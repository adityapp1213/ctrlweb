import type { Metadata } from "next";
import { Blog } from "@/components/blog/blog";
import { getBlogArticle } from "@/lib/blog-article";
import { createArticleMetadata, type ArticleSeo } from "@/lib/seo";

const seo: ArticleSeo = {
  path: "/interaction-systems",
  title: "Interaction Systems: How Voice Becomes a Real Conversation",
  description:
    "Atom Ctrl's interaction architecture preserves turn state, forms partial understanding early, and begins shaping a response while a conversation is still active.",
  image: "/opengraph-image",
  datePublished: "2026-05-30",
  dateModified: "2026-07-04",
  keywords: [
    "voice interaction systems",
    "streaming speech AI",
    "turn state",
    "real-time AI conversation",
    "voice architecture",
  ],
};

export const metadata: Metadata = createArticleMetadata(seo);

export default async function InteractionSystemsPage() {
  const article = await getBlogArticle("interaction-systems-source.html");

  return (
    <Blog
      article={article}
      heroImageSrc="/assets/is1.svg"
      heroImageAlt="Interaction systems timing overview"
      seo={seo}
    />
  );
}
