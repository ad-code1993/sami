"use client";

import { Card } from "@/components/ui/card";
import { Search, Tag, Wrench, Clock, Shield, Heart } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

const iconMap = {
  search: Search,
  tag: Tag,
  wrench: Wrench,
  clock: Clock,
  shield: Shield,
  heart: Heart,
} as const;

const WHY_ICONS = ["search", "tag", "wrench", "clock", "shield", "heart"] as const;

export function WhyChooseUs() {
  const { t } = useLocale();

  return (
    <section className="bg-neutral-gray py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-xl font-semibold tracking-tight sm:text-2xl">
          {t("whyChooseUs.heading")}
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const Icon = iconMap[WHY_ICONS[index] as keyof typeof iconMap];
            return (
              <Card
                key={index}
                className="flex flex-col items-center gap-3 border p-5 text-center"
              >
                {Icon && (
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <Icon className="size-5" />
                  </div>
                )}
                <h3 className="text-sm font-semibold sm:text-base">
                  {t(`whyChooseUs.items[${index}].title`)}
                </h3>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
