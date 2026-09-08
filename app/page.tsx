import Link from "next/link";
import { SimpleSiteNav } from "@/components/simple-site-nav";

export default function Home() {
  return (
    <main className="simple-site min-h-screen bg-[#f7f7f5] text-[#171717]">
      <div className="simple-site-shell">
        <SimpleSiteNav active="Ctrl" />

        <section className="simple-site-content" aria-labelledby="home-title">
          <h1 id="home-title">
            Intelligence embedded in the <span>world.</span>
          </h1>

          <div className="simple-site-intro">
            <p>
              We are building thinking machines that can understand, reason,
              and learn from the world around them.
            </p>
            <p>Our work starts with a simple question: what should intelligence feel like?</p>
          </div>

          <div className="simple-site-divider" />

          <section className="simple-site-first-section" aria-labelledby="first-section-title">
            <p className="simple-site-number">01</p>
            <h2 id="first-section-title">thinking machines</h2>
            <p>
              We research models with memory, context, and a grounded sense of
              the world—not systems that only imitate an answer.
            </p>
            <Link className="simple-site-text-link" href="/research">
              explore our research <span aria-hidden="true">↗</span>
            </Link>
          </section>
        </section>
      </div>
    </main>
  );
}
