# SAMI Auto Service — Final Deployment Optimization Plan

**Status:** PLAN ONLY — no code has been changed by this document.
**Audit date:** 2026-09-23
**Stack as built:** Next.js `16.2.10` (Turbopack) · React `19.2.4` · Tailwind CSS `v4` · shadcn (base-nova) + `@base-ui/react` · pnpm · TypeScript strict
**Scope:** everything that must be true before this site goes live as the production lead-generation site for SAMI Auto Service (Addis Ababa).

> **Rule for the implementer (from `AGENTS.md`):** this Next.js version has breaking changes. Before writing any code for an item below, read the relevant page in `node_modules/next/dist/docs/` (e.g. `01-app/03-api-reference/02-components/image.md`, `.../01-metadata/*`, `.../05-config/01-next-config-js/*`). Several items below are **version-specific** and will be wrong if implemented from memory.

---

## 0. How to read this document

* Every item has an **ID**, a **priority**, the **exact files**, the **evidence** it was derived from, **why it is necessary**, and a **proposed fix**.
* Priority scale: **P0** = release blocker (must not go live without it) · **P1** = required for launch quality · **P2** = high value, may ship shortly after launch · **P3** = nice to have.
* Phases are defined in §10. Item IDs are stable — reference them in follow-up prompts (e.g. "implement SPEED-01 + BLOCK-01").
* Numbers in §2 were measured from a real `pnpm build` on this machine; they are the *baseline* the plan is judged against.

---

## 1. Executive summary

The build is **healthy and functional** (`pnpm build` passes, all 7 routes prerendered as static, TypeScript clean). The problems are not correctness problems — they are **budget problems and search-visibility problems**. The site currently ships **~1.7 MB (gzip) of critical-path payload** (JS + CSS + logo + font + favicon) before the hero can paint, of which **~1.35 MB is a single logo file**, and none of the 7 pages has its own title, description, structured data, sitemap entry, or indexable Amharic version.

### The six release blockers

| ID | Blocker | One-line impact |
|---|---|---|
| **BLOCK-01** | `mobilelogo.svg` is a **1.86 MB** raster-in-SVG, preloaded on every page (1.35 MB gzip) | Destroys LCP on mobile data; the #1 performance defect in the project |
| **BLOCK-02** | `favicon.ico` is **422 KB** and there is no icon/manifest set | Wasted bytes every visit; broken iOS/PWA presentation |
| **BLOCK-03** | All hero images are **CSS `background-image` hotlinked from Unsplash** | Unoptimisable LCP element, layout-jump risk, third-party dependency |
| **BLOCK-04** | Two Google Maps embeds with **two different coordinates**, bare `0x0:0x0` place IDs | NAP inconsistency (local-SEO trust) + heavy third-party JS |
| **BLOCK-05** | Locale is **client-only + `lang="en"` hardcoded**; sub-pages cannot own metadata | Amharic is invisible to search & AI engines; duplicate titles sitewide |
| **BLOCK-06** | `next/image` runtime dependency on **sharp** unverified for the deploy target | If it fails on the host, *every* image returns 500 |

### What "done" looks like (proposed targets — confirm in §12)

| Metric | Baseline (measured) | Target |
|---|---|---|
| Home critical-path payload (JS+CSS+logo, gzip) | **1,626 KB** | **< 180 KB** |
| First-load JS for `/` (gzip) | **261 KB** (836 KB raw) | **< 110 KB** |
| Largest single asset | 1,349 KB gzip (logo) | **< 60 KB** |
| LCP (Slow 4G, mobile) | not yet measured | **< 2.5 s** |
| CLS | not yet measured | **< 0.1** |
| Pages with unique title + description + canonical | 0 / 7 | **7 / 7** |
| Indexable Amharic pages | 0 | **6** (one per route) |
| `LocalBusiness`/`AutoRepair` JSON-LD | none | **1 valid, Rich-Results-tested** |

---

## 2. Measured baseline (evidence)

All figures below come from the real production build in this workspace.

| # | Measurement | Value | Source |
|---|---|---|---|
| 1 | Production build | ✅ passes, 7 routes prerendered static, TS clean | `pnpm build` |
| 2 | First-load JS for `/` | **836.4 KB raw / 261 KB gzip** across **12** chunks | chunk paths in `.next/server/app/index.html` |
| 3 | Largest JS chunk | 222 KB raw / 70.1 KB gzip (contains `react-dom`) | `.next/static/chunks/0h3m2pzcgo_i7.js` |
| 4 | Identically-sized per-route chunks | five chunks of exactly **125.8 KB** each (41.3 KB gzip); each contains `cva`/`clsx` | `.next/static/chunks/0myze_dqckxwn.js` + 4 |
| 5 | CSS bundle | 94.2 KB raw / **15.8 KB gzip** (1 file) | `.next/static/chunks/3a0a32nse-93b.css` |
| 6 | `public/mobilelogo.svg` | **1,863.7 KB raw / 1,348.8 KB gzip** — Inkscape SVG with **1 embedded base64 raster** | `public/mobilelogo.svg` |
| 7 | Logo is **preloaded** on every page | `<link rel="preload" as="image" href="/mobilelogo.svg"/>` | `<head>` of `.next/server/app/index.html` |
| 8 | `src/app/favicon.ico` | **422.1 KB** served as `sizes="256x256"` | `.next/server/app/favicon.ico.body` |
| 9 | Home critical path (JS+CSS+logo) | **2,794 KB raw / 1,626 KB gzip** | sum of rows 2, 5, 6 |
| 10 | Fonts | Inter, **5 weights × 7 subsets = 35 `@font-face`** + 1 fallback; 7 shared variable files; `latin` = 47.3 KB (**preloaded**) | compiled CSS + `.next/static/media` |
| 11 | Translation JSON in the client bundle | the dictionary appears in **two** chunks — 38.2 KB + 38.0 KB — **both** loaded on `/` | `0n0_fim4vrnce.js`, `0qm85efe-q97u.js` (scan for `honestService`) |
| 12 | Translation key parity | `en.json` 152 keys / `am.json` 152 keys — **perfect parity** ✅ | JSON flatten + compare |
| 13 | Silent CSS no-op classes | `bg-neutral` and `bg-gray` are **absent from the compiled CSS** (invalid in Tailwind v4) | search of compiled CSS |
| 14 | Lint | **3 errors + 12 warnings** | `npx eslint src` |
| 15 | Unused public assets | `mobilelogo.png` 1,305.6 KB, `tabletlogo.png` 1,332.8 KB | `public/` |
| 16 | Dangling asset reference | `src/lib/constants.ts` points to `/placeholder-service.svg`, **which does not exist** | constants vs `public/` |
| 17 | Repo artifacts | `shadcn-components.html` 466.6 KB, `tsconfig.tsbuildinfo` 252.8 KB, `design/*.jpg` ≈ 947 KB | repo root / `design/` |
| 18 | Metadata surfaces present | title + description — **nothing else** (no `metadataBase`, OG, Twitter, canonical, robots, sitemap, manifest, JSON-LD) | `src/app/layout.tsx`, file tree |
| 19 | Hero heights vs spec | code 60 / 50 / 40 / 35 vh · `design.md` specifies **80 vh** | `design.md` §Page 1 vs hero/about/services/faq |
| 20 | Map coordinates | home `8.992418, 38.8524308` ≠ contact `9.0317, 38.7361` | `map-section.tsx:14`, `contact/page.tsx:59` |

**Reading of the baseline:** the site is roughly **10× over** a healthy payload budget for a mobile-first lead-generation site in a market where a meaningful share of traffic is metered mobile data. Rows 2, 6 and 8 alone account for ~1.5 MB gzip of *avoidable* bytes on the first visit.

---

## 3. Phase 0 — Release blockers (must be fixed before go-live)

### BLOCK-01 · Replace the 1.86 MB logo SVG
- **Priority:** P0 · **Phase 0** · **Effort:** S · **Risk:** low
- **Where:** `public/mobilelogo.svg`, used by `src/components/global-header.tsx:90` and `src/components/language-modal.tsx:38`
- **Evidence:** the file is 1,863.7 KB (1,348.8 KB gzip — base64 is incompressible) and contains **one embedded base64 raster** inside an Inkscape SVG; the compiled `<head>` contains `<link rel="preload" as="image" href="/mobilelogo.svg"/>`.
- **Why necessary:** `next/image` **cannot optimise SVG** (it is served as-is). Because the header logo uses `priority`, the browser is told to download this 1.9 MB file *before* it renders anything else, on every route, at the highest priority. On a typical Addis Ababa mobile connection this single asset can add 10–30 s to LCP and will fail Core Web Vitals (LCP/TBT) — which Google uses as a page-experience signal, and which directly reduces conversions because the hero CTA is not interactive while the page is starved.
- **Fix:** if the logo can be true vector, export a clean SVG **with the raster removed** (target ≤ 10 KB) and run it through SVGO. If the artwork is inherently raster, ship **WebP/AVIF at 2× display size** (e.g. 160×160 px → ~5 KB) and reference it as a normal `next/image`. Then fix the sizing mismatch in A11Y-03 (`width/height={40}` vs `className="size-20"` = 80 px inside a 56 px `h-14` bar). Keep the preload hint **only** on the real above-the-fold LCP element — see SPEED-05 for the Next 16 `preload` API.
- **Verification:** no asset > 60 KB referenced by a `preload` hint in `.next/server/app/index.html`.

### BLOCK-02 · Replace the 422 KB favicon and add a proper icon set
- **Priority:** P0 · **Phase 0** · **Effort:** S · **Risk:** low
- **Where:** `src/app/favicon.ico` (422.1 KB, served as `sizes="256x256"`); missing `icon.svg`, `apple-icon`, `manifest`
- **Why necessary:** the favicon is requested by essentially every browser and appears in Telegram/WhatsApp link previews, browser tabs and Google's mobile results. 422 KB is tens to hundreds of times larger than a normal favicon (typically a few KB) and is pure waste on metered connections. Separately, with no `apple-icon` an iOS user who adds the site to their home screen gets a screenshot placeholder, and with no web app manifest there is no installable/PWA path — for a repeat-customer garage that matters more than for a content site.
- **Fix:** reduce to a standard multi-size ICO (16/32/48 px, a few KB) **or better** ship `app/icon.svg` + `app/apple-icon.png` (180×180) and let Next generate the tags. Add `app/manifest.ts` with `name`, `short_name`, `icons`, `theme_color: #1A1A1A`, `background_color: #FFFFFF`, `display: standalone`, `start_url: /`, plus `lang` and `dir`.
- **Note:** do **not** rely on the current 256 px ICO as the app icon — it is the same 422 KB payload.

### BLOCK-03 · Move hero imagery from CSS `background-image` to `next/image`
- **Priority:** P0 · **Phase 0** · **Effort:** M · **Risk:** medium (check visual parity per breakpoint)
- **Where:** `src/components/hero-section.tsx:24`, `src/app/about/page.tsx:33`, `src/app/services/page.tsx:51`, `src/app/faq/page.tsx:56` (all hotlink `images.unsplash.com` / `plus.unsplash.com` / `encrypted-tbn0.gstatic.com`)
- **Evidence:** each hero sets `style={{ backgroundImage: 'url("https://images.unsplash.com/…")' }}` inside a `relative` section with an absolutely-positioned gradient overlay.
- **Why necessary:**
  1. **The LCP element cannot be optimised.** A CSS background is invisible to the image pipeline: no AVIF/WebP, no responsive `srcset`, no `sizes`, no preload, no width/height. The browser downloads the full JPEG the URL specifies and paints it late.
  2. **You do not control the CDN.** Unsplash / Google-thumbnail URLs can change, rate-limit or 404; you cannot set cache headers; every request pays a fresh DNS + TLS handshake to a third party.
  3. **Layout-jump risk** — `design.md` §Rule 2 explicitly requires `next/image` layout properties "to support modern image formats and prevent page jumps".
  4. `encrypted-tbn0.gstatic.com` is Google's *thumbnail cache for scraped results* — not a licensed, stable image host. It currently backs the FAQ hero and 4 of the home gallery images.
