"use client";

import { Clock, Phone, Send, MapPin, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useLocale } from "@/lib/locale-context";
import { GlobalHeader } from "@/components/global-header";
import { StickyConversionTray } from "@/components/sticky-conversion-tray";
import { FinalCTAFooter } from "@/components/final-cta-footer";
import { business, mapEmbedUrl } from "@/lib/business";

export function ContactPage() {
  const { t, locale } = useLocale();

  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      <GlobalHeader />

      <main className="flex-1 pt-14">
        {/* Header Section */}
        <section className="bg-neutral-gray py-12">
          <div className="mx-auto max-w-6xl px-4">
            <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight text-charcoal">
              {t("contact.title")}
            </h1>
          </div>
        </section>

        {/* Contact details — NAP single-sourced from business.ts (GEO-L1) */}
        <section className="bg-white py-10">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Phone */}
              <Card className="flex flex-col border p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Phone className="size-5 text-safety-orange" aria-hidden="true" />
                  <h2 className="text-lg font-bold text-charcoal">
                    {t("contact.phone.title")}
                  </h2>
                </div>
                <p className="mb-1 text-sm text-gray-600">
                  {t("contact.phone.description")}
                </p>
                <p className="mb-4 font-medium text-charcoal">
                  {business.telephone.display}
                </p>
                <a
                  href={business.telephone.href}
                  className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-safety-orange px-4 text-sm font-semibold text-white transition-all hover:bg-safety-orange/90"
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {t("contact.phone.cta")}
                </a>
              </Card>

              {/* Telegram */}
              <Card className="flex flex-col border p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Send className="size-5 text-telegram-blue" aria-hidden="true" />
                  <h2 className="text-lg font-bold text-charcoal">
                    {t("contact.telegram.title")}
                  </h2>
                </div>
                <p className="mb-1 text-sm text-gray-600">
                  {t("contact.telegram.description")}
                </p>
                <p className="mb-4 font-medium text-charcoal">
                  {business.telegram.handle}
                </p>
                <a
                  href={business.telegram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-telegram-blue px-4 text-sm font-semibold text-white transition-all hover:bg-telegram-blue/90"
                >
                  <Send className="size-4" aria-hidden="true" />
                  {t("contact.telegram.cta")}
                </a>
              </Card>

              {/* Location */}
              <Card className="flex flex-col border p-6">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="size-5 text-safety-orange" aria-hidden="true" />
                  <h2 className="text-lg font-bold text-charcoal">
                    {t("contact.address.title")}
                  </h2>
                </div>
                <p className="mb-1 text-sm text-gray-600">
                  {t("contact.address.description")}
                </p>
                <p className="mb-4 font-medium text-charcoal">
                  {business.displayLocation}
                </p>
                <a
                  href={business.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-muted px-4 text-sm font-semibold text-charcoal transition-all hover:bg-muted/80"
                >
                  <Navigation className="size-4" aria-hidden="true" />
                  {t("contact.address.cta")}
                </a>
              </Card>
            </div>
          </div>
        </section>

        {/* Operating Hours */}
        <section className="bg-neutral-gray py-10">
          <div className="mx-auto max-w-6xl px-4">
            <Card className="border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="size-5 text-safety-orange" aria-hidden="true" />
                <h2 className="text-lg font-bold text-charcoal">{t("contact.hours.title")}</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("contact.hours.weekdays")}</span>
                  <span className="font-medium text-charcoal">{t("contact.hours.weekdaysTime")}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("contact.hours.sunday")}</span>
                  <span className="font-medium text-charcoal">{t("contact.hours.sundayTime")}</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Embedded Map — same canonical coordinate as the home page (BLOCK-04) */}
        <section className="bg-white py-10">
          <div className="mx-auto max-w-6xl px-4">
            <AspectRatio ratio={16 / 9}>
              <iframe
                src={mapEmbedUrl(locale)}
                className="h-full w-full rounded-xl border"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${business.name} — ${business.displayLocation}`}
              />
            </AspectRatio>
          </div>
        </section>

        <FinalCTAFooter />
      </main>

      <StickyConversionTray />
    </div>
  );
}