import type { BlogArticle } from "@/lib/blog-article";
import { createArticleJsonLd, serializeJsonLd, type ArticleSeo } from "@/lib/seo";
import { SimpleSiteFooter } from "@/components/simple-site-footer";
import { SimpleSiteNav } from "@/components/simple-site-nav";
import { BlogContent } from "./blog-content";

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
      <div className="simple-site-stack">
        <div className="simple-site simple-blog-page">
          <div className="simple-blog-shell">
            <SimpleSiteNav active="Research" />
            <main className="simple-blog-main">
              <BlogContent
                article={article}
                plainTitle={plainTitle}
                heroImageSrc={heroImageSrc}
                heroImageAlt={heroImageAlt}
                highlights={highlights}
              />
            </main>
          </div>
        </div>
        <SimpleSiteFooter />
      </div>
    </>
  );
}
