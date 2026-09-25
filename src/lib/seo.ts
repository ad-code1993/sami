import type { Metadata } from "next";
import { business } from "@/lib/business";
import {
  DEFAULT_LOCALE,
  HTML_LANG,
  LOCALES,
  OG_LOCALE,
  getDictionary,
  localePath,
  type Locale,
} from "@/lib/i18n";
import { getSeoContent } from "@/lib/seo-content";
import {
  ROUTES,
  SITE_URL,
  absoluteUrl,
  type RouteKey,
  type SiteRoute,
} from "@/lib/site";

/**
 * All SEO metadata and structured data, derived from one place (SEO-01…SEO-05).
 *
 * Every route × locale combination produces: a unique localized `<title>` and
 * `description`, keywords, a self-referencing canonical, the full `hreflang`
 * cluster (`en`, `am`, `x-default`), localized Open Graph/Twitter data and a
 * `BreadcrumbList`. The Amharic values come from `src/lib/seo-content.ts`, so
 * `/am/*` is a fully independent, indexable document rather than a client-side
 * translation of the English page (BLOCK-05).
 */

export function routeByKey(key: RouteKey): SiteRoute {
  const route = ROUTES.find((candidate) => candidate.key === key);
  if (!route) throw new Error(`Unknown route key: ${key}`);
  return route;
}

function localizedUrl(locale: Locale, path: string): string {
  return absoluteUrl(localePath(locale, path));
}

/**
 * `hreflang` cluster for a locale-less path:
 * `/about` → `{ en: "…/en/about", am: "…/am/about", "x-default": "…/en/about" }`.
 */
export function alternateLanguages(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = localizedUrl(locale, path);
  }
  languages["x-default"] = languages[DEFAULT_LOCALE];
  return languages;
}

/** Title + description + canonical + `hreflang` + social data for one route. */
export function pageMetadata(locale: Locale, key: RouteKey): Metadata {
  const content = getSeoContent(locale);
  const page = content.pages[key];
  const route = routeByKey(key);
  const url = localizedUrl(locale, route.path);

  return {
    // The home page must bypass the root title template, otherwise the brand +
    // city suffix would be appended twice.
    title: key === "home" ? { absolute: page.title } : page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: url,
      languages: alternateLanguages(route.path),
    },
    openGraph: {
      type: "website",
      url,
      siteName: content.siteName,
      title: page.title,
      description: page.description,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((other) => other !== locale).map(
        (other) => OG_LOCALE[other],
      ),
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
    robots: { index: true, follow: true },
  };
}

/**
 * Root defaults for `src/app/[locale]/layout.tsx`: `metadataBase`, the localized
 * title template and the home page's social/canonical data.
 */
export function rootMetadata(locale: Locale): Metadata {
  const content = getSeoContent(locale);

  return {
    ...pageMetadata(locale, "home"),
    metadataBase: new URL(SITE_URL),
    title: {
      default: content.defaultTitle,
      template: content.titleTemplate,
    },
    description: content.defaultDescription,
    keywords: content.keywords,
    applicationName: content.siteName,
    appleWebApp: { title: content.siteName, capable: true },
  };
}

/** `AutoRepair` (a `LocalBusiness` subtype) — one node for the whole business. */
export function businessJsonLd(locale: Locale) {
  const content = getSeoContent(locale);
  const dictionary = getDictionary(locale);
  const { address, geo, hours, telephone } = business;

  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${SITE_URL}/#business`,
    name: content.siteName,
    alternateName: [business.name, business.localName].filter(
      (name) => name !== content.siteName,
    ),
    description: content.pages.home.description,
    url: localizedUrl(locale, "/"),
    image: absoluteUrl("/opengraph-image.png"),
    logo: absoluteUrl("/icon.svg"),
    telephone: telephone.e164,
    currenciesAccepted: "ETB",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.region,
      ...(address.postalCode ? { postalCode: address.postalCode } : {}),
      addressCountry: address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    hasMap: business.mapsShareUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.days.map((day) => `https://schema.org/${day}`),
        opens: hours.opens,
        closes: hours.closes,
      },
    ],
    areaServed: [{ "@type": "City", name: address.city }],
    knowsLanguage: [...business.languages],
    sameAs: [business.telegram.url, business.gbpUrl],
    // `priceRange` is intentionally omitted until the owner publishes prices —
    // see DEPLOYMENT_OPTIMIZATION_PLAN.md §12.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: dictionary.servicesPage.hero.title,
      itemListElement: dictionary.servicesPage.categories.map((category) => ({
        "@type": "OfferCatalog",
        name: category.name,
        itemListElement: category.items.map((item) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: item.title,
            description: item.description,
          },
        })),
      })),
    },
  };
}

/**
 * `FAQPage` built from the same dictionary the accordion renders, so the schema
 * always matches the visible copy (a mismatch is what gets flagged as spam).
 */
export function faqJsonLd(locale: Locale) {
  const dictionary = getDictionary(locale);

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${localizedUrl(locale, "/faq")}#faq`,
    inLanguage: HTML_LANG[locale],
    mainEntity: dictionary.faqPage.categories.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    ),
  };
}

/** `BreadcrumbList` for a sub-page, in the page's own language. */
export function breadcrumbJsonLd(locale: Locale, key: RouteKey) {
  const content = getSeoContent(locale);
  const route = routeByKey(key);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${localizedUrl(locale, route.path)}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: content.breadcrumbs.home,
        item: localizedUrl(locale, "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: content.breadcrumbs[key],
        item: localizedUrl(locale, route.path),
      },
    ],
  };
}
