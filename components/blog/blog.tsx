import { FooterSection } from "@/app/footer/page";
import type { BlogArticle } from "@/lib/blog-article";
import { createArticleJsonLd, serializeJsonLd, type ArticleSeo } from "@/lib/seo";
import { BlogContent } from "./blog-content";
import { BlogNav } from "./blog-nav";

type BlogProps = {
  article: BlogArticle;
  heroImageAlt: string;
  heroImageSrc: string;
  seo: ArticleSeo;
  highlights?: Array<{
    title: string;
    description: string;
    tone: "rose" | "blue" | "teal" | "amber";
  }>;
};

export function Blog({ article, heroImageAlt, heroImageSrc, highlights, seo }: BlogProps) {
  const plainTitle = article.titleHtml.replace(/<[^>]+>/g, "");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(createArticleJsonLd(seo)) }}
      />
      <BlogNav />
      <main className="min-h-screen bg-white pt-28 text-black">
        <BlogContent
          article={article}
          plainTitle={plainTitle}
          heroImageSrc={heroImageSrc}
          heroImageAlt={heroImageAlt}
          highlights={highlights}
        />

        <FooterSection />
      </main>
    </>
  );
}
