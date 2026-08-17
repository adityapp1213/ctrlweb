import {
  BlogArticle,
  createBlogMetadata,
} from "@/app/blog/_blog-article-page";

export const revalidate = 86400;

export const metadata = createBlogMetadata("interaction-systems");

export default function InteractionSystemsBlogPage() {
  return <BlogArticle slug="interaction-systems" />;
}
