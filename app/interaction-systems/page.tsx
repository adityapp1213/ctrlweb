import { Blog } from "@/components/blog/blog";
import { getBlogArticle } from "@/lib/blog-article";

export default async function InteractionSystemsPage() {
  const article = await getBlogArticle("interaction-systems-source.html");

  return (
    <Blog
      article={article}
      heroImageSrc="/assets/is1.svg"
      heroImageAlt="Interaction systems timing overview"
    />
  );
}
