"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Cog, Car } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { localePath } from "@/lib/i18n";
import Link from "next/link";

const serviceIcons = [Wrench, Cog, Car] as const;

export function ServicesCarousel() {
  const { locale, t } = useLocale();

  return (
    <section className="bg-neutral-gray py-8">
      {/* Changed px-4 to px-12 to guarantee side buttons have space on mobile viewports */}
      <div className="mx-auto max-w-6xl px-12">
        <h2 className="mb-8 text-xl font-semibold tracking-tight sm:text-2xl">
          {t("services.heading")}
        </h2>

        <Carousel className="w-full">
          <CarouselContent className="-ml-2">
            {[0, 1, 2].map((index) => {
              const Icon = serviceIcons[index] ?? Wrench;
              return (
                <CarouselItem
                  key={index}
                  className="basis-1/2 pl-2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="p-1">
                    <Card className="border">
                      <CardContent className="flex flex-col items-center justify-center gap-2 p-4 text-center sm:p-5">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted sm:size-11">
                          <Icon className="size-5 sm:size-6" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <h3 className="text-sm font-semibold sm:text-base">
                            {t(`services.items[${index}].title`)}
                          </h3>
                          <p className="hidden sm:block text-xs text-muted-foreground line-clamp-2">
                            {t(`services.items[${index}].description`)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {/* Back on the left and right sides without any wrapper container */}
          <CarouselPrevious className="ml-4" />
          <CarouselNext className="mr-4" />
        </Carousel>

        <div className="mt-8 flex justify-center sm:justify-start">
          <Link
            href={localePath(locale, "/services")}
            className="inline-flex h-8 w-fit shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            {t("services.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
