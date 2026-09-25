import type { Metadata } from "next";
import { ServicesPage } from "@/components/pages/services-page";
import { JsonLd } from "@/components/structured-data";
import { toLocale } from "@/lib/i18n";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(toLocale(locale), "services");
}

export default async function ServicesRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(toLocale(locale), "services")} />
      <ServicesPage />
    </>
  );
}
