"use client";

import { MapPin, Navigation } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { business, mapEmbedUrl } from "@/lib/business";

export function MapSection() {
  const { t, locale } = useLocale();

  return (
    <section className="bg-neutral-gray py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Embedded Map — one canonical coordinate from business.ts (BLOCK-04) */}
          <div
            className="relative w-full overflow-hidden rounded-lg border bg-background"
            style={{ aspectRatio: "16/9" }}
          >
            <iframe
              src={mapEmbedUrl(locale)}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${business.name} — ${business.displayLocation}`}
              className="absolute inset-0"
            />
          </div>

          {/* Address Card */}
          <div className="flex flex-col items-center justify-between gap-4 rounded-lg border bg-background p-4 md:items-end md:text-right">
            <div className="flex items-center gap-3 md:flex-row-reverse">
              <MapPin className="size-6 text-safety-orange" />
              <div>
                <p className="font-medium">{business.name}</p>
                <p className="text-sm text-muted-foreground">
                  {business.displayLocation}
                </p>
                <p className="text-sm text-muted-foreground">
                  {business.telephone.display}
                </p>
              </div>
            </div>

            <a
              href={business.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-muted px-4 text-sm font-semibold transition-all hover:bg-muted/80"
            >
              <Navigation className="size-4" />
              {t("contact.address.cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
