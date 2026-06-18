import { Blog } from "@/components/blog/blog";
import { getBlogArticle } from "@/lib/blog-article";

export default async function ScalingSyntheticDataPage() {
  const article = await getBlogArticle("scaling-source.html");

  return (
    <Blog
      article={article}
      heroImageSrc="/assets/scl.svg"
      heroImageAlt="Scaling synthetic data overview"
    />
  );
}
