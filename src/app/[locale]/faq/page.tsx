import type { Metadata } from "next";
import { FAQPage } from "@/components/pages/faq-page";
import { JsonLd } from "@/components/structured-data";
import { toLocale } from "@/lib/i18n";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(toLocale(locale), "faq");
}

export default async function FaqRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(toLocale(locale), "faq")} />
      {/* Mirrors the visible accordion copy exactly (SEO-05 / GEO-A2). */}
      <JsonLd data={faqJsonLd(toLocale(locale))} />
      <FAQPage />
    </>
  );
}
