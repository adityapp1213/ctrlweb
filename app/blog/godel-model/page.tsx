import {
  BlogArticle,
  createBlogMetadata,
} from "@/app/blog/_blog-article-page";

export const revalidate = 86400;

export const metadata = createBlogMetadata("godel-model");

export default function GodelModelBlogPage() {
  return <BlogArticle slug="godel-model" />;
}
