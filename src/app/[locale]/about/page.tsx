import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about-page";
import { JsonLd } from "@/components/structured-data";
import { toLocale } from "@/lib/i18n";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(toLocale(locale), "about");
}

export default async function AboutRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(toLocale(locale), "about")} />
      <AboutPage />
    </>
  );
}
