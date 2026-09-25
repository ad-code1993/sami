import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { LanguageModal } from "@/components/language-modal";
import { JsonLd } from "@/components/structured-data";
import { HTML_LANG, LOCALES, isLocale, toLocale } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/locale-context";
import { businessJsonLd, rootMetadata } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

/**
 * Root layout, nested under `[locale]` (SEO-03, recommended option 1 in
 * DEPLOYMENT_OPTIMIZATION_PLAN.md).
 *
 * Because the locale is a URL segment, this layout can set `<html lang>` and the
 * metadata per language on the server — the two things that made the Amharic
 * site invisible before (BLOCK-05):
 *   - `/en/…` renders `lang="en"` + English metadata and content,
 *   - `/am/…` renders `lang="am"` + Amharic metadata and content,
 *   - both are prerendered at build time, so no client-side swap is involved.
 */

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return rootMetadata(toLocale(locale));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={HTML_LANG[locale]}
      dir="ltr"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {/* One AutoRepair/LocalBusiness node per locale, in that locale's copy. */}
        <JsonLd data={businessJsonLd(locale)} />
        <LocaleProvider initialLocale={locale}>
          <LanguageModal />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
