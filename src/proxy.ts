import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, detectLocale, isLocale } from "@/lib/i18n";

/**
 * Locale redirect for URLs without a language prefix (SEO-03 / BLOCK-05).
 *
 * The canonical, indexable URLs are `/en/…` and `/am/…`. Any request without a
 * prefix — the bare domain, an old bookmark such as `/about`, or a legacy share
 * link — is redirected to the visitor's preferred locale: explicit cookie first,
 * then `Accept-Language`, then English. The choice is written to a cookie so the
 * detection happens once per visitor.
 *
 * A URL that already carries a supported prefix is left untouched, so `/am/…`
 * is always served as Amharic regardless of the request headers.
 *
 * (In Next.js 16 middleware is called Proxy — see
 * `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`.)
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const firstSegment = url.pathname.split("/")[1] ?? "";

  // Already localized — never rewrite or redirect an indexable URL. Forward the
  // validated locale so a server-rendered not-found boundary can render the same
  // language; Next does not pass route params to not-found components.
  if (isLocale(firstSegment)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-sami-locale", firstSegment);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const locale = detectLocale(
    request.headers.get("accept-language"),
    request.cookies.get(LOCALE_COOKIE)?.value,
  );

  url.pathname = `/${locale}${url.pathname === "/" ? "" : url.pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  /**
   * Run on page URLs only: skip Next internals (`/_next/*`), API routes and any
   * file request (a dot in the last segment covers `/sitemap.xml`,
   * `/robots.txt`, `/manifest.webmanifest`, `/icon.svg`, …).
   */
  matcher: ["/((?!api/|_next/|.*\\.).*)"],
};