- **Fix:** curate the real workshop photos, store them in `src/assets/` and use **static imports** (hashed filenames + immutable caching + automatic `blur` placeholder + real dimensions), rendered inside the existing wrapper as `<Image fill preload sizes="100vw" />`. Keep the gradient as a sibling `<div aria-hidden>`. Reconcile section heights with `design.md` (80 vh on home) while in the file (row 19 of §2).

### BLOCK-04 · One canonical location for both maps
- **Priority:** P0 · **Phase 0** · **Effort:** S · **Risk:** low
- **Where:** `src/components/map-section.tsx:14` (`2d38.8524308!3d8.992418` → 8.992418, 38.8524308) vs `src/app/contact/page.tsx:59` (`2d38.7361!3d9.0317` → 9.0317, 38.7361); both embeds use `!1s0x0%3A0x0!` (no place ID)
- **Why necessary:** two different pins for one business is a **NAP (Name/Address/Phone) inconsistency** — the primary trust signal for Google's local ranking and for customers who tap "Directions" and arrive somewhere else. A bare-coordinate pin also does not connect to the Business Profile listing, so the embed reinforces no entity. The two coordinates are ~13 km apart, so at least one of them is simply wrong.
- **Fix:** take the canonical coordinate **and Place ID** from the verified Google Business Profile, store them once in a single business-data module (GEO-01), and use them for both embeds and every "Directions" link. Replace the live embed with a **click-to-load facade** (static map image or styled placeholder that swaps in the iframe on tap) — the Maps embed pulls its own JS even with `loading="lazy"` and is among the largest third-party costs on the page. Keep `title` on the iframe (already correct ✅) and `referrerPolicy="no-referrer-when-downgrade"`.

### BLOCK-05 · Amharic must be indexable (and the UI must actually be bilingual)
- **Priority:** P0 · **Phase 0/1** · **Effort:** L · **Risk:** high (touches routing)
- **Where:** `src/lib/locale-context.tsx` (locale in `localStorage` only), `src/app/layout.tsx:26` (`<html lang="en">` hardcoded), every `src/app/*/page.tsx` (`"use client"` → cannot export `metadata`)
- **Why necessary:** for a bilingual Addis Ababa business this is the single biggest commercial risk in the plan:
  * Search engines and AI answer engines can only ever see the **English** site — Amharic content exists only after client-side hydration from `localStorage`, so it has no URL to index and no `hreflang` relationship.
  * Amharic users get a **flash of English**, then a blocking language modal (A11Y-02); the swap happens after hydration, which is where mobile users abandon.
  * Because the sub-pages are client components they cannot define `title`/`description`, so **all 7 pages share one title** — a classic duplicate-title problem.
  * Even the Amharic view is only *partly* translated: "Our Services", "View All Services", "Our Work", "Addis Ababa, Ethiopia", "Open Maps", "Toggle menu" and the gallery categories are hardcoded English inside bilingual pages (CODE-06).
- **Fix:** adopt the URL-based locale strategy in **SEO-03** (per-locale routes + `hreflang` + server-rendered `<html lang>`), which simultaneously fixes indexability, the English flash, hydration-mismatch risk and the shared-title problem (see **SEO-01**). Keep the language modal as a first-visit convenience that writes a cookie, not as the mechanism all localization depends on.

### BLOCK-06 · Prove image optimisation works on the deployment platform
- **Priority:** P0 · **Phase 0** · **Effort:** S · **Risk:** medium
- **Evidence:** `sharp@0.34.5` and `@img/sharp-win32-x64` are present in the pnpm store and optimisation works on this Windows machine, but `pnpm-workspace.yaml` sets `ignoredBuiltDependencies: sharp`, `node_modules/sharp` is not a top-level directory (Next resolves it transitively), and no deploy target is documented anywhere in the repo (no `vercel.json`, no `Dockerfile`, no CI config, no `engines`/`packageManager` field).
- **Why necessary:** every `next/image` request — including all remaining remote images — goes through `/_next/image`, which requires **sharp** at runtime. On a plain Node/VPS/Docker host, if the platform-specific optional binary (`@img/sharp-linux-x64` …) is missing or the install script was skipped, `/_next/image` returns 500 and **every image on the site breaks in production** while the build still passes locally. This is the classic "works on my machine, broken on the server" failure for this stack.
- **Fix:** decide and document the host (§12 Q1). If self-hosting: drop `sharp` from `ignoredBuiltDependencies` (or add `onlyBuiltDependencies: [sharp]`), add `sharp` as an explicit dependency, and use `output: 'standalone'` (OPS-03). Gate deployment on the OPS-05 check that requests a real `/_next/image?url=…&w=640&q=75` against `next start` and asserts `200` + `content-type: image/*`.

---

## 4. SPEED — payload, rendering and runtime

### SPEED-01 · Cut first-load JavaScript from 836 KB (261 KB gzip)
- **Priority:** P1 · **Phase 1** · **Effort:** L · **Risk:** medium
- **Where:** all `src/app/**/page.tsx`, `src/components/*`
- **Evidence:** `.next/server/app/index.html` references **12** JS chunks totalling **836.4 KB raw / 261 KB gzip**, including a 222 KB chunk containing `react-dom` and **five separate 125.8 KB chunks** of identical size (each containing `cva`/`clsx`, i.e. per-route client runtimes); `.next/static` = 2,147 KB across 35 files.
- **Why necessary:** mobile networks here are latency- and data-sensitive; 261 KB gzip of JS must be parsed and executed before the page becomes interactive. That drives TBT/INP and delays every conversion action (call / Telegram) on a site whose entire purpose is one-tap contact.
- **Fix, in order of value:**
  1. **Convert pages to Server Components**, keeping only interactive leaves as client components (same change as **SEO-01** — do it once). Static sections — `TrustSnapshot`, `WhyChooseUs`, `RealWorkGrid`, `MapSection`, `FinalCTAFooter` — then contribute **zero** JS.
  2. **`next/dynamic` the heavy interactive pieces** so they load only on demand: gallery lightbox `Dialog`, `LanguageModal`, the mobile `Sheet` nav (only used on tap), the Maps facade.
  3. **Delete the embla carousel from `/`** (CODE-04) — a client runtime for three static cards.
  4. No `optimizePackageImports` work needed: `lucide-react` is already in Next 16's default list (docs `…/01-next-config-js/optimizePackageImports.md`), so icon imports are tree-shaken.
- **Target:** `/` ≤ 300 KB raw / ≤ 110 KB gzip first-load JS; verify with `pnpm analyze` once OPS-05 exists.

### SPEED-02 · Stop shipping both languages of the dictionary (twice)
- **Priority:** P1 · **Phase 1** · **Effort:** M · **Risk:** low
- **Where:** `src/lib/locale-context.tsx` (statically imports `en.json` **and** `am.json`); chunks `0n0_fim4vrnce.js` (38.2 KB) and `0qm85efe-q97u.js` (38.0 KB)
- **Evidence:** `en` (10.2 KB source) and `am` (14.1 KB source) are both imported into a client module, and the resulting dictionary appears in **two** chunks that are **both** loaded by `/` — those bytes are duplicated across client boundaries.
- **Why necessary:** every visitor downloads both languages' copy although only one is ever rendered, and the duplication puts the same content twice in the critical path.
- **Fix:** (a) with SEO-03, resolve the dictionary server-side per route and pass only the active locale down; (b) if both must stay client-side, dedupe so the JSON lives in exactly one shared chunk; (c) flatten the dictionary **once** at module scope into a `Record<string,string>` instead of walking a nested object with a regex on every `t()` call (CODE-07).
- **Target:** −38 KB to −76 KB raw per page; dictionary present in exactly one chunk.

### SPEED-03 · Font strategy — trim weights, and give Amharic a real font
- **Priority:** P1 (Ethiopic) / P3 (weight trim) · **Phase 1** · **Effort:** S · **Risk:** low
- **Where:** `src/app/layout.tsx:7-11` (`Inter({ weight: ["400","500","600","700","800"] })`), `src/app/globals.css:10`, `src/components/hero-section.tsx:45` (`font-['Inter']`)
- **Evidence:** the compiled CSS has **35 Inter `@font-face` rules** (5 weights × 7 subsets) + 1 fallback-metric block. All 7 subset files are **shared across the 5 weights** (each referenced 5×), so a Latin visitor actually fetches ~47.3 KB (`latin`, preloaded) + ~25.2 KB (`latin-ext`) — raw font bytes are *acceptable*. Two real problems remain:
  * **Amharic has no font.** `subsets: ["latin"]` means every Amharic glyph renders from a system fallback (Noto Sans Ethiopic on Android; inconsistent or missing on some iOS/Windows builds → wrong metrics or tofu boxes). This is a **P1 correctness/UX defect for roughly half the audience** and it silently undermines the bilingual requirement.
  * `font-['Inter']` in the hero references a raw family name that is **not** what Next configures (Next exposes `--font-inter`); the utility is effectively a no-op that only works because the body already inherits Inter.
- **Fix:** add an Ethiopic-capable font wired to the Amharic locale — e.g. `Noto_Sans_Ethiopic({ subsets: ["ethiopic"], variable: "--font-ethiopic" })` applied when `lang="am"` (a self-hosted `localFont` subset is smaller and avoids the Google dependency). Replace `font-['Inter']` with the theme utility (`font-sans`) or register Inter in `@theme`. Optionally drop 1–2 unused weights after auditing usage — small CSS win, zero visual risk.

### SPEED-04 · Image pipeline configuration (`next.config.ts`)
- **Priority:** P1 · **Phase 1** · **Effort:** S · **Risk:** low (**read the docs first — several fields changed behaviour in 16**)
- **Where:** `next.config.ts` (today: only `remotePatterns` for 3 hosts)
- **What to add and why:**
  * **`formats`** — the Next 16 default is `['image/webp']`, so **AVIF is never served today**. `formats: ['image/avif','image/webp']` gives AVIF to browsers that accept it. ⚠️ Documented trade-off: AVIF encodes ~50 % slower, so the first (uncached) request is slower and cache storage doubles. Recommendation: keep WebP-only if the host is CPU-constrained (typical small VPS); enable AVIF on Vercel/edge or if there is headroom.
  * **`qualities`** — **required in Next 16** whenever a non-default `quality` is used (default allowlist `[75]`). A component `quality` is snapped to the nearest allowed value, and the REST endpoint returns **400** for an unlisted quality. If new hero images use `quality={70}`, you **must** declare `qualities: [70, 75]`.
  * **`minimumCacheTTL`** — defaults to just **14,400 s (4 h)**. Raise it only for remote/optimised images (e.g. 31 days). For the self-hosted photos from BLOCK-03, prefer **static imports**, which Next content-hashes and serves `immutable` — strictly better than TTL tuning.
  * **`deviceSizes` / `imageSizes`** — trim to the breakpoints the layout actually uses (2/3/4-column grids, max width `6xl`) to avoid generating and storing variants nobody requests.
  * **`remotePatterns`** — once images are self-hosted, remove `images.unsplash.com`, `plus.unsplash.com` and especially `encrypted-tbn0.gstatic.com`; leaving them allow-listed keeps the door open to uncontrolled third-party content.
