import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots.txt (SEO-04 / GEO-04).
 *
 * Everything is crawlable: this is a public local-business site whose whole
 * purpose is to be found. The AI-crawler agents are listed explicitly so the
 * policy is a deliberate decision (allow) rather than an accident — AI answer
 * engines are a real discovery channel for "where can I fix my car in Addis
 * Ababa" queries.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
