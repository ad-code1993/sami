"use client";

import { Badge } from "@/components/ui/badge";
import { Phone, Send } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { LogoLockup } from "@/components/logo-lockup";
import { business } from "@/lib/business";

const TRUST_CHIP_KEYS = ["honestService", "fairPricing", "skilledMechanic"] as const;

export function HeroSection() {
  const { t } = useLocale();

  return (
    <section
      className="relative flex items-center"
      style={{
        minHeight: "60vh",
        paddingTop: "24px",
        paddingBottom: "40px",
        backgroundImage: 'url("https://plus.unsplash.com/premium_photo-1661373022510-dfd61512e080?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FyJTIwcmVwYWlyJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark gradient overlay - black on left, clearing to right */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 md:items-start">
        {/* Logo + Headline */}
        <div className="flex flex-col gap-3">
          {/* Decorative: the header link already exposes the brand name. */}
          <LogoLockup className="h-12 w-auto self-start text-white" />
          <h1
            className="font-['Inter'] text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            {t("hero.tagline")}
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className="max-w-lg text-base leading-relaxed sm:text-lg"
          style={{ color: "#E5E7EB" }}
        >
          {t("hero.description")}
        </p>

        {/* CTA Buttons */}
        <div className="flex w-full flex-col items-center gap-3 sm:flex-col sm:items-center sm:justify-center md:w-auto md:items-start">
          <a
            href={business.telephone.href}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-safety-orange px-6 text-sm font-semibold text-white transition-all hover:bg-safety-orange/90 md:w-1/2 md:min-w-[300px] md:max-w-xl"
          >
            <Phone className="size-4" />
            {t("hero.callNow")}
          </a>
          <a
            href={business.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-telegram-blue px-6 text-sm font-semibold text-white transition-all hover:bg-telegram-blue/90 md:w-1/2 md:min-w-[300px] md:max-w-xl"
          >
            <Send className="size-4" />
            {t("hero.telegram")}
          </a>
        </div>

        {/* Trust Chips */}
        <div
          className="flex flex-wrap gap-2"
          role="list"
          aria-label="Trust indicators"
        >
          {TRUST_CHIP_KEYS.map((key) => (
            <Badge
              key={key}
              variant="secondary"
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 hover:bg-white/15"
              role="listitem"
            >
              <span
                className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              {t(`trustChips.${key}`)}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