- **Verify against:** `node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md` (sections `qualities`, `formats`, `minimumCacheTTL`, `deviceSizes`).

### SPEED-05 · Next 16 image API correctness (`priority` is deprecated)
- **Priority:** P1 · **Phase 1** · **Effort:** S · **Risk:** low
- **Where:** `src/components/global-header.tsx:95` (`priority`), `src/components/language-modal.tsx:38`
- **Evidence (docs):** `…/02-components/image.md` L291-293 — *"Starting with Next.js 16, the `priority` property has been deprecated in favor of the `preload` property in order to make the behavior clear."* The same doc says `loading="eager"` or `fetchPriority="high"` should usually be preferred over `preload`, and that `preload` is appropriate when the image is the LCP element.
- **Why necessary:** this is exactly the class of breaking change `AGENTS.md` warns about. The deprecated prop still works today, but it is what emits the `<link rel="preload" as="image">` in the compiled head — currently pointed at the wrong asset (the 1.9 MB logo, BLOCK-01).
- **Fix:** remove `priority`; apply `preload` (or `loading="eager"` + `fetchPriority="high"`) **only** to the true above-the-fold LCP image (the hero from BLOCK-03), and let everything else — including the logo once it is no longer the LCP element — load lazily (the default).
- **Also verify:** any `quality` you add matches `images.qualities` (SPEED-04), otherwise the value is silently snapped and your size assumptions are wrong.

### SPEED-06 · Gallery and work-grid images are the wrong size, and partly duplicated
- **Priority:** P1 · **Phase 2** · **Effort:** M · **Risk:** low
- **Where:** `src/app/gallery/page.tsx:22-35`, `src/components/real-work-grid.tsx:18-31`, `src/lib/constants.ts` (`GALLERY_IMAGES`)
- **Evidence:** 12 gallery tiles are built from only **9 unique image URLs** (`photo-1487754180451`, `photo-1625047509168`, `photo-1530046339160` each appear twice); all sources are `w=400` remote JPEGs; the tile aspect is faked with `height={i % 3 === 0 ? 300 : 250}`; the lightbox then renders that same 400 px source at `width={800}` with `sizes="100vw"` — an upscaled, soft "zoom".
- **Why necessary:** a 2-column mobile grid needs ~800 px images at 2× DPR, so today's 400 px sources are either soft (browser upscale) or mismatched (Next upscale = wasted bytes). The fabricated heights distort the real photos and break honest CLS math. Duplicate tiles waste optimisation CPU and read as padding rather than a portfolio — and this gallery is the primary proof-of-work for a repair business.
- **Fix:** curate 9–12 **unique, real** workshop photos as static imports at 2× display size (WebP/AVIF), record each file's true `width`/`height`, give every tile an accurate `sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"`, and give the lightbox its own larger source so zoom is genuinely high-resolution.
- **Also fix (same files):** the category badge prints the raw key (`engine`, `transmission`) — localize it (CODE-06).

### SPEED-07 · Header scroll handler re-renders on every scroll tick
- **Priority:** P2 · **Phase 2** · **Effort:** S · **Risk:** low
- **Where:** `src/components/global-header.tsx:33-75`
- **Evidence:** the `scroll` listener calls `setIsScrolled(...)` unconditionally and may also call `setIsVisible(...)` — up to two state updates per scroll event, plus a `setTimeout` for the hide delay.
- **Why necessary:** each state change re-renders the header subtree (including the `Sheet` and the `Image`); on low-end Android this reads as scroll jank and worsens INP — and the header is on every page.
- **Fix:** move the work into a `requestAnimationFrame` callback, guard every `setState` with an actual-change check, and read `window.scrollY` once per frame. Alternatively keep one boolean and toggle a `data-*` attribute, letting CSS drive the transition. Add `content-visibility: auto` + `contain-intrinsic-size` to long below-the-fold sections.

### SPEED-08 · Cache headers for non-hashed assets + transport settings
- **Priority:** P2 · **Phase 2** · **Effort:** S · **Risk:** low
- **Why necessary:** Next serves `_next/static/*` with immutable caching automatically, but files in `public/` are **not** content-hashed, so they are re-validated more often than necessary. Any icon, OG image or `public/` asset you keep (BLOCK-02) is affected.
- **Fix:** add a `headers()` rule giving content-stable image/icon paths `Cache-Control: public, max-age=31536000, immutable` (version the filename when the content changes), and leave HTML/`/_next/image` on Next's defaults. If any remote image host survives BLOCK-03, add `<link rel="preconnect">` for it — not needed for `next/font`, which self-hosts.
- **Deployment note:** enable **Brotli + HTTP/2** at the proxy/CDN. Brotli is typically 15–20 % smaller than the gzip figures in §2, and HTTP/2 removes meaningful per-request overhead given the current chunk count.

---

## 5. SEO — technical and on-page

### SEO-01 · Pages must be Server Components so they can own their metadata
- **Priority:** P0 · **Phase 1** · **Effort:** L · **Risk:** medium
- **Where:** `src/app/{about,contact,faq,gallery,services}/page.tsx` and `src/app/page.tsx` — every one starts with `"use client"`
- **Evidence (docs):** `…/01-app/01-getting-started/14-metadata-and-og-images.md` L27 — *"The `metadata` object and `generateMetadata` function exports are only supported in Server Components."* Consequence: the **only** metadata in the app is the single `title` + `description` in `src/app/layout.tsx:13-17`, shared by all 7 routes.
- **Why necessary:** seven pages sharing one title and one description is a textbook duplicate-metadata problem: it suppresses click-through from search results, prevents Google from matching a query to the right page, and gives Telegram/WhatsApp a single generic preview for every URL. It also blocks SEO-02, SEO-05 and GEO-01, all of which need a server render.
- **Fix:** convert each route's page to a Server Component, moving only the interactive parts (`LanguageModal`, gallery filter tabs + lightbox, mobile sheet) into small client leaves that receive translated strings as props. Then per route: `export const metadata` (static pages) with a unique `title`, `description`, `alternates.canonical` — and add `title.template` in the root layout, e.g. `"%s | SAMI Auto Service — Addis Ababa"`. This single refactor also delivers most of SPEED-01.

### SEO-02 · `metadataBase`, canonical URLs, Open Graph and Twitter cards
- **Priority:** P1 · **Phase 1** · **Effort:** M · **Risk:** low
- **Where:** `src/app/layout.tsx` (metadata block is title + description only)
- **Why necessary:**
  * Without **`metadataBase`** Next cannot resolve relative OG-image URLs, and canonical/`og:url` values are ambiguous → duplicate-content risk between `localhost`, preview URLs and the production domain.
  * Without **`alternates.canonical`** a page reached by any variant URL competes with itself.
  * Without **Open Graph data**, every share of the site's *primary conversion channel* (Telegram) shows a bare link with no title, description or image. The link preview is often the deciding factor in whether a stranger taps it — this is a direct revenue gap, not a nicety.
  * Without **Twitter cards** the same is true on X/WhatsApp link unfurls.
- **Fix:** introduce `SITE_URL` (OPS-04), set `metadataBase: new URL(SITE_URL)`, add root OG defaults (`og:type=website`, `og:site_name`, `og:locale=en_US`, `og:locale:alternate=am_ET`, a real 1200×630 image), `twitter: { card: 'summary_large_image' }`, `robots` defaults, and verification tokens for Search Console / Bing (SEO-08). Add a designed `app/opengraph-image` (static PNG, or `opengraph-image.tsx` with `ImageResponse` from `next/og` — docs `…/metadata/opengraph-image.md`) showing the logo, phone number and city.

### SEO-03 · Language/URL strategy and `hreflang` (the Amharic visibility fix)
- **Priority:** P0 · **Phase 1** · **Effort:** L · **Risk:** high (routing change — see BLOCK-05)
- **Where:** `src/lib/locale-context.tsx`, `src/app/layout.tsx:26`, all routes
- **Why necessary:** explained in BLOCK-05 — today Amharic has no URL, no `lang`, no `hreflang` and no indexable existence. Without this item the site is, in search terms, an English-only business serving a substantially Amharic-speaking market.
- **Options (decide in §12 Q2):**
  1. **Recommended — segment routing** `app/[locale]/…` (e.g. `/en/…`, `/am/…`) with the dictionary resolved on the server, `generateStaticParams` for both locales, `<html lang>` set per route, `x-default` + `en` + `am` in `alternates.languages`, and the language switcher navigating between URLs (writing a cookie so first-visit choice is remembered). Best indexability and no client-only content.
  2. **Query-param localization** (`?lang=am`) + server-read cookie + `alternates.languages`. Cheaper change, indexable if you are careful with canonical/hreflang, but weaker signal and easy to get wrong.
  3. **English-only canonical site** with the client language switch kept as a UX convenience (current behaviour, lightly fixed). Accept that Amharic is invisible to search.
- **Acceptance (option 1):** `curl /am/services | grep 'lang="am"'` returns the tag; every page emits `<link rel="alternate" hreflang="am|en|x-default">`; no hydration mismatch warnings; the English flash is gone.

