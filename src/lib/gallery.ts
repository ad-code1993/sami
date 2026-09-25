/**
 * The workshop photo set — one list for the home "Our work" grid and the
 * gallery page (previously duplicated across `constants.ts` and
 * `gallery/page.tsx`, with three URLs repeated and a Google thumbnail host).
 *
 * TODO(BLOCK-03 / SPEED-06): replace these remote URLs with curated, original
 * workshop photos stored in `src/assets/` and imported statically. Static
 * imports give hashed filenames, immutable caching, a real `blurDataURL` and
 * true intrinsic dimensions, none of which a hotlinked JPEG can provide. The
 * image `alt` text then comes from `gallery.items[i].label` (localized).
 */

export type GalleryCategory =
  | "engine"
  | "transmission"
  | "suspension"
  | "brakes"
  | "workshop";

export type GalleryItem = {
  /**
   * i18n key of the caption, e.g. "gallery.items.0.label". Used as both the
   * lightbox caption and the image `alt` text so every language gets a
   * descriptive, localized description (SEO-06).
   */
  labelKey: string;
  src: string;
  category: GalleryCategory;
};

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&auto=format&fit=crop&q=60`;

export const GALLERY_ITEMS: GalleryItem[] = [
  { labelKey: "gallery.items.0.label", src: unsplash("photo-1487754180451-c456f719a1fc"), category: "engine" },
  { labelKey: "gallery.items.1.label", src: unsplash("photo-1530046339160-ce3e530c7d2f"), category: "transmission" },
  { labelKey: "gallery.items.2.label", src: unsplash("photo-1580273916550-e323be2ae537"), category: "suspension" },
  { labelKey: "gallery.items.3.label", src: unsplash("photo-1619642751034-765dfdf7c58e"), category: "workshop" },
  { labelKey: "gallery.items.4.label", src: unsplash("photo-1625047509168-a7026f36de04"), category: "brakes" },
  { labelKey: "gallery.items.5.label", src: unsplash("photo-1486262715619-67b85e0b08d3"), category: "engine" },
  { labelKey: "gallery.items.6.label", src: unsplash("photo-1504222490345-c075b6008014"), category: "workshop" },
  { labelKey: "gallery.items.7.label", src: unsplash("photo-1566008885218-339b84b42f54"), category: "suspension" },
  { labelKey: "gallery.items.8.label", src: unsplash("photo-1492148252911-7b29b2f2e6bd"), category: "workshop" },
  { labelKey: "gallery.items.9.label", src: unsplash("photo-1486260320484-b99b3bd9b2a3"), category: "transmission" },
  { labelKey: "gallery.items.10.label", src: unsplash("photo-1581092160562-40aa08e78837"), category: "brakes" },
  { labelKey: "gallery.items.11.label", src: unsplash("photo-1517524008697-84bbe3c3fd98"), category: "workshop" },
];

/** Home page teaser — the first four tiles only. */
export const WORK_GRID_ITEMS = GALLERY_ITEMS.slice(0, 4);

/** Remote image hosts the site is allowed to optimise (SPEED-04). */
export const GALLERY_HOSTS = ["images.unsplash.com"] as const;
