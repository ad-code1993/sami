import type { MetadataRoute } from "next";
import { business } from "@/lib/business";

/**
 * Web app manifest (BLOCK-02). Next serves this at `/manifest.webmanifest`
 * and injects the `<link rel="manifest">` automatically.
 *
 * Theme/background match `--color-charcoal: #1A1A1A` in globals.css, so the
 * home-screen tile never flashes white. Icons come from the generated set in
 * `src/app/` (see scripts/generate-icons.mjs).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.name,
    short_name: "SAMI",
    description: business.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1A1A1A",
    theme_color: "#1A1A1A",
    // English default; SEO-03 locale routing will switch this per locale.
    lang: "en",
    dir: "ltr",
    categories: ["automotive", "business"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}