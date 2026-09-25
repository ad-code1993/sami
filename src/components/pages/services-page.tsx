"use client";

import { Wrench, Cog, Truck, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/locale-context";
import { GlobalHeader } from "@/components/global-header";
import { StickyConversionTray } from "@/components/sticky-conversion-tray";
import { FinalCTAFooter } from "@/components/final-cta-footer";

const categoryIcons = [Wrench, Cog, Truck, Settings] as const;

interface ServiceItem {
  title: string;
  description: string;
}

interface ServiceCategory {
  name: string;
  items: ServiceItem[];
}

export function ServicesPage() {
  const { t } = useLocale();

  // Build categories from structured translation keys
  const categories: ServiceCategory[] = [];
  const categoryCount = 4;
  const itemCounts = [3, 2, 3, 4]; // items per category

  for (let ci = 0; ci < categoryCount; ci++) {
    const name = t(`servicesPage.categories[${ci}].name`);
    const items: ServiceItem[] = [];
    for (let ii = 0; ii < itemCounts[ci]; ii++) {
      const title = t(`servicesPage.categories[${ci}].items[${ii}].title`);
      const description = t(`servicesPage.categories[${ci}].items[${ii}].description`);
      items.push({ title, description });
    }
    categories.push({ name, items });
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-gray pb-16 md:pb-0">
      <GlobalHeader />

      <main className="flex-1 pt-14">
        {/* Hero Section */}
        <section
          className="relative flex items-center"
          style={{
            minHeight: "40vh",
            backgroundImage: 'url("https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNhciUyMHJlcGFpciUyMGdhcmFnZXxlbnwwfHwwfHx8MA%3D%3D")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
            }}
          />
          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 px-4">
            <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight text-white">
              {t("servicesPage.hero.title")}
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-gray-300 sm:text-lg">
              {t("servicesPage.hero.subtitle")}
            </p>
          </div>
        </section>

        {/* Service Categories */}
        <section className="bg-neutral-gray py-12">
          <div className="mx-auto max-w-6xl px-4">
            {categories.map((category, ci) => {
              const CatIcon = categoryIcons[ci] ?? Wrench;
              return (
                <div key={ci} className="mb-10 last:mb-0">
                  <div className="mb-4 flex items-center gap-2">
                    <CatIcon className="size-5 text-safety-orange" />
                    <h2 className="text-lg font-bold text-charcoal">{category.name}</h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((item) => (
                      <Card key={item.title} className="flex flex-col gap-2 border p-4">
                        <h3 className="font-semibold text-charcoal">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <FinalCTAFooter />
      </main>

      <StickyConversionTray />
    </div>
  );
}