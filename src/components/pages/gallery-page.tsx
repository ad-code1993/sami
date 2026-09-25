"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/locale-context";
import { GlobalHeader } from "@/components/global-header";
import { StickyConversionTray } from "@/components/sticky-conversion-tray";
import { FinalCTAFooter } from "@/components/final-cta-footer";
import {
  GALLERY_ITEMS,
  type GalleryCategory,
  type GalleryItem as GalleryImage,
} from "@/lib/gallery";

type GalleryFilter = "all" | GalleryCategory;

/** A shared gallery entry enriched with the localized caption for rendering. */
type GalleryView = GalleryImage & { label: string };

const FILTERS: { key: GalleryFilter; labelKey: string }[] = [
  { key: "all", labelKey: "gallery.filters.all" },
  { key: "engine", labelKey: "gallery.filters.engine" },
  { key: "transmission", labelKey: "gallery.filters.transmission" },
  { key: "suspension", labelKey: "gallery.filters.suspension" },
  { key: "brakes", labelKey: "gallery.filters.brakes" },
  { key: "workshop", labelKey: "gallery.filters.workshop" },
];

export function GalleryPage() {
  const { t } = useLocale();
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryView | null>(null);

  const images: GalleryView[] = GALLERY_ITEMS.map((item) => ({
    ...item,
    label: t(item.labelKey),
  }));
  const filteredImages =
    activeFilter === "all"
      ? images
      : images.filter((img) => img.category === activeFilter);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-gray pb-16 md:pb-0">
      <GlobalHeader />

      <main className="flex-1 pt-14">
        {/* Header Intro */}
        <section
          className="relative flex items-center"
          style={{
            minHeight: "35vh",
            backgroundImage: 'url("https://images.unsplash.com/photo-1504222490345-c075b6008014?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhciUyMHJlcGFpciUyMGdhcmFnZXxlbnwwfHwwfHx8MA%3D%3D")',
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
              {t("gallery.hero.title")}
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-gray-300 sm:text-lg">
              {t("gallery.hero.subtitle")}
            </p>
          </div>
        </section>

        {/* Filter Pills */}
        <section className="bg-neutral-gray pt-6 pb-6 md:pt-8 md:pb-6">
          <div className="mx-auto max-w-6xl px-4">
            <Tabs
              value={activeFilter}
              onValueChange={(val) => setActiveFilter(val as GalleryFilter)}
              className="w-full"
            >
              {/* Mobile: 2-3 line wrapped pills. Desktop: single row wrapped pills */}
              <TabsList className="flex w-full flex-wrap gap-2 bg-transparent p-0 md:flex-nowrap md:overflow-x-visible">
                {FILTERS.map((filter) => (
                  <TabsTrigger
                    key={filter.key}
                    value={filter.key}
                    className="shrink-0 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium data-[state=active]:bg-safety-orange data-[state=active]:text-white data-[state=active]:border-safety-orange"
                  >
                    {t(filter.labelKey)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Separator */}
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="h-px bg-gray-200" />
        </div>

        {/* Masonry Grid */}
        <section className="bg-neutral-gray pt-10 pb-10">
          <div className="mx-auto max-w-6xl px-4">
            <div className="columns-2 gap-2 sm:gap-3">
              {filteredImages.map((item, i) => (
                <button
                  key={`${item.category}-${i}`}
                  onClick={() => setSelectedImage(item)}
                  className="mb-3 block w-full overflow-hidden rounded-xl break-inside-avoid focus:outline-none focus:ring-2 focus:ring-safety-orange"
                >
                  <div className="relative">
                    <Image
                      src={item.src}
                      alt={item.label}
                      width={400}
                      height={i % 3 === 0 ? 300 : 250}
                      className="w-full object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white capitalize">
                      {t(`gallery.filters.${item.category}`)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Message Callout */}
        <section className="bg-neutral-gray py-10">
          <div className="mx-auto max-w-6xl px-4">
            <Card className="border p-6 text-center">
              <p className="text-sm leading-relaxed text-gray-600 italic">
                &ldquo;{t("gallery.trust")}&rdquo;
              </p>
            </Card>
          </div>
        </section>

        <FinalCTAFooter />

        {/* Lightbox Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="max-w-3xl bg-black/95 p-2">
            {selectedImage && (
              <div className="flex flex-col items-center gap-2">
                <DialogTitle className="text-sm font-medium text-white/80 sr-only">
                  {selectedImage.label}
                </DialogTitle>
                <div className="relative w-full max-h-[75vh]">
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.label}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain rounded-lg"
                    sizes="(max-width: 768px) 100vw, 80vw"
                  />
                </div>
                <p className="text-xs text-white/70">{selectedImage.label}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <StickyConversionTray />
    </div>
  );
}