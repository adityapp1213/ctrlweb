import type { MetadataRoute } from "next";
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
      url: `${SITE_URL}/first`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/company`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
