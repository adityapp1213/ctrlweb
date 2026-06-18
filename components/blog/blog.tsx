import { FooterSection } from "@/app/footer/page";
import type { BlogArticle } from "@/lib/blog-article";
import { BlogContent } from "./blog-content";
import { BlogNav } from "./blog-nav";

type BlogProps = {
  article: BlogArticle;
  heroImageAlt: string;
  heroImageSrc: string;
};

export function Blog({ article, heroImageAlt, heroImageSrc }: BlogProps) {
  const plainTitle = article.titleHtml.replace(/<[^>]+>/g, "");

  return (
    <>
      <BlogNav />
      <main className="min-h-screen bg-white pt-28 text-black">
        <BlogContent
          article={article}
          plainTitle={plainTitle}
          heroImageSrc={heroImageSrc}
          heroImageAlt={heroImageAlt}
        />

        <FooterSection />
      </main>
    </>
  );
}
