import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, LOCALES, localePath } from "@/lib/i18n";
import { alternateLanguages } from "@/lib/seo";
import { ROUTES, absoluteUrl } from "@/lib/site";

/**
 * Sitemap (SEO-04) — every route in **both** locales, each entry declaring its
 * `hreflang` cluster so Google can serve `/am/…` to Amharic queries and `/en/…`
 * to English ones instead of treating them as duplicates (BLOCK-05).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(localePath(locale, route.path)),
      lastModified,
      changeFrequency: route.changeFrequency,
      // The default locale keeps the full weight; the translated copy ranks on
      // its own merit, so it is not discounted — only the primary is boosted.
      priority: locale === DEFAULT_LOCALE ? route.priority : Math.min(route.priority, 0.9),
      alternates: { languages: alternateLanguages(route.path) },
    })),
  );
}
