import {
  BlogArticle,
  createBlogMetadata,
} from "@/app/research/_blog-article-page";

export const revalidate = 86400;

export const metadata = createBlogMetadata("wam-0-1-dataset");

export default function Wam01DatasetBlogPage() {
  return <BlogArticle slug="wam-0-1-dataset" />;
}
