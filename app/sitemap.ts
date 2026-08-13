import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// The site is a single page; the nav targets are in-page anchors, not routes,
// so there is exactly one indexable URL.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
