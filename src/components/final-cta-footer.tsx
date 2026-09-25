"use client";

import { Phone, Send, MapPin } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import { LogoLockup } from "@/components/logo-lockup";
import { business } from "@/lib/business";

export function FinalCTAFooter() {
  const { t } = useLocale();

  return (
    <section className="bg-charcoal py-8 text-white">
      <div className="mx-auto max-w-6xl px-4">
        {/* Decorative brand mark — the header link owns the accessible name. */}
        <LogoLockup className="mb-5 h-8 w-auto text-white/80" />

        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold sm:text-2xl">
            {t("cta.heading")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/60 sm:text-base">
            {t("cta.subtitle")}
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-start">
          <a
            href={business.telephone.href}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-safety-orange px-4 text-sm font-semibold text-white transition-all hover:bg-safety-orange/90"
          >
            <Phone className="size-4" />
            {t("hero.callNow")}
          </a>
          <a
            href={business.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-telegram-blue px-4 text-sm font-semibold text-white transition-all hover:bg-telegram-blue/90"
          >
            <Send className="size-4" />
            {t("hero.telegram")}
          </a>
          <Link
            href={business.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 text-sm font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white"
          >
            <MapPin className="size-4" />
            {t("contact.address.cta")}
          </Link>
        </div>

        <div className="mt-4 hidden md:block">
          <p className="text-sm text-white/60">
            {t("site.name")} — {t("cta.tagline")}
          </p>
        </div>
      </div>
    </section>
  );
}
