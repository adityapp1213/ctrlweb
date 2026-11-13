import type { MetadataRoute } from "next";
import { faqItems } from "@/lib/faq";
import { blogArticles, researchOrder } from "@/lib/research";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: "2026-07-04",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/research`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/team`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...researchOrder.map((slug) => {
      const { seo } = blogArticles[slug];
      return {
        url: `${SITE_URL}${seo.path}`,
        lastModified: seo.dateModified ?? seo.datePublished,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      };
    }),
    ...faqItems.map((item) => ({
      url: `${SITE_URL}/faq/${item.slug}`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
