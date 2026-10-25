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
  heroMetaClassName?: string;
  highlights?: Array<{
    title: string;
    description: string;
    tone: "rose" | "blue" | "teal" | "amber";
  }>;
};

export function Blog({ article, heroImageAlt, heroImageSrc, heroMetaClassName, highlights, seo }: BlogProps) {
  const plainTitle = article.titleHtml.replace(/<[^>]+>/g, "");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(createArticleJsonLd(seo)) }}
      />
      <div className="simple-site-stack simple-site-stack-footer-reveal">
        <div className="simple-site simple-blog-page">
          <div className="simple-blog-shell">
            <SimpleSiteNav active="Research" />
            <main className="simple-blog-main">
              <BlogContent
                article={article}
                plainTitle={plainTitle}
                heroImageSrc={heroImageSrc}
                heroImageAlt={heroImageAlt}
                heroMetaClassName={heroMetaClassName}
                highlights={highlights}
              />
            </main>
          </div>
        </div>
        <SimpleSiteFooter reveal />
      </div>
    </>
  );
}
