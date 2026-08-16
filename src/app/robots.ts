import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin console, auth pages, and JSON API routes aren't content —
      // keep crawlers out.
      disallow: ["/admin", "/auth", "/api"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
