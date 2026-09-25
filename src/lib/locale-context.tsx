"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_STORAGE_KEY,
  getDictionary,
  pathnameForLocale,
  splitLocalePath,
  translate,
  type Locale,
} from "@/lib/i18n";

export type { Locale };

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  localeLoaded: boolean;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

/**
 * Locale provider for the URL-based language strategy (SEO-03 / BLOCK-05).
 *
 * The locale is **derived from the URL** (`/en/…`, `/am/…`) — the same value the
 * server used to render `<html lang>`, the metadata and the content. That
 * removes the old `localStorage` + `useEffect` swap, and with it the English
 * flash, the hydration-mismatch risk and the stale-locale bug on browser
 * back/forward navigation.
 *
 * `setLocale` is now a *navigation*: it remembers the choice in a cookie (read
 * by `src/proxy.ts` for un-prefixed URLs) and routes to the same page in the
 * other locale, so the change is shareable, cacheable and indexable.
 */
export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // The path is authoritative; `initialLocale` (from the server layout) is the
  // fallback so a missing/empty pathname can never silently render English.
  const locale = splitLocalePath(pathname ?? "").locale ?? initialLocale;

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
        document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
      } catch {
        // Storage can be unavailable (private mode) — the URL still carries the
        // locale, so nothing is lost.
      }

      const target = pathnameForLocale(
        pathname ?? `/${initialLocale}`,
        nextLocale,
      );
      if (target !== pathname) router.push(target);
    },
    [initialLocale, pathname, router],
  );

  const t = useCallback(
    (key: string): string => translate(getDictionary(locale), key),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, localeLoaded: true }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}

/**
 * Reads the visitor's remembered language choice (cookie, falling back to
 * `localStorage`). Used by the first-visit language modal.
 */
export function readStoredLocale(): Locale | null {
  if (typeof document === "undefined") return null;

  const fromCookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${LOCALE_COOKIE}=`))
    ?.split("=")[1];

  if (fromCookie === "en" || fromCookie === "am") return fromCookie;

  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "am") return stored;
  } catch {
    // Ignore — no stored preference is the same as an empty one.
  }

  return null;
}
