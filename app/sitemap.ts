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
    {
      url: `${SITE_URL}/blog/monarch`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/blog/interaction-systems`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog/godel-model`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/blog/scaling-synthetic-data`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
