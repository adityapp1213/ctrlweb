import { Blog } from "@/components/blog/blog";
import { getBlogArticle } from "@/lib/blog-article";

export default async function GodelModelPage() {
  const article = await getBlogArticle("godel-source.html");

  return <Blog article={article} heroImageSrc="/assets/gm1.svg" heroImageAlt="Godel model overview" />;
}
