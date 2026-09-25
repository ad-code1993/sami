import en from "@/lib/translations/en.json";
import am from "@/lib/translations/am.json";

/**
 * Locale plumbing for the URL-based language strategy (SEO-03 / BLOCK-05).
 *
 * The locale is part of the URL (`/en/...`, `/am/...`), so it is known on the
 * server before the first byte of HTML is written. That is what makes the
 * Amharic copy indexable: `<html lang>`, the content itself, `hreflang` and the
 * canonical URL are all rendered per URL, with no client-side swap.
 *
 * This module is intentionally free of `server-only` and of Node APIs so the
 * same helpers can be used by server components, route handlers, the proxy and
 * client components without duplication.
 */

export const LOCALES = ["en", "am"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** `en.json` is the reference dictionary — `am.json` must match its shape. */
export type Dictionary = typeof en;

const DICTIONARIES: Record<Locale, Dictionary> = { en, am };

/** Explicit language choice made by the visitor (cookie is read by the proxy). */
export const LOCALE_STORAGE_KEY = "sami-locale";
export const LOCALE_COOKIE = "sami-locale";
/** One year, in seconds. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** `hreflang` / `<html lang>` tag per locale. */
export const HTML_LANG: Record<Locale, string> = { en: "en", am: "am" };

/** Open Graph locale per locale (`og:locale` / `og:locale:alternate`). */
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", am: "am_ET" };

/** Human-readable label, shown in the language switcher. */
export const LOCALE_LABEL: Record<Locale, string> = {
  en: "English",
  am: "አማርኛ",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "am";
}

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/**
 * Narrows a raw route param to a supported locale, falling back to the default.
 * The proxy only ever redirects to a supported locale prefix, so the fallback is
 * a type-safety net (and keeps `generateMetadata` total).
 */
export function toLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Nested dictionary lookup — `"a.b[0].c"` reads `dictionary.a.b[0].c`.
 * Bracket notation is normalized to dot notation first.
 */
export function getNestedValue(source: unknown, path: string): unknown {
  const normalized = path.replace(/\[(\d+)\]/g, ".$1");
  let current: unknown = source;

  for (const key of normalized.split(".")) {
    if (key === "") continue;
    if (
      current &&
      typeof current === "object" &&
      key in (current as Record<string, unknown>)
    ) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Resolves a translation key, falling back to English and only then to the key
 * itself (CODE-07 behaviour, shared by server and client code paths).
 */
export function translate(dictionary: Dictionary, key: string): string {
  const value = getNestedValue(dictionary, key);
  if (typeof value === "string") return value;

  const fallback = getNestedValue(DICTIONARIES[DEFAULT_LOCALE], key);
  return typeof fallback === "string" ? fallback : key;
}

/** Locale-less app path → locale-prefixed path: `("am", "/about")` → `/am/about`. */
export function localePath(locale: Locale, path = "/"): string {
  const cleanPath =
    path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${cleanPath}`;
}

/** `/am/about?x=1` → `{ locale: "am", path: "/about" }` (query string dropped). */
export function splitLocalePath(pathname: string): {
  locale: Locale | null;
  path: string;
} {
  const [first = "", ...rest] = pathname.split("/").filter(Boolean);
  if (isLocale(first)) {
    return { locale: first, path: rest.length > 0 ? `/${rest.join("/")}` : "/" };
  }
  return {
    locale: null,
    path: pathname === "/" ? "/" : `/${[first, ...rest].filter(Boolean).join("/")}`,
  };
}

/** The same page in another locale: `("/am/about", "en")` → `/en/about`. */
export function pathnameForLocale(pathname: string, locale: Locale): string {
  return localePath(locale, splitLocalePath(pathname).path);
}

/**
 * Picks the best locale for a visitor who requested a URL without a locale
 * prefix: explicit cookie first, then `Accept-Language`, then the default.
 * (`Accept-Language: am-ET,am;q=0.9,en;q=0.8` → `am`.)
 */
export function detectLocale(
  acceptLanguage: string | null | undefined,
  cookieLocale?: string | null,
): Locale {
  if (isLocale(cookieLocale)) return cookieLocale;
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag = "", quality] = part.trim().split(";q=");
      return { tag: tag.trim().toLowerCase(), quality: quality ? Number(quality) : 1 };
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (isLocale(primary)) return primary;
  }

  return DEFAULT_LOCALE;
}
