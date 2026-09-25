import type { Metadata } from "next";
import { GlobalHeader } from "@/components/global-header";
import { StickyConversionTray } from "@/components/sticky-conversion-tray";
import { HeroSection } from "@/components/hero-section";
import { TrustSnapshot } from "@/components/trust-snapshot";
import { ServicesCarousel } from "@/components/services-carousel";
import { WhyChooseUs } from "@/components/why-choose-us";
import { RealWorkGrid } from "@/components/real-work-grid";
import { MiniFAQ } from "@/components/mini-faq";
import { FinalCTAFooter } from "@/components/final-cta-footer";
import { MapSection } from "@/components/map-section";
import { toLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

/**
 * Home page. A Server Component so it can own its metadata (SEO-01) — the
 * interactive pieces below are client components that read the locale from the
 * URL through `LocaleProvider`.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(toLocale(locale), "home");
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      <GlobalHeader />

      <main className="flex-1 pt-14">
        <HeroSection />
        <TrustSnapshot />
        <ServicesCarousel />
        <WhyChooseUs />
        <RealWorkGrid />
        <MiniFAQ />

        <FinalCTAFooter />
        <MapSection />
      </main>

      <StickyConversionTray />
    </div>
  );
}

