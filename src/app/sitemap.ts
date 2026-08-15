import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

// Hand-maintained for now — the storefront only has a homepage. Once
// product/category pages exist (see src/features/products/lib/queries.ts),
// fetch their slugs here and map them into additional entries rather than
// hardcoding, so the sitemap can't drift from what's actually routable.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
