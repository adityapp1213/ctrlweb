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
      url: `${SITE_URL}/team`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/research/monarch`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SITE_URL}/research/interaction-systems`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/research/godel-model`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/research/scaling-synthetic-data`,
      lastModified: "2026-07-04",
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