### SEO-04 · `robots.txt`, `sitemap.xml`, manifest and custom 404
- **Priority:** P1 · **Phase 1** · **Effort:** M · **Risk:** low
- **Where:** none of these files exist (`app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`, `app/not-found.tsx`)
- **Why necessary:**
  * With no sitemap, a brand-new low-authority domain in a competitive local niche depends entirely on internal links; submission to Google Search Console / Bing Webmaster Tools also expects it. With two locales (SEO-03) the sitemap is how you declare the `hreflang` cluster.
  * `robots.txt` should point crawlers at the sitemap and state your AI-crawler policy deliberately (GEO-04).
  * There is currently **no custom 404** (the build only emits Next's default `_not-found`). A dead-end 404 on a lead-generation site throws away a visitor who was already looking for you — a branded, localized 404 that repeats the Call / Telegram / Directions stack converts instead.
- **Fix:** `app/sitemap.ts` returning all routes × locales with `lastModified`, `changeFrequency`, `priority` and `alternates.languages`; `app/robots.ts` with `sitemap: ${SITE_URL}/sitemap.xml` and explicit allow/deny rules; `app/manifest.ts` (also fixes BLOCK-02); `app/not-found.tsx` (server component) reusing the existing CTA components; optionally `app/error.tsx` + `app/global-error.tsx` (OPS-06).

### SEO-05 · Structured data (JSON-LD) is entirely missing
- **Priority:** P1 · **Phase 1** · **Effort:** M · **Risk:** low
- **Where:** no JSON-LD anywhere in the codebase
- **Why necessary:** structured data is how you tell search engines (and AI answer engines) what the business *is*: a repair shop at a specific address, with specific hours, phone and services. It powers local pack eligibility signals, service/FAQ understanding, and rich results. It is also the machine-readable layer required for GEO-01 and GEO-A1.
- **Fix (in priority order):**
  1. **`AutoRepair` / `LocalBusiness`** (root layout, once) — see GEO-03 for the required fields.
  2. **`BreadcrumbList`** per sub-page (helps Google display the hierarchy).
  3. **`FAQPage`** on `/faq` — you already have 6 genuine Q&A pairs (1 real plus the per-category items). ⚠️ Be realistic: Google has restricted FAQ rich results, so the main benefit now is *comprehension by search/AI systems*, not guaranteed FAQ snippets. Emit it anyway; it is cheap and correct.
  4. **`HowTo`** for the repair process — `WORKFLOW_STEPS` in `src/lib/constants.ts` is already a clean 4-step sequence (Inspection → Diagnosis → Repair → Final Check); it needs localized copy and a `HowTo` block.
  5. **`Service`/`Offer`** items for each service category with `areaServed: Addis Ababa` and `provider` referencing the business entity (GEO-04).
- **Implementation note:** keep the schema in one typed module (e.g. `src/lib/schema.ts`) that consumes the single business-data object from GEO-01, and render it with a `<script type="application/ld+json">` in a server component. Validate with Google's Rich Results Test and the Schema Markup Validator before launch — an invalid block is worse than none.

### SEO-06 · Keyword-mapped headings and translated labels
- **Priority:** P1 · **Phase 1** · **Effort:** M · **Risk:** low
- **Where:** `src/components/hero-section.tsx:44-49` (H1), `services-carousel.tsx:25` ("Our Services"), `real-work-grid.tsx:14` ("Our Work"), `gallery/page.tsx:137-139` (raw category badge)
- **Evidence:** the home H1 is the brand-generic tagline "Reliable Auto Repair You Can Trust" (from `hero.tagline`), with no city or service terms anywhere in a heading; sub-page H2s are generic; the gallery lightbox badge prints the raw category key.
- **Why necessary:** an H1 is the strongest on-page relevance signal you control. "Reliable Auto Repair You Can Trust" could belong to any garage on earth; a searcher (and an AI answer engine) looking for *"car mechanic Addis Ababa"* has no heading to match. This is a low-effort, high-leverage change on top of the SEO-01 refactor.
- **Fix:** restructure so the H1 carries the intent and the trust line sits as a sub-heading, e.g. H1 **"Auto Repair & Mechanical Service in Addis Ababa"** + existing tagline as the supporting line; give each service category an H2 like "Engine Repair in Addis Ababa"; localize the gallery category labels and write **descriptive alt text** that names the service and the city. Keep it natural — modern search and AI systems penalize obvious keyword stuffing, so one clear intent per heading and genuine copy is the goal.

### SEO-07 · Analytics, Search Console and conversion tracking
- **Priority:** P1 · **Phase 1** · **Effort:** M · **Risk:** low
- **Where:** no analytics, no `useReportWebVitals`, no verification meta tags anywhere
- **Why necessary:** the site's only purpose is generating calls and Telegram messages, and right now **nothing measures whether that happens** — you cannot know which page, heading or CTA produces leads, whether the site is actually indexed, or whether a deployment regressed Core Web Vitals. Every other item in this plan is validated by this one.
- **Fix:** (a) verify the domain in **Google Search Console** + **Bing Webmaster Tools** and submit the sitemap; (b) add a lightweight analytics choice — Vercel Analytics/Speed Insights if hosted there, otherwise GA4 via `next/script` with `strategy="afterInteractive"`; (c) instrument the three conversion actions (`tel:`, Telegram, Maps) with an `onClick` that fires an event (`contact_click` with a `method` parameter) — this requires the CTA buttons to be client components, so plan it during the SEO-01 refactor; (d) enable `useReportWebVitals` to log LCP/CLS/INP so §11 targets are measurable.
- **Budget guard:** keep analytics under ~15 KB gzip or load it on first interaction, otherwise it eats the SPEED-01 savings.

### SEO-08 · Prevent preview/staging URLs from being indexed
- **Priority:** P2 · **Phase 2** · **Effort:** S · **Risk:** low
- **Why necessary:** once `metadataBase` and a sitemap exist, a staging or preview deployment can be crawled and compete with production, and `localhost`/preview hosts can leak into canonical tags. This is a common and expensive self-inflicted SEO wound.
- **Fix:** make `robots`/canonical generation depend on an environment flag (e.g. `VERCEL_ENV` or a local `DEPLOY_ENV`) so non-production returns `robots: { index: false, follow: false }` and an absolute canonical pointing at the production domain. Also confirm `trailingSlash` behaviour stays consistent (currently the Next default, `false`) and that no query-string variants are indexable after SEO-03.

---

## 6. GEO — local/geo-targeted search **and** generative engine optimization

> The word "GEO" is used two ways in 2026, and this codebase needs both. **Group L** covers *geographic* search (local pack, Maps, proximity, suburb intent). **Group A** covers *generative engine optimization* (being cited by ChatGPT/Perplexity/Gemini/AI Overviews). They share the same foundation: a single, machine-readable, factual description of the business — which is exactly what the site lacks today.

### GEO-L1 · One source of truth for business data (NAP)
- **Priority:** P0 · **Phase 0/1** · **Effort:** S · **Risk:** low
- **Where:** `src/lib/constants.ts` (phone `+251911234567` — a **placeholder**; `TELEGRAM_LINK = https://t.me/samiautoservice` — placeholder; `MAPS_LINK` — a share link, not a directions link); hardcoded "SAMI Auto Service" / "Addis Ababa, Ethiopia" in `src/components/map-section.tsx:31-32`; two different map coordinates (BLOCK-04)
- **Why necessary:** local ranking is driven by **NAP consistency** (Name, Address, Phone) across your site, your Google Business Profile and every citation. Right now the site publishes a placeholder phone number, a city with no street address, no postal code, and two conflicting coordinates. A customer who tries to call gets a dead number — the single most damaging possible defect for a lead-generation site — and Google has no reliable entity to rank. This item is the backbone that BLOCK-04, GEO-L2, GEO-L3 and SEO-05 all consume.
- **Fix:** create `src/lib/business.ts` exporting one frozen object: legal + trading name, street address, sub-city/city/region, postal code, country, `latitude`/`longitude` to 7 decimals, phone in **E.164** (`+2519…`) *and* a display format, Telegram, email, hours per weekday, Google Business Profile URL + Place ID, the canonical maps/directions URL(s), and service languages. Add an env override for the phone/URLs (OPS-04). Replace **every** hardcoded occurrence and derive `tel:`, Telegram, directions, JSON-LD, footer, contact page and `sitemap`-adjacent metadata from it.
- **Acceptance:** one `grep` for the phone number pattern returns hits in exactly one file; a real call works from a real phone.

### GEO-L2 · Align the site with the Google Business Profile
- **Priority:** P0 · **Phase 1** · **Effort:** M · **Risk:** low (mostly off-site work)
- **Why necessary:** for "near me" and map-pack queries the Business Profile is the dominant ranking surface — the website supports it, it does not replace it. An unclaimed, incomplete or inconsistent profile caps local performance no matter how good the site is.
- **Fix:** claim/verify the profile; set the primary category to *Auto repair shop* (plus relevant secondaries such as *Car repair and maintenance service*); add the exact same address/phone/hours as GEO-L1 (Mon–Sat 08:00–18:00, Sunday closed — matching `contact.hours.*`); upload 10+ genuine workshop photos (the same ones used on the site); enable messaging; and post the same Telegram/directions links the site uses. Then reference the profile in the site's `sameAs` (GEO-L3).

### GEO-L3 · `AutoRepair`/`LocalBusiness` JSON-LD with geo coordinates
- **Priority:** P1 · **Phase 1** · **Effort:** M · **Risk:** low
- **Why necessary:** this is the machine-readable statement that turns "a website with an address" into *an entity with a location*, which is what local packs and AI answer engines resolve against. Combined with `openingHoursSpecification` it also feeds "open now"-type answers — high-intent queries that currently cannot be answered from this site at all.
- **Fix:** emit one `AutoRepair` (a `LocalBusiness` subtype) node from the root layout, generated from `src/lib/business.ts`:
  `name`, `image`, `logo`, `url`, `telephone`, `email`, `priceRange`, `currenciesAccepted`, `address` (`PostalAddress` with street + city + region + postal code + country), `geo` (`GeoCoordinates` with the verified lat/lng), `hasMap`, `areaServed` (Addis Ababa + named sub-cities), `openingHoursSpecification` (`Mo–Sa 08:00–18:00`), `sameAs` (GBP, Telegram), `knowsLanguage: ['en','am']`, `makesOffer`/`hasOfferCatalog` (service categories from `servicesPage.categories`), and `aggregateRating`/`review` **only if** genuine, verifiable reviews exist — fabricated ratings risk a manual action that would undo everything else in this plan.
- **Verify:** Google Rich Results Test + Schema Markup Validator, both zero errors, before launch.

### GEO-L4 · Area/landmark copy (how people actually search here)
- **Priority:** P1 · **Phase 2** · **Effort:** M · **Risk:** low
- **Why necessary:** local intent is expressed by *area*, not by "near me" alone: "car mechanic Bole", "garage near Meskel Square", "auto electrician Yeka". The site says "Addis Ababa, Ethiopia" once and never names a district, street or landmark — so there is nothing for a locality query to match, in either language.
- **Fix:** add a short, honest **"Areas we serve"** section listing the sub-cities you genuinely serve (Bole, Yeka, Kirkos, Nifas Silk-Lafto, Arada, Gulele…), plus landmark/direction hints in the Contact copy. Add `areaServed` to the schema (GEO-L3). Keep it factual and readable — one paragraph plus a list, not a stuffed block of place names (which reads as spam to search and AI systems alike).

### GEO-L5 · Directions CTA everywhere it belongs
- **Priority:** P1 · **Phase 1** · **Effort:** S · **Risk:** low
- **Where:** `src/components/final-cta-footer.tsx:3-5` — imports `MapPin` and `MAPS_LINK` and **never uses them** (lint-flagged), so the footer conversion zone has Call + Telegram but **no Directions**, which `design.md` §Page 1 requires; `src/components/map-section.tsx:40-43` has an "Open Maps" button with a hardcoded English label
- **Why necessary:** "can I find it and park?" is a real purchase-decision question for a physical garage, and a directions tap is the strongest walk-in intent signal you can measure. A missing Directions action in the footer is a functional gap against your own design spec.
- **Fix:** add the Directions action to the footer (removing the unused imports in the process), source it from `src/lib/business.ts`, and use a **turn-by-turn** URL for navigation intent — `https://www.google.com/maps/dir/?api=1&destination=<lat>,<lng>` — keeping the plain share link for social/`sameAs`. Keep `target="_blank" rel="noopener noreferrer"` (already this codebase's pattern ✅) and localize the label (CODE-06).

### GEO-L6 · Reviews, freshness and the trust loop
- **Priority:** P2 · **Phase 2+** · **Effort:** M · **Risk:** medium (needs process, not just code)
- **Why necessary:** beyond proximity and relevance, local ranking and conversion are driven by the **volume and recency of genuine reviews**. A garage with 40 recent reviews outranks an equivalent one with 3, regardless of code quality. The site shows zero social proof today — no quotes, no counts, no dates — while the competitor set will have them.
- **Fix (process + code):** ask every customer for a Google review at handover (printed QR/`g.page` short link); surface 2–3 genuine, attributed quotes with dates on `/about` or the home trust area; keep on-site claims consistent with the profile. Only then consider `Review`/`AggregateRating` schema (GEO-L3), and only with verifiable data.

### GEO-A1 · Make the site quotable by AI answer engines
- **Priority:** P2 · **Phase 2** · **Effort:** M · **Risk:** low
- **Why necessary:** AI assistants answer "where can I fix my car in Addis Ababa" and cite sources they can extract structured facts from. This site offers conversational copy, one generic title, no schema, no explicit prices and no hours in text — little for a model to quote or trust. Note the good news: each route **is** prerendered (verified: `/about` is 26.7 KB of HTML), so the text is already crawlable — the gap is structure and specificity, not rendering.
- **Fix:** (a) finish SEO-01/SEO-05 so facts are server-rendered and machine-readable; (b) add a compact **"Key facts"** block near the top of Home/Contact (address, phone, hours, languages, services, payment) as plain text a model can lift verbatim; (c) lead each section with the direct answer ("Engine diagnostics: same day, 500–1,500 ETB, no appointment required") and place the persuasion after it; (d) give each service its own heading and anchor.

### GEO-A2 · Fit the answer formats AI engines use
- **Priority:** P3 · **Phase 3** · **Effort:** M · **Risk:** low
- **Why necessary:** generative engines favour content already shaped as question→answer, stepwise or comparison. You already have two of the three: the FAQ accordion (Q→A) and the 4-step repair process (`WORKFLOW_STEPS`).
- **Fix:** expose both as schema (`FAQPage`, `HowTo` — SEO-05), keep the visible copy matching the schema exactly (models cross-check), and ensure accordion content is server-rendered rather than only on expand (SPEED-01). Add a table of typical durations/prices once the owner approves publishing price ranges — price transparency is a strong citation magnet for local queries.

### GEO-A3 · `llms.txt` (experimental, cheap)
- **Priority:** P3 · **Phase 3** · **Effort:** S · **Risk:** low
- **Why necessary:** a growing number of AI crawlers look for `/llms.txt` (and `/llms-full.txt`) as a curated, machine-friendly summary. No standard guarantees consumption, but the cost is one static file.
- **Fix:** add `public/llms.txt` with business name, one-line description, city, address, phone, Telegram, hours, languages, the service categories and absolute URLs for the main pages in both locales. Keep it factual, readable Markdown — LLMs parse it as text.

### GEO-A4 · Decide the AI-crawler policy explicitly in `robots.ts`
- **Priority:** P2 · **Phase 1** · **Effort:** S · **Risk:** low
- **Why necessary:** the default is ambiguous and crawler user-agents change frequently. For a local service business with no content moat, being *absent* from AI answers is a bigger risk than being summarized by them — but that should be a decision, not an accident.
- **Fix:** in `app/robots.ts`, explicitly `Allow` the agents you want (`Googlebot`, `Bingbot`, `Google-Extended`, `GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `Applebot-Extended`) and `Disallow` only what genuinely needs protecting. Record the reasoning in a comment so a future maintainer does not silently reverse it.

### GEO-A5 · Content depth is the real long-term lever (plan it as a project)
- **Priority:** P3 · **Phase 3+** · **Effort:** XL · **Risk:** low
- **Evidence:** the entire site is one page per section, ~1,800 words, with **no dedicated URL per service** — all service content lives inside a single `/services` page.
- **Why necessary:** competitors ranking for "car AC repair Addis Ababa" or "transmission repair cost Addis Ababa" generally have one focused page per service plus practical content. Seven pages cannot out-rank them on breadth, and AI engines have few specific, quotable pages to cite.
- **Fix (roadmap, not a sprint):** one indexable page per service (Engine, Transmission, Suspension, Brakes, AC, Electrical, Diagnostics), each with a unique H1/description/`Service` schema, a duration/price table, 2–3 photos and an FAQ block; then 3–5 practical guides ("5 signs your brakes need replacing in Addis traffic"). Confirm any price or turnaround claim with the owner before publishing.

---

## 7. OPS — deployment, security and operations

### OPS-01 · Security headers and hardening
- **Priority:** P1 · **Phase 2** · **Effort:** M · **Risk:** medium (a wrong CSP breaks the Maps embed)
- **Where:** `next.config.ts` (no `headers()`, no `poweredByHeader` setting)
- **Why necessary:** this is a public, unauthenticated marketing site; the realistic risks are clickjacking/embedding, MIME sniffing, referrer leakage and third-party injection via the Maps iframe. The standard headers are cheap and expected of a production site, and a CSP limits the blast radius if a third-party script is ever compromised. Trivial now, painful later.
- **Fix (in order):** `poweredByHeader: false`; `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; `Permissions-Policy` disabling geolocation/camera/microphone; `X-Frame-Options: SAMEORIGIN` (or `frame-ancestors`); HSTS **at the host/proxy**. For CSP, allow `frame-src https://www.google.com`, `img-src 'self' data: blob:` plus any remaining image hosts, `script-src 'self'` — but Next injects inline bootstrap scripts, so a strict `script-src` needs nonces/hashes and a mistake blanks the page. Treat CSP as its own verified step: ship in **report-only** first, confirm zero violations, then enforce.

### OPS-02 · Choose and configure the deployment target
- **Priority:** P0 · **Phase 0** (decision) · **Effort:** M · **Risk:** medium
- **Where:** no `vercel.json`, no `Dockerfile`, no CI workflow, no `output` setting, no `engines`, no `packageManager`
- **Why necessary:** BLOCK-06 cannot be resolved without this decision, and several items (AVIF vs WebP, Brotli, immutable caching, image-cache location) depend on whether a CDN fronts the app. Deploying an undecided Next.js 16 app to a shared host is how the sharp failure reaches production.
- **Fix:**
  * **Vercel (lowest effort):** nothing to configure beyond env vars; add Vercel Analytics (SEO-07) + Speed Insights. Recommended for a small team — it removes the sharp risk entirely.
  * **Node VPS (local/EU host):** add `output: 'standalone'`, ship `sharp` as an explicit dependency, run behind nginx/Caddy with Brotli + HTTP/2 + proxy caching for `/_next/static` and `/_next/image`, and **forward the `Accept` header** (required for format negotiation per the image config docs). Keep the image cache on disk and watch its size if AVIF is enabled.
  * **Container:** multi-stage `Dockerfile` producing the standalone output; document the platform-specific sharp binary for the build vs runtime stage architecture.
- **Acceptance:** a committed deployment runbook (host, Node version, env vars, proxy config, rollback command).

### OPS-03 · Environment variables and a reproducible build
- **Priority:** P1 · **Phase 1** · **Effort:** S · **Risk:** low
- **Why necessary:** `SITE_URL` (SEO-02), the phone/Telegram/GBP identifiers (GEO-L1) and any analytics IDs must differ between local, staging and production; today they are literals in source. `.gitignore` already excludes `.env*` ✅ but there is no `.env.example`, and `package.json` has neither `engines` nor `packageManager`, so CI can silently use a different pnpm/Node than this machine — a classic "works locally, fails in CI" trap on Tailwind v4 + Next 16.
- **Fix:** add `.env.example` documenting every variable with non-secret placeholders; validate required vars at startup (a small `src/lib/env.ts` that throws a clear error in production if `SITE_URL` is missing); add `"packageManager": "pnpm@<exact>"` and `engines.node`; run CI installs with `--frozen-lockfile`.

### OPS-04 · Pre-deploy QA gate (automate the checks in this document)
- **Priority:** P1 · **Phase 1** · **Effort:** M · **Risk:** low
- **Why necessary:** this plan asks for structural changes to routing, rendering and images; without an automated gate, regressions land silently. Note that `pnpm lint` is **already red** (CODE-01), so "lint passes" is not yet a usable gate.
- **Fix:** add scripts + a CI job running, in order: `pnpm lint` → `tsc --noEmit` → `pnpm build` → start the server → assertions:
  1. `curl -sI "/_next/image?url=%2Fimages%2Fhero.webp&w=640&q=75"` returns `200` + `content-type: image/*` (**BLOCK-06**).
  2. No preloaded asset exceeds 60 KB (**BLOCK-01**).
  3. Every route returns 200 and contains its own `<title>` (**SEO-01**).
  4. `/am/…` returns `<html lang="am">` and `hreflang` links (**SEO-03**).
  5. Lighthouse CI (`@lhci/cli` or `unlighthouse`) on `/`, `/services`, `/gallery`, `/contact` with budgets: LCP < 2.5 s (Slow 4G), CLS < 0.1, TBT < 200 ms, transfer < 1 MB.
  6. `@next/bundle-analyzer` (`pnpm analyze`) to defend the SPEED-01 JS budget.
- **Note:** run Lighthouse against a **production** build (`next start`), in incognito — dev-mode numbers are meaningless here.

### OPS-05 · Error boundaries, monitoring and uptime
- **Priority:** P1 · **Phase 2** · **Effort:** S · **Risk:** low
- **Why necessary:** there is no `app/error.tsx` or `app/global-error.tsx` and no monitoring of any kind. A client exception currently surfaces as Next's default error UI, and an outage or broken deploy would go unnoticed until a customer complains. For a business whose only channels are the site and the phone, silent downtime is direct lost revenue.
- **Fix:** add a localized `app/error.tsx` + `app/global-error.tsx` (both rendering the Call/Telegram/Directions stack so even an error page converts), plus an uptime monitor checking `/` and `/contact` every minute with alerts to the owner's phone/Telegram. Add lightweight error reporting only if you accept the bundle cost (SEO-07 has the budget guard).

### OPS-06 · Dependency and repo hygiene
- **Priority:** P2 · **Phase 2** · **Effort:** S · **Risk:** low
- **Actions:**
  * `next-themes` and `sonner` are dependencies used **only** by `src/components/ui/sonner.tsx`, which nothing imports → remove all three (CODE-02).
  * `shadcn` is a runtime dependency because `src/app/globals.css:3` does `@import "shadcn/tailwind.css"` — it is needed at **build** time. Keep it available to the build stage; if you move it to `devDependencies`, verify the production build in CI, since hosts that prune dev deps before building are a common failure mode.
  * Pin the toolchain (OPS-03) and never deploy without `--frozen-lockfile`.
  * Confirm licence/compatibility for `lucide-react@^1.23`, `@base-ui/react@^1.6`, `react@19.2.4` — this is a commercial client site, so licence review belongs in the release checklist.
  * Commit this plan and rewrite `README.md`: it is still the create-next-app boilerplate and advertises **Geist** while the app uses **Inter** — misleading for the next developer.

---

## 8. A11Y — accessibility and mobile conversion

### A11Y-01 · Primary tap targets are below the project's own spec
- **Priority:** P1 · **Phase 1** · **Effort:** S · **Risk:** low
- **Where:** `hero-section.tsx:64,73` (`h-10`), `final-cta-footer.tsx:25,34` (`h-10`), `map-section.tsx:40`, `services-carousel.tsx:66`, `sticky-conversion-tray.tsx:16-42`
- **Evidence:** `design.md` §Layout Rules mandates a **48–56 px** button height "to comply with the standard mobile thumb-tap zone, preventing user misclicks during high-intent scroll speeds". Every primary CTA is `h-10` = **40 px**.
- **Why necessary:** the most important interaction on the site (tap to call) is 8–16 px smaller than the design's own thumb-zone standard, and `sticky-conversion-tray` — the "never more than 1 tap from contact" mechanism — has small icon+label targets. Mis-taps on a moving bus or in a garage do not just annoy; they lose the lead. This is also a WCAG target-size concern.
- **Fix:** set primary CTAs to `h-12` (48 px) and ensure the tray's three targets have ≥44×44 px hit areas with adequate spacing. Verify with a real thumb on a real phone, not a desktop browser resized.

### A11Y-02 · The language modal is not a dialog
- **Priority:** P1 · **Phase 1** · **Effort:** S · **Risk:** low
- **Where:** `src/components/language-modal.tsx:33-91`
- **Evidence:** a plain `div` at `z-[100]` with `bg-black/80 backdrop-blur-sm` — no `role="dialog"`, no `aria-modal`, no focus trap, no Escape handling, no focus moved into it. It also renders only after hydration (`if (!localeLoaded) return null`), so assistive tech may already be reading the English page behind it.
- **Why necessary:** keyboard and screen-reader users can tab into the page *behind* the modal and interact with invisible content; there is no keyboard way to dismiss it; and the modal is the first thing most visitors meet, so it defines their impression of the site's quality. It also risks being treated as an intrusive interstitial on mobile — a language selector is often tolerated, but a blocking overlay that appears late is the worst possible presentation of one.
- **Fix:** rebuild it on the existing `Dialog` primitive (`src/components/ui/dialog.tsx`), which already provides focus trap, Escape and ARIA via `@base-ui/react`. With SEO-03 (server-known locale) it can render server-side for visitors without a locale cookie, removing the delayed overlay entirely. Ensure `aria-labelledby` points at the heading and that the two choices have clear accessible names.

### A11Y-03 · Header logo box contradicts its own dimensions
- **Priority:** P2 · **Phase 1** · **Effort:** S · **Risk:** low
- **Where:** `src/components/global-header.tsx:90-97`
- **Evidence:** `width={40} height={40}` with `className="size-20 object-contain"` (80 px) inside a `h-14` (56 px) flex row.
- **Why necessary:** the declared intrinsic size and the rendered size disagree, so the reserved space does not match what is painted — a layout-shift risk and a visual overflow, and it makes the LCP calculation unreliable. Combined with BLOCK-01 this is the single most consequential line in the header.
- **Fix:** render the logo at its true display size (32–36 px in a 56 px bar), keep `width`/`height` in sync with the CSS box, and pair with BLOCK-01/SPEED-05 so the right (small) asset is preloaded.

### A11Y-04 · What is already good (do not regress it)
- **Priority:** — · **Effort:** — · **Risk:** —
- Honest inventory so the refactor does not undo working behaviour: every page has a `<main>`; the header nav has `aria-label="Main"` and the mobile nav `aria-label="Mobile"`; the sticky tray is `<nav aria-label="Quick actions">`; the trust chips use `role="list"`/`role="listitem"`; gallery tiles are real `<button>`s with `focus:ring`; the map iframes have `title`; decorative overlays are `aria-hidden`; external links carry `rel="noopener noreferrer"`; images have `alt` text. **Preserve all of these when converting pages to Server Components (SEO-01).**

### A11Y-05 · Honour `prefers-reduced-motion`
- **Priority:** P2 · **Phase 2** · **Effort:** S · **Risk:** low
- **Where:** `global-header.tsx:79` (slide transition), `real-work-grid.tsx:27` and `gallery/page.tsx:134` (`group-hover:scale-105`), global transition durations
- **Why necessary:** some users experience motion-triggered discomfort, and the OS setting exists precisely to express that. It is a small, standard, low-risk compliance win.
- **Fix:** add one global block in `globals.css` — `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }` — plus keep the header's show/hide functional without the tween.

### A11Y-06 · Decide explicitly about a contact form (do not drift into it)
- **Priority:** P3 · **Effort:** M (if pursued) · **Risk:** medium
- **Context:** `COMPONENT_PLAN.md` lists `Input`/`Textarea` and the repo ships `ui/input.tsx` + `ui/textarea.tsx`, but no form exists. The design's mobile-first funnel deliberately uses Call + Telegram instead.
- **Why it matters:** an unused form is a maintenance question, not a defect — but if a form *is* ever added it introduces a backend surface: Server Action with server-side validation, spam/abuse protection (honeypot + rate limit), a delivery mechanism (email/Telegram bot), privacy/consent wording and error states. Scope it deliberately or delete the unused inputs (CODE-02) so the repo reflects reality.

---

## 9. CODE — correctness, i18n and maintainability

### CODE-01 · Lint is red (3 errors, 12 warnings)
- **Priority:** P1 · **Phase 1** · **Effort:** S · **Risk:** low
- **Where (errors, `react-hooks/set-state-in-effect`):** `src/lib/locale-context.tsx:45`, `src/components/language-modal.tsx:16`, `src/components/ui/carousel.tsx:98`
- **Where (warnings, `@typescript-eslint/no-unused-vars`):** `src/app/about/page.tsx:4-6` (`Link`, `ArrowRight`, `Button`), `src/app/faq/page.tsx:3,10` (`Image`, `Card`), `src/app/services/page.tsx:3` (`Phone`, `Send`), `src/components/final-cta-footer.tsx:3,5` (`MapPin`, `MAPS_LINK`), `src/components/hero-section.tsx:3` (`Image`), `src/components/real-work-grid.tsx:8` (`t`), `src/components/services-carousel.tsx:11` (`ArrowRight`)
- **Why necessary:** unused imports are harmless to the bundle (tree-shaken) but they are how real regressions hide, and `final-cta-footer`'s unused `MAPS_LINK`/`MapPin` is direct evidence of the missing Directions action (GEO-L5) — the lint output is literally pointing at a functional gap. The three **errors** matter more: `set-state-in-effect` in `locale-context` is the React Compiler/ESLint flag for exactly the pattern that produces the double render and English flash described in BLOCK-05, and it will block any CI gate you add in OPS-04.
- **Fix:** delete the unused imports; rework the locale effect so state derives from a synchronously-available source (URL/cookie via SEO-03, or `useSyncExternalStore` for `localStorage`) instead of a `setState` inside `useEffect`. For `ui/carousel.tsx` (a shadcn-generated file) either accept and document a targeted eslint-disable with a comment, or drop the component entirely when CODE-04 removes the carousel. Then set `--max-warnings=0` in the gate.

### CODE-02 · Dead code and duplicated sources of truth
- **Priority:** P1 · **Phase 1** · **Effort:** S · **Risk:** low
- **Evidence (verified by reference scan):**
  * `src/components/workflow-timeline.tsx` — never imported (and untranslated "Our Process" heading).
  * `src/components/icons.tsx` — `DynamicIcon`/`iconMap` never imported.
  * `src/components/ui/` unused: `button-group`, `input`, `textarea`, `skeleton`, `spinner`, `scroll-area`, `sonner`.
  * `src/lib/constants.ts`: `TRUST_CHIPS`, `TRUST_SNAPSHOT_ITEMS`, `SERVICES`, `WHY_CHOOSE_US`, `WORKFLOW_STEPS`, `FAQ_ITEMS` are **not** used for rendering — the components read copy from the translation JSON instead. `SERVICES` also points at `/placeholder-service.svg`, which does not exist.
  * `public/`: `mobilelogo.png` (1.3 MB), `tabletlogo.png` (1.33 MB), `file.svg`, `globe.svg` — unused.
  * Repo root: `shadcn-components.html` (466.6 KB dump of an external site build), `tsconfig.tsbuildinfo` (252.8 KB, already in `.gitignore`).
- **Why necessary:** two competing sources of truth for the same copy is the dangerous one: a future maintainer edits `constants.ts` (the "obviously right" place) and sees no change on the site, or worse, a page starts rendering the stale English constant while the rest of the site is translated. Everything else is dead weight that misleads the next developer and bloats the deploy artifact.
- **Fix:** delete the superseded constants and the unused components/assets; keep `WORKFLOW_STEPS` only if SEO-05's `HowTo` actually consumes it, otherwise move the content into the translation JSON like every other string. Move the design mockups (`design/*.jpg`, ≈947 KB) and any reference HTML into a `docs/` folder (or git-ignore them).

### CODE-03 · Silent CSS no-ops and two competing colour systems
- **Priority:** P1 · **Phase 1** · **Effort:** S · **Risk:** low
- **Where:** `src/components/map-section.tsx:8` (`bg-neutral`), `src/app/faq/page.tsx:46` (`bg-gray`), `src/app/faq/page.tsx:63` (`bg-neutral-gray` **on the overlay div** that also sets an inline gradient)
- **Evidence:** `bg-neutral` and `bg-gray` are **not valid Tailwind v4 utilities** (the palette requires a shade, e.g. `bg-neutral-100`) — verified absent from the compiled CSS. `bg-neutral-gray` and `text-charcoal` **are** present, i.e. the brand tokens work.
- **Why necessary:** these classes silently do nothing, so the sections render against the body background instead of the intended surface — a real visual inconsistency, and a trap for anyone who later "fixes" spacing by trusting the class name. The FAQ overlay also carries a background colour *and* an inline gradient, so if the gradient ever fails the overlay becomes opaque and hides the hero image.
- **Fix:** replace with the brand token `bg-neutral-gray`; review every `text-gray-*`/`bg-gray-*`/`border-gray-*` usage (about, faq, gallery, services, language modal) against the documented palette (`design.md` §Color Palette: Charcoal `#1A1A1A`, Safety Orange `#E65F19`, Telegram Blue `#26A5E4`, White, Neutral Gray `#F4F4F6`) and unify, so Amharic/English and every page share one system.
- **Prevention:** after changing styles, grep the compiled CSS for the new class (the same check that found this) rather than trusting that a class name "must" work.

### CODE-04 · A carousel for three static cards (remove a whole client runtime)
- **Priority:** P2 · **Phase 2** · **Effort:** S · **Risk:** low
- **Where:** `src/components/services-carousel.tsx` (imports `Carousel*` from `@/components/ui/carousel` → `embla-carousel-react`), used only on `/`
- **Evidence:** it renders a hardcoded `[0, 1, 2]` carousel with previous/next arrows and `basis-1/2 md:basis-1/3 lg:basis-1/4` — so on `lg` it displays three cards in a four-column track (a visible empty slot). `ArrowRight` is imported and unused.
- **Why necessary:** embla plus the carousel primitive are part of the first-load JS on the most important page, for content that never scrolls (three items, all visible at `md`+). It is interactive weight that buys nothing, and the empty `lg` column looks like a layout bug.
- **Fix:** replace with a plain grid (`grid-cols-1 sm:grid-cols-3`) — or a CSS `scroll-snap` flex row if a swipe affordance is genuinely wanted on small screens (no JS needed). Derive items from the translation keys so the count can never drift, and drop the unused import.
- **Expected:** one fewer interactive chunk on `/`; `embla-carousel-react` leaves the client bundle if nothing else uses it (verify with `pnpm analyze` before removing the dependency).

### CODE-05 · Copy and UX bugs found during the audit
- **Priority:** P1 · **Phase 1** · **Effort:** S · **Risk:** low
- **Findings:**
  1. `src/components/trust-snapshot.tsx:52-58` renders a `Button` labelled `trust.learnMore`, whose English string is **"Learn more about me"** — wrong voice for a company site ("about me" vs "about us") — and the button has **no `href` and no `onClick`**: a dead, primary-looking CTA in the trust banner. Link it to `/about` (recommended) or remove it.
  2. `src/components/real-work-grid.tsx` destructures `const { t } = useLocale()` and never uses it, while its heading `"Our Work"` is hardcoded English — the section is not bilingual even though the mechanism is right there.
  3. `src/app/gallery/page.tsx:137-139` prints the raw category key (`engine`, `transmission`) in the badge, and reuses the same image URLs for multiple tiles (SPEED-06).
  4. `src/app/faq/page.tsx` puts `bg-neutral-gray` on the hero overlay while also setting an inline gradient (CODE-03).
  5. `hero-section.tsx:42-50` wraps a single `<h1>` in a `flex items-center gap-3` container with a stray blank line where a logo used to be — harmless, but a sign of an incomplete edit; the `minHeight` values also disagree with `design.md` (60 vh vs the specified 80 vh).
  6. `services-carousel.tsx:22` carries a development comment explaining a previous `px-4 → px-12` change; useful intent, but it belongs in the plan/PR, not the shipped JSX.
- **Why necessary:** each is small, but they land at the exact moments (trust banner, portfolio, footer) where a repair-shop customer decides whether to believe you. Fix them in the same pass as that file's other work.

### CODE-06 · Hardcoded English inside a bilingual UI
- **Priority:** P1 · **Phase 1** · **Effort:** M · **Risk:** low
- **Evidence:** `en.json`/`am.json` have **perfect 152-key parity** ✅ — the i18n system works; these strings simply bypass it:
  * `services-carousel.tsx:25` "Our Services", `:68` "View All Services"
  * `real-work-grid.tsx:14` "Our Work" · `workflow-timeline.tsx:13` "Our Process" (unused component — delete per CODE-02)
  * `map-section.tsx:31` "SAMI Auto Service", `:32` "Addis Ababa, Ethiopia", `:43` "Open Maps"
  * `global-header.tsx:135` "Toggle menu" (`sr-only`, but screen-reader users of the Amharic site hear English)
  * `language-modal.tsx:47-54,66-80` builds its own bilingual strings instead of using keys, and labels the second option "Amharic" in English
  * `gallery/page.tsx` lightbox labels and category badge
- **Why necessary:** a customer who selects Amharic and then meets "Our Services / Our Work / Open Maps" in English concludes the site is not really for them — and this is the audience the bilingual build exists to serve. It also means Amharic pages carry English text that competes in search relevance.
- **Fix:** add keys to **both** JSON files (keep 152/152 parity), replace every literal, and cover these strings with the CODE-07 typed-key check so a missing translation becomes a build error instead of a silent fallback.

### CODE-07 · Make `t()` fast, typed, and honest about missing keys
- **Priority:** P2 · **Phase 2** · **Effort:** M · **Risk:** low
- **Where:** `src/lib/locale-context.tsx:22-36` (`getNestedValue`), `:55-68` (`t`)
- **Evidence:** every `t(key)` call performs a regex replacement plus an iterative object walk with `key in obj` checks; on a miss it walks the entire `en` dictionary again; if both miss it **returns the raw key**, so a typo renders `hero.tagline` to a customer.
- **Why necessary:** with 152 keys called in loops (services, gallery, FAQ, trust, why-choose-us) this runs constantly for no benefit, and the silent key-return makes translation gaps invisible in production until someone notices raw keys on a live page.
- **Fix:** flatten each dictionary **once** at module scope into `Record<string,string>` keyed by dot-path, look up directly, and memoize per locale; derive a union type of keys from the `en` object so `t("hero.callNoww")` becomes a **TypeScript error**; in development `console.warn` on a miss (keep the English fallback in production — never the raw key). Pairs with SPEED-02, which removes the dictionary duplication.

### CODE-08 · Reconcile the design spec with the shipped code
- **Priority:** P2 · **Phase 2** · **Effort:** S · **Risk:** low
- **Evidence:** `design.md` specifies an **80 vh** hero and 48–56 px buttons; the code uses 60/50/40/35 vh and 40 px. `design.md` also describes a gallery "filter and masonry" format and image-based `ServicePreviewCard`s (the build uses icons), while `COMPONENT_PLAN.md` lists Input/Textarea/Breadcrumb/Tooltip/Dropdown/Collapsible components that were never built.
- **Why necessary:** when the spec and the code disagree, every future change becomes an argument about which is authoritative — and here the disagreement covers the most-loaded screen in the funnel. Making the decision explicit now (update the spec to match the build, fix the build to match the spec, or record the deviation with a reason) prevents a slow drift where nobody knows the intended design.
- **Fix:** after Phase 1 lands, bump `design.md` to v2.1 marked **"as-built"**, note each deliberate deviation (e.g. a shorter mobile hero to keep the CTA above the fold), mark unbuilt components in `COMPONENT_PLAN.md` as deferred, and refresh `README.md` (OPS-06).

---

## 10. Implementation roadmap

Phases are ordered so each one unblocks the next. Do **not** start Phase 1's routing refactor before the Phase 0 decisions (OPS-02 host, §12 Q1–Q4) are answered — the sharp check, the locale strategy and the asset pipeline all depend on them.

### Phase 0 — Blockers (target: 1–2 working days + owner inputs)

- [ ] **OPS-02** decide the host (Vercel vs VPS vs container) — *decision, blocks BLOCK-06*
- [ ] **GEO-L1** create `src/lib/business.ts` and collect real NAP data (phone, street address, lat/lng, hours, GBP link) — *owner input required*
- [ ] **BLOCK-01** replace the 1.86 MB logo + fix header sizing (A11Y-03)
- [ ] **BLOCK-02** replace the 422 KB favicon; add `icon`/`apple-icon`/`manifest`
- [ ] **BLOCK-04** one canonical coordinate + place ID in both pages; Maps facade
- [ ] **BLOCK-06** prove `/_next/image` returns 200 on the target platform
- [ ] **CODE-02** delete the unused 1.3 MB PNGs and dead `public/` assets
- **Exit criteria:** home critical path < 300 KB gzip; no preloaded asset > 60 KB; a real phone call reaches the workshop; `/_next/image` verified on the deploy target.

### Phase 1 — Launch quality (target: 4–6 working days)

Sequenced because most items touch the same files:

1. **SEO-01 / SPEED-01** — convert pages to Server Components; extract client leaves. *(Largest single change; do it first, everything else rebases on it.)*
2. **SEO-03 / BLOCK-05** — locale routing + `lang` + `hreflang` + cookie; then **SPEED-02** (single dictionary) and **CODE-06 / CODE-07** (translated strings, typed `t()`).
3. **BLOCK-03 / SPEED-04 / SPEED-05** — image pipeline: static imports, `preload`, configured `formats`/`qualities`, trimmed `remotePatterns`.
4. **SEO-02 / SEO-04 / SEO-05 / GEO-A4** — metadata, canonical, OG/Twitter, robots, sitemap, manifest, JSON-LD, AI-crawler policy.
5. **SEO-06 / GEO-L5** — keyword-mapped headings + Directions in the footer.
6. **A11Y-01 / A11Y-02** — tap targets, real dialog for the language modal.
7. **CODE-01 / CODE-03 / CODE-05** — lint to green, CSS no-op classes, copy bugs.
8. **OPS-03 / OPS-04 / SEO-07** — env vars, `.env.example`, CI QA gate, analytics + conversion events.
- **Exit criteria:** all §11 targets met in a Lighthouse run against `next start`; lint green with `--max-warnings=0`; sitemap + JSON-LD validated; both locales indexable.

### Phase 2 — Post-launch polish (weeks 1–3)

- [ ] **SPEED-06** correct gallery/work-grid images (unique, 2×, real dimensions)
- [ ] **SPEED-07** rAF-throttled header scroll handling
- [ ] **SPEED-08** `public/` cache headers; Brotli/HTTP-2 at the proxy
- [ ] **CODE-04** replace the carousel with a grid; drop embla if unused
- [ ] **SEO-08** block preview/staging from indexing
- [ ] **GEO-L4 / GEO-A1** areas-served copy + "Key facts" block
- [ ] **OPS-01** security headers (CSP in report-only first)
- [ ] **OPS-05** error boundaries + uptime monitor
- [ ] **OPS-06 / CODE-08** dependency hygiene, README/`design.md` refresh
- [ ] **GEO-L2 / GEO-L6** Business Profile completion + review collection loop
- [ ] **A11Y-05** `prefers-reduced-motion`

### Phase 3 — Growth (month 1+)

- [ ] **GEO-A5** per-service pages and practical guides (needs content + owner sign-off on prices)
- [ ] **GEO-A2 / GEO-A3** answer-shaped content, `HowTo`, `llms.txt`
- [ ] **A11Y-06** decide on the contact form (or remove the unused inputs)
- [ ] Re-measure Core Web Vitals against field data; re-run the §11 table monthly

### Full item index (use this as the implementation checklist)

| Item | Priority | Effort | Phase | Group |
|---|---|---|---|---|
| BLOCK-01 logo 1.86 MB | P0 | S | 0 | Speed |
| BLOCK-02 favicon 422 KB | P0 | S | 0 | Speed |
| BLOCK-03 hero `background-image` | P0 | M | 0/1 | Speed |
| BLOCK-04 conflicting map coordinates | P0 | S | 0 | GEO |
| BLOCK-05 Amharic not indexable | P0 | L | 1 | SEO |
| BLOCK-06 sharp on target host | P0 | S | 0 | Ops |
| SPEED-01 first-load JS 836 KB | P1 | L | 1 | Speed |
| SPEED-02 duplicated dictionary | P1 | M | 1 | Speed |
| SPEED-03 Ethiopic font + weights | P1 | S | 1 | Speed |
| SPEED-04 image pipeline config | P1 | S | 1 | Speed |
| SPEED-05 `priority` → `preload` | P1 | S | 1 | Speed |
| SPEED-06 gallery image sizes | P1 | M | 2 | Speed |
| SPEED-07 scroll handler | P2 | S | 2 | Speed |
| SPEED-08 cache headers / transport | P2 | S | 2 | Speed |
| SEO-01 server components + metadata | P0 | L | 1 | SEO |
| SEO-02 metadataBase/OG/canonical | P1 | M | 1 | SEO |
| SEO-03 locale routing + hreflang | P0 | L | 1 | SEO |
| SEO-04 robots/sitemap/manifest/404 | P1 | M | 1 | SEO |
| SEO-05 structured data | P1 | M | 1 | SEO |
| SEO-06 keyword-mapped headings | P1 | M | 1 | SEO |
| SEO-07 analytics + conversion events | P1 | M | 1 | SEO |
| SEO-08 block preview indexing | P2 | S | 2 | SEO |
| GEO-L1 single NAP source | P0 | S | 0 | GEO |
| GEO-L2 Business Profile alignment | P0 | M | 2 | GEO |
| GEO-L3 LocalBusiness JSON-LD | P1 | M | 1 | GEO |
| GEO-L4 area-served copy | P1 | M | 2 | GEO |
| GEO-L5 Directions CTA | P1 | S | 1 | GEO |
| GEO-L6 reviews / freshness | P2 | M | 2 | GEO |
| GEO-A1 quotable facts block | P2 | M | 2 | GEO (AI) |
| GEO-A2 answer formats | P3 | M | 3 | GEO (AI) |
| GEO-A3 `llms.txt` | P3 | S | 3 | GEO (AI) |
| GEO-A4 AI-crawler policy | P2 | S | 1 | GEO (AI) |
| GEO-A5 content depth | P3 | XL | 3 | GEO (AI) |
| OPS-01 security headers | P1 | M | 2 | Ops |
| OPS-02 deployment target | P0 | M | 0 | Ops |
| OPS-03 env vars + toolchain pinning | P1 | S | 1 | Ops |
| OPS-04 QA gate | P1 | M | 1 | Ops |
| OPS-05 error + uptime monitoring | P1 | S | 2 | Ops |
| OPS-06 dependency hygiene | P2 | S | 2 | Ops |
| A11Y-01 tap targets 48 px | P1 | S | 1 | A11Y |
| A11Y-02 language modal dialog | P1 | S | 1 | A11Y |
| A11Y-03 logo box sizing | P2 | S | 1 | A11Y |
| A11Y-05 reduced motion | P2 | S | 2 | A11Y |
| A11Y-06 contact form decision | P3 | M | 3 | A11Y |
| CODE-01 lint red | P1 | S | 1 | Code |
| CODE-02 dead code / duplicate copy | P1 | S | 0/1 | Code |
| CODE-03 CSS no-ops + palette | P1 | S | 1 | Code |
| CODE-04 carousel → grid | P2 | S | 2 | Code |
| CODE-05 copy / UX bugs | P1 | S | 1 | Code |
| CODE-06 untranslated strings | P1 | M | 1 | Code |
| CODE-07 `t()` typed + fast | P2 | M | 2 | Code |
| CODE-08 spec vs code drift | P2 | S | 2 | Code |

Effort key: **S** ≈ up to half a day · **M** ≈ 1–2 days · **L** ≈ 3–5 days · **XL** ≈ 1–2 weeks.

---

## 11. Acceptance criteria (definition of done)

| # | Criterion | How to verify | Target |
|---|---|---|---|
| 1 | Home critical-path payload | sum of `preload`ed + first-load assets, gzip | **< 180 KB** (from 1,626 KB) |
| 2 | No single asset > 200 KB | audit of `public/` + build output | logo ≤ 10 KB, favicon ≤ 10 KB |
| 3 | First-load JS for `/` | `pnpm analyze` / build output | **< 300 KB raw / < 110 KB gzip** |
| 4 | LCP (mobile, Slow 4G) | Lighthouse on the production build | **< 2.5 s** |
| 5 | CLS | Lighthouse | **< 0.1** |
| 6 | TBT | Lighthouse | **< 200 ms** |
| 7 | Unique `<title>` + `description` + canonical per route | `curl` each route, diff the heads | **7/7** (then 14/14 with locales) |
| 8 | `sitemap.xml` includes every route (× locales) | fetch `/sitemap.xml` | all URLs, valid XML |
| 9 | `robots.txt` points to the sitemap and states the AI policy | fetch `/robots.txt` | present + intentional |
| 10 | JSON-LD validates | Google Rich Results Test + Schema Validator | **0 errors** |
| 11 | Amharic is indexable | `curl /am/…`, check `lang`, `hreflang`, content | present, server-rendered |
| 12 | NAP consistency | grep the phone/address, compare with the GBP | **one source, matches GBP** |
| 13 | `/_next/image` works on the host | `curl -I` a real optimised URL | **200 + `image/*`** |
| 14 | Lint clean | `pnpm lint` | **0 errors, 0 warnings** |
| 15 | Tap targets | measure all primary CTAs | **≥ 48 px** |
| 16 | No hydration warnings | browser console on all routes × locales | **none** |
| 17 | Conversion events fire | analytics debug view; tap Call/Telegram/Directions | 3 events visible |
| 18 | Deployment documented | runbook committed | host, env, rollback |

**Suggested measurement window:** verify 1–12 and 14–16 before launch; verify 4, 5, 6 and 17 with **real field data** (Search Console Core Web Vitals + analytics) 28 days after launch, because lab numbers and mobile field data diverge on real networks.

---

## 12. Decisions needed from the owner (blocking questions)

These cannot be answered from the code — they need a business decision. Items marked **blocks** must be answered before their phase starts.

| Q | Question | Why it blocks work |
|---|---|---|
| **Q1** | **Which host?** Vercel, a Node VPS (local or EU), or a container? | **Blocks BLOCK-06, OPS-02, SPEED-04 (AVIF), SPEED-08.** Changes the sharp strategy, caching layer and whether AVIF/vs WebP is worth it. |
| **Q2** | **Which locale URL strategy?** `/en` + `/am` segments (recommended), `?lang=`, or English-only canonical? | **Blocks SEO-03 / BLOCK-05** and the entire Phase 1 sequencing. |
| **Q3** | **Real business data:** production phone number, full street address + sub-city, postal code, exact lat/lng, Google Business Profile URL/Place ID, opening hours, email? | **Blocks GEO-L1, BLOCK-04, GEO-L3, SEO-05.** Everything machine-readable depends on it; the current values are placeholders. |
| **Q4** | **Real photography:** can we get 10–15 original workshop photos (plus the logo in editable vector form)? | **Blocks BLOCK-03 and SPEED-06.** Stock/Google-thumbnail images are a licensing and reliability risk, and photo quality is the main trust lever for a garage. |
| **Q5** | **Production domain name** (for `SITE_URL`, canonical, sitemap, OG)? | Blocks SEO-02/SEO-04/SEO-08. |
| **Q6** | **May we publish price ranges and typical turnaround times?** | Blocks GEO-A1/GEO-A2 (price transparency is the strongest local citation magnet) and the service-page plan in GEO-A5. |
| **Q7** | **Reviews:** do we have genuine customer reviews we can quote and attribute? | Blocks GEO-L6 and any `AggregateRating` schema (we must not fabricate ratings). |
| **Q8** | **Analytics preference:** Vercel Analytics, GA4, or a privacy-first alternative (and is cookie consent required for the chosen tool)? | Blocks SEO-07; consent requirements change what may load on first paint. |
| **Q9** | **Is a contact form ever required**, or is Call + Telegram final? | Resolves A11Y-06 and whether `ui/input.tsx`/`textarea.tsx` are deleted. |
| **Q10** | **Hero height:** keep the current 60 vh (CTA above the fold on mobile) or restore the spec's 80 vh? | Blocks CODE-08 sign-off and BLOCK-03's visual parity check. |

**Assumptions made where the code was silent** (flag if any is wrong):
1. Deployment is not yet chosen — nothing in the repo indicates one (no `vercel.json`, `Dockerfile`, or CI config).
2. Prices, turnaround times and review counts are intentionally omitted rather than missing by oversight.
3. The Amharic translation is final copy, not draft — the 152/152 key parity suggests it was treated as complete.
4. The current single title/description in `layout.tsx` was scaffolding, not a deliberate branding decision.
5. `ignoredBuiltDependencies: sharp` was a local install convenience, not an intentional production setting.

---

## 13. Appendix

### 13.1 File-level map of what changes

| File / path | Items touching it |
|---|---|
| `next.config.ts` | SPEED-04, SPEED-08, OPS-01, SPEED-05 (config side) |
| `src/app/layout.tsx` | SPEED-03 (fonts), SEO-02, SEO-05, OPS-03 |
| `src/app/page.tsx` + `src/app/{about,services,gallery,faq,contact}/page.tsx` | SEO-01, SPEED-01, SEO-06, BLOCK-03, CODE-01, CODE-03, CODE-05, SEO-07 |
| `src/app/{robots,sitemap,manifest}.ts` *(new)* | SEO-04, BLOCK-02, GEO-A4 |
| `src/app/{not-found,error,global-error,opengraph-image}.tsx` *(new)* | SEO-02, SEO-04, OPS-05 |
| `src/app/[locale]/…` *(new, if Q2 = segments)* | SEO-03, BLOCK-05 |
| `src/lib/business.ts` *(new)* | GEO-L1, BLOCK-04, GEO-L3, GEO-L5, SEO-05 |
| `src/lib/schema.ts` *(new)* | SEO-05, GEO-L3, GEO-A2 |
| `src/lib/locale-context.tsx` | SPEED-02, CODE-01, CODE-07, SEO-03, A11Y-02 |
| `src/lib/constants.ts` | CODE-02, GEO-L1, BLOCK-03, SPEED-06 |
| `src/lib/translations/{en,am}.json` | CODE-06, SEO-06, GEO-L4, GEO-A1 |
| `src/components/global-header.tsx` | BLOCK-01, SPEED-05, SPEED-07, A11Y-03, CODE-01 |
| `src/components/hero-section.tsx` | BLOCK-03, SPEED-05, SEO-06, A11Y-01, CODE-01, CODE-05 |
| `src/components/language-modal.tsx` | BLOCK-01, A11Y-02, CODE-06, CODE-01 |
| `src/components/map-section.tsx` | BLOCK-04, GEO-L5, CODE-03, CODE-06 |
| `src/components/final-cta-footer.tsx` | GEO-L5, A11Y-01, CODE-01, CODE-06 |
| `src/components/services-carousel.tsx` | CODE-04, CODE-06, CODE-01, SEO-06 |
| `src/components/real-work-grid.tsx` | SPEED-06, CODE-06, CODE-01 |
| `src/components/trust-snapshot.tsx` | CODE-05, A11Y-01 |
| `src/components/sticky-conversion-tray.tsx` | A11Y-01, CODE-06 |
| `src/components/workflow-timeline.tsx`, `src/components/icons.tsx` | CODE-02 (delete) |
| `src/components/ui/{button-group,input,textarea,skeleton,spinner,scroll-area,sonner}.tsx` | CODE-02 (delete), A11Y-06 |
| `public/` | BLOCK-01, BLOCK-02, CODE-02, GEO-A3, SPEED-06 |
| `package.json` / `pnpm-workspace.yaml` | OPS-03, OPS-06, BLOCK-06 |
| `README.md` / `design.md` / `COMPONENT_PLAN.md` | OPS-06, CODE-08 |

### 13.2 How the §2 baseline was measured (reproduce after each phase)

```powershell
# 1. Production build
pnpm build

# 2. First-load JS for the home route (chunk list from the compiled HTML)
$h = Get-Content .next/server/app/index.html -Raw
[regex]::Matches($h,'/_next/static/chunks/([A-Za-z0-9_\-]+\.js)') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

# 3. Total payload of .next/static
(Get-ChildItem .next\static -Recurse -File | Measure-Object Length -Sum).Sum / 1KB

# 4. Anything preloaded in <head>
[regex]::Matches($h,'<link[^>]*>') | ForEach-Object { $_.Value }

# 5. Largest public assets
Get-ChildItem public -Recurse -File | Sort-Object Length -Descending | Select-Object Name, Length

# 6. Lint (must be clean before this can gate CI)
pnpm lint

# 7. Confirm a class actually exists in the compiled CSS (used to find CODE-03)
$css = Get-Content .next\static\chunks\*.css -Raw; $css.Contains('.bg-neutral-gray')

# 8. Translation key parity
#    (flatten both JSON files and compare key sets; expect 152 == 152)
```

Gzip figures in §2 were produced with `System.IO.Compression.GZipStream` at `Optimal` level over each file. Brotli at the CDN will be ~15–20 % lower on JS/CSS but *not* on the base64-laden SVG (already incompressible), which is why BLOCK-01 is the top priority.

### 13.3 Next.js 16 documentation to read before implementing (from `node_modules/next/dist/docs/`)

| Topic | Doc path |
|---|---|
| Production checklist | `01-app/02-guides/production-checklist.md` |
| Image component (**`priority` deprecated**, `preload`, `qualities` required, `formats`, `minimumCacheTTL`) | `01-app/03-api-reference/02-components/image.md` |
| Image config / custom loaders | `01-app/03-api-reference/05-config/01-next-config-js/images.md` |
| Images guide (static imports, `sizes`, blur) | `01-app/01-getting-started/12-images.md` |
| Fonts | `01-app/01-getting-started/13-fonts.md`, `01-app/03-api-reference/02-components/font.md` |
| **Metadata requires Server Components** | `01-app/01-getting-started/14-metadata-and-og-images.md` |
| `robots`, `sitemap`, `manifest`, `opengraph-image`, `app-icons` | `01-app/03-api-reference/03-file-conventions/01-metadata/*` |
| `optimizePackageImports` (default list already includes `lucide-react`) | `01-app/03-api-reference/05-config/01-next-config-js/optimizePackageImports.md` |
| `cacheComponents` / PPR (only if you later need dynamic content) | `01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md` |
| Deploying / self-hosting, `output: 'standalone'` | `01-app/01-getting-started/17-deploying.md`, `01-app/02-guides/deploying-to-platforms.md` |

### 13.4 Suggested follow-up prompt templates

Because implementation will proceed in slices, these map cleanly onto the phases above:

* `"Implement Phase 0: BLOCK-01, BLOCK-02, CODE-02"` — small, self-contained, no routing risk.
* `"Implement GEO-L1 + BLOCK-04 + GEO-L5 using src/lib/business.ts"` — one new module, three consumers.
* `"Implement SEO-01 + SPEED-01: convert pages to Server Components and extract client leaves, keeping A11Y-04 behaviour intact"` — the big refactor; do it alone.
* `"Implement SEO-03 + BLOCK-05 with /en and /am segments"` — the routing change; depends on Q2.
* `"Implement SPEED-04 + SPEED-05 image pipeline changes"` — read `image.md` first.

**End of plan.** No source file was modified to produce this document; only this file was created.






















