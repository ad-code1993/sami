"use client";

import Image from "next/image";
import { Shield, Search, Award, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/locale-context";
import { GlobalHeader } from "@/components/global-header";
import { StickyConversionTray } from "@/components/sticky-conversion-tray";
import { FinalCTAFooter } from "@/components/final-cta-footer";

const valueIcons = [Shield, Search, Award, Heart] as const;

export function AboutPage() {
  const { t } = useLocale();

  const items = [0, 1, 2, 3].map((i) => ({
    title: t(`about.values.items[${i}].title`),
    description: t(`about.values.items[${i}].description`),
  }));

  return (
    <div className="flex min-h-screen flex-col bg-neutral-gray pb-16 md:pb-0">
      <GlobalHeader />

      <main className="flex-1 pt-14">
        {/* Hero Section */}
        <section
          className="relative flex items-center"
          style={{
            minHeight: "50vh",
            backgroundImage: 'url("https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNhciUyMHJlcGFpciUyMG1lY2hhbmljfGVufDB8fDB8fHww")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
            }}
          />
          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 px-4">
            <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight text-white">
              {t("about.hero.title")}
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-gray-300 sm:text-lg">
              {t("about.hero.subtitle")}
            </p>
          </div>
        </section>

        {/* Who We Are Story Block */}
        <section className="bg-neutral-gray py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-charcoal">{t("about.story.title")}</h2>
                <p className="text-base leading-relaxed text-gray-600">{t("about.story.text")}</p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1lY2hhbmljJTIwd29ya3Nob3B8ZW58MHx8MHx8fDA%3D"
                  alt="SAMI Auto Service workshop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-neutral-gray py-12">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border p-6">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-charcoal">{t("about.mission.title")}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{t("about.mission.text")}</p>
                </div>
              </Card>
              <Card className="border p-6">
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-charcoal">{t("about.vision.title")}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{t("about.vision.text")}</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Icon Array */}
        <section className="bg-neutral-gray py-12">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-8 text-center text-2xl font-bold text-charcoal">{t("about.values.heading")}</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {items.map((item, i) => {
                const Icon = valueIcons[i];
                return (
                  <Card key={item.title} className="flex flex-col items-center gap-3 border p-6 text-center">
                    <Icon className="size-8 text-charcoal" />
                    <h3 className="text-sm font-semibold text-charcoal">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <FinalCTAFooter />
      </main>

      <StickyConversionTray />
    </div>
  );
}