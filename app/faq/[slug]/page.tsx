import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SimpleSiteCta } from "@/components/simple-site-cta";
import { SimpleSiteFooter } from "@/components/simple-site-footer";
import { SimpleSiteNav } from "@/components/simple-site-nav";
import { faqItems, getFaqItem } from "@/lib/faq";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return faqItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const item = getFaqItem((await params).slug);
  if (!item) return {};
  return createPageMetadata({
    path: `/faq/${item.slug}`,
    title: item.title,
    description: item.description,
    keywords: item.keywords,
  });
}

export default async function FaqPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = getFaqItem((await params).slug);
  if (!item) notFound();

  const pageUrl = absoluteUrl(`/faq/${item.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: pageUrl,
    mainEntity: {
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    },
  };

  return (
    <div className="simple-site-stack">
      <main className="simple-site min-h-screen bg-[#f7f7f5] text-[#171717]">
        <div className="simple-site-shell">
          <SimpleSiteNav active="Ctrl" />
          <article className="simple-site-content faq-page-content">
            <p className="simple-site-number">FAQ</p>
            <h1>{item.title}</h1>
            <p className="faq-page-answer">{item.answer}</p>
            <Link className="simple-site-text-link" href="/">
              back to the questions <span aria-hidden="true" />
            </Link>
          </article>
        </div>
        <SimpleSiteCta />
      </main>
      <SimpleSiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
