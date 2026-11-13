import type { Metadata } from "next";
import { Blog } from "@/components/blog/blog";
import { getBlogArticle } from "@/lib/blog-article";
import { createArticleMetadata } from "@/lib/seo";
import { blogArticles, type BlogConfig, type BlogSlug } from "@/lib/research";

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
      heroMetaClassName={config.heroMetaClassName}
      seo={config.seo}
      highlights={config.highlights}
    />
  );
}
