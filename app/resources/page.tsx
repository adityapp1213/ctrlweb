import Link from "next/link";
import { SimpleSiteNav } from "@/components/simple-site-nav";
import { SimpleSiteFooter } from "@/components/simple-site-footer";
import { blogArticles } from "@/app/research/_blog-article-page";

const blogCards = Object.values(blogArticles);

export default function BlogIndexPage() {
  return (
    <div className="simple-site-stack">
      <main className="simple-site min-h-screen bg-[#f7f7f5] text-[#171717]">
        <div className="simple-site-shell simple-site-shell-research">
          <SimpleSiteNav active="Research" />
          <section className="simple-blog-index" aria-labelledby="blog-index-title">
            <p className="simple-research-process-label">Our blogs</p>
            <h1 id="blog-index-title">Research notes and working ideas.</h1>
            <div className="simple-blog-index-list">
              {blogCards.map((blog) => (
                <Link className="simple-blog-index-item" href={blog.seo.path} key={blog.seo.path}>
                  <div>
                    <h2>{blog.seo.title}</h2>
                    <p>{blog.seo.description}</p>
                  </div>
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SimpleSiteFooter />
    </div>
  );
}
