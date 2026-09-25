"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { localePath } from "@/lib/i18n";
import { WORK_GRID_ITEMS } from "@/lib/gallery";

export function RealWorkGrid() {
  const { locale, t } = useLocale();

  return (
    <section className="bg-neutral-gray py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {t("work.title")}
          </h2>
          <Link
            href={localePath(locale, "/gallery")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-safety-orange transition-colors hover:text-safety-orange/80"
          >
            {t("work.viewAll")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {WORK_GRID_ITEMS.map((item) => (
            <Link
              key={item.labelKey}
              href={localePath(locale, "/gallery")}
              className="group relative aspect-square overflow-hidden rounded-xl bg-muted sm:aspect-[4/3]"
            >
              <Image
                src={item.src}
                alt={t(item.labelKey)}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
