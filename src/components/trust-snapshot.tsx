"use client";

import { Wrench, Tag, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/locale-context";

const iconMap = {
  wrench: Wrench,
  tag: Tag,
  "check-circle": CheckCircle,
} as const;

const TRUST_ICONS = ["wrench", "tag", "check-circle"] as const;

export function TrustSnapshot() {
  const { t } = useLocale();

  const items = [0, 1, 2].map((i) => ({
    title: t(`trust.items[${i}].title`),
    description: t(`trust.items[${i}].description`),
    icon: TRUST_ICONS[i],
  }));

  return (
    <section className="bg-neutral-gray py-6">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {items.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            return (
              <Card
                key={item.title}
                className="flex flex-col items-center gap-2 border p-4 text-center sm:p-6"
              >
                {Icon && (
                  <Icon className="size-6 sm:size-7" />
                )}
                <div>
                  <h3 className="text-sm font-semibold sm:text-base">
                    {item.title}
                  </h3>
                  <p className="hidden sm:block sm:text-xs sm:text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            variant="outline"
            className="border-border bg-background text-foreground hover:bg-muted"
          >
            {t("trust.learnMore")}
          </Button>
        </div>
      </div>
    </section>
  );
}
