import { Blog } from "@/components/blog/blog";
import { getBlogArticle } from "@/lib/blog-article";

export default async function MonarchPage() {
  const article = await getBlogArticle("monarch-source.html");

  return (
    <Blog
      article={article}
      heroImageSrc="/assets/monarch.png"
      heroImageAlt="Monarch model overview"
    />
  );
}
