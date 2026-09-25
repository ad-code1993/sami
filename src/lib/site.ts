import { business } from "@/lib/business";

/**
 * Canonical production origin (OPS-03 / SEO-02).
 *
 * TODO(owner, §12 Q5): confirm the production domain. Every canonical URL,
 * sitemap entry, `hreflang` alternate and Open Graph image URL is derived from
 * this value, so it must be set to the real domain at deploy time
 * (`NEXT_PUBLIC_SITE_URL`).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://samiautoservice.com"
).replace(/\/+$/, "");

/** Absolute URL for a path — never double-slashes, always canonical. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Every indexable route, in one place, for metadata + sitemap (SEO-01/SEO-04). */
export type RouteKey =
  | "home"
  | "about"
  | "services"
  | "gallery"
  | "faq"
  | "contact";

export type SiteRoute = {
  key: RouteKey;
  /** Locale-less path — `localePath(locale, path)` makes it absolute to a locale. */
  path: string;
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number;
};

export const ROUTES: readonly SiteRoute[] = [
  { key: "home", path: "/", changeFrequency: "weekly", priority: 1 },
  { key: "about", path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { key: "services", path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { key: "gallery", path: "/gallery", changeFrequency: "monthly", priority: 0.7 },
  { key: "faq", path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { key: "contact", path: "/contact", changeFrequency: "yearly", priority: 0.9 },
] as const;

export const SITE_NAME = business.name;

