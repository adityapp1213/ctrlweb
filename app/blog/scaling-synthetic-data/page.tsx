import {
  BlogArticle,
  createBlogMetadata,
} from "@/app/blog/_blog-article-page";

export const revalidate = 86400;

export const metadata = createBlogMetadata("scaling-synthetic-data");

export default function ScalingSyntheticDataBlogPage() {
  return <BlogArticle slug="scaling-synthetic-data" />;
}
