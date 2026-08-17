import {
  BlogArticle,
  createBlogMetadata,
} from "@/app/blog/_blog-article-page";

export const revalidate = 86400;

export const metadata = createBlogMetadata("monarch");

export default function MonarchBlogPage() {
  return <BlogArticle slug="monarch" />;
}
