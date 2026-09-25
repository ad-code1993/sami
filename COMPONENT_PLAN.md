# SAMI Auto Service — shadcn/ui Component Installation Plan

## Overview

This document provides a complete, verified component installation plan for the SAMI Auto Service project based on the design specification (`design.md`). All components listed below have been verified against the latest shadcn/ui documentation (July 2026, Base UI default).

---

## 1. Core shadcn/ui Components (Install via CLI)

These are standard shadcn/ui registry components that can be installed with `npx shadcn@latest add`.

| # | Component | Why Needed | Screens | Installation Command | Dependencies |
|---|-----------|-----------|---------|---------------------|--------------|
| 1 | **Button** | Primary CTAs (Call Now, Chat on Telegram, Open Maps), outline buttons, ghost buttons for navigation | All pages | `npx shadcn@latest add button` | lucide-react, class-variance-authority |
| 2 | **Card** | Service preview cards, trust snapshot cards, contact action cards, mission/vision cards, "Not Sure?" fallback module | Home, About, Services, Contact | `npx shadcn@latest add card` | lucide-react |
| 3 | **Badge** | Trust chips with status dots ("Honest Service", "Fair Pricing", "Skilled Mechanic") | Home | `npx shadcn@latest add badge` | class-variance-authority |
| 4 | **Accordion** | FAQ sections (Mini-FAQ on Home, full FAQ page) | Home, FAQ | `npx shadcn@latest add accordion` | @base-ui/react (already installed) |
| 5 | **Carousel** | Services preview horizontal slider (swipeable on mobile, 3-column on desktop) | Home | `npx shadcn@latest add carousel` | embla-carousel-react |
| 6 | **Dialog** | Gallery lightbox modal with zoom and descriptive label | Gallery | `npx shadcn@latest add dialog` | @base-ui/react |
| 7 | **Separator** | Visual dividers between sections, card borders | All pages | `npx shadcn@latest add separator` | @base-ui/react |
| 8 | **Skeleton** | Loading placeholders for images and content during lazy-loading | Gallery, Home | `npx shadcn@latest add skeleton` | — |
| 9 | **Avatar** | Mechanic photo in About hero, testimonial avatars | About | `npx shadcn@latest add avatar` | @base-ui/react |
| 10 | **Tabs** | Gallery filter pills/categories (All, Engine Repair, Transmission, Suspension, Brakes, Workshop) | Gallery | `npx shadcn@latest add tabs` | @base-ui/react |
| 11 | **Sheet** | Mobile hamburger menu navigation panel | All pages (mobile) | `npx shadcn@latest add sheet` | @base-ui/react |
| 12 | **Navigation Menu** | Desktop top navigation bar | All pages (desktop) | `npx shadcn@latest add navigation-menu` | @base-ui/react |
| 13 | **Input** | Contact form fields (if needed) | Contact | `npx shadcn@latest add input` | @base-ui/react |
| 14 | **Textarea** | Message field in contact form | Contact | `npx shadcn@latest add textarea` | @base-ui/react |
| 15 | **Tooltip** | Icon tooltips for service icons, social links | Home, About, Services | `npx shadcn@latest add tooltip` | @base-ui/react |
| 16 | **Scroll Area** | Custom scroll containers for service lists, gallery | Services, Gallery | `npx shadcn@latest add scroll-area` | @base-ui/react |
| 17 | **Aspect Ratio** | 16:9 responsive map container, image containers with consistent ratios | Contact, Gallery | `npx shadcn@latest add aspect-ratio` | @base-ui/react |
| 18 | **Sonner** | Toast notifications for form submissions, copy-to-clipboard feedback | Contact | `npx shadcn@latest add sonner` | sonner |
| 19 | **Spinner** | Loading state indicator for async operations | All pages | `npx shadcn@latest add spinner` | — |
| 20 | **Breadcrumb** | Page hierarchy navigation (optional, for deep pages) | All pages | `npx shadcn@latest add breadcrumb` | @base-ui/react |
| 21 | **Dropdown Menu** | Mobile menu items, language selector (if needed) | All pages | `npx shadcn@latest add dropdown-menu` | @base-ui/react |
| 22 | **Collapsible** | Expandable content sections (alternative to accordion for some FAQ items) | FAQ | `npx shadcn@latest add collapsible` | @base-ui/react |
| 23 | **Button Group** | Grouped CTA buttons (Call + Telegram stacked layout) | Home, Contact | `npx shadcn@latest add button-group` | @base-ui/react |
| 24 | **Empty** | Empty state for gallery if no images match filter | Gallery | `npx shadcn@latest add empty` | @base-ui/react |
| 25 | **Typography** | Consistent heading/paragraph styles across all pages | All pages | `npx shadcn@latest add typography` | — |

---

## 2. Components That Require Third-Party Libraries

| # | Component | Why Needed | Screens | Third-Party Library | Installation |
|---|-----------|-----------|---------|--------------------|--------------|
| 1 | **Map (Embedded)** | Interactive Google Maps/Leaflet map showing workshop location | Contact | `leaflet` + `react-leaflet` or Google Maps API | `pnpm add leaflet react-leaflet @types/leaflet` |
| 2 | **Image (next/image)** | Optimized image loading for gallery and hero images | All pages | Built into Next.js | Already available via `next/image` |
| 3 | **Icons (lucide-react)** | Phone, Telegram, Map Pin, Wrench, Coins, Gear, and all UI icons | All pages | `lucide-react` | Already installed (`^1.23.0`) |

---

## 3. Custom Components That Must Be Built

These components are not available in the shadcn/ui registry and must be custom-built using the installed shadcn primitives.

| # | Component Name | Why Needed | Screens | Built From Primitives | Description |
|---|---------------|-----------|---------|----------------------|-------------|
| 1 | **StickyConversionTray** | Fixed-position bottom bar with Call, Telegram, Directions links | All pages | `Button`, `Separator`, `lucide-react` icons | Fixed bottom nav bar, z-index 50, 3 tap targets (Phone, Telegram, Map Pin) |
| 2 | **HeroSection** | Dark overlay hero with headline, subtitle, CTA buttons, trust chips | Home, About, Services, FAQ, Gallery | `Button`, `Badge`, `Card` | 80vh viewport, dark overlay on background image, stacked CTA buttons, trust pill badges |
| 3 | **TrustSnapshot** | 3-column instant credibility banner with icons | Home | `Card`, `Separator` | 3 equal columns with line-art icons and labels (Experienced Mechanic, Affordable Pricing, Quality Repairs) |
| 4 | **ServicePreviewCard** | Service category card with image, title, short description | Home, Services | `Card`, `Aspect Ratio` | Rounded card with car subsystem image, title, 1-sentence description |
| 5 | **ServicesCarousel** | Swipeable carousel of service preview cards | Home | `Carousel`, `ServicePreviewCard` | Wraps shadcn Carousel with service cards, transforms to 3-column grid on desktop |
| 6 | **WhyChooseUsGrid** | 2×3 value matrix grid with centered icons | Home | `Card`, `lucide-react` icons | 2×3 grid of cards with line-art icons and labels (Honest Diagnosis, Fair Pricing, etc.) |
| 7 | **WorkflowTimeline** | Linear step-by-step process indicator | Home | Custom CSS + `Separator` | 4-step linked node diagram (Inspection → Diagnosis → Repair → Final Check) |
| 8 | **RealWorkGrid** | 2-column masonry grid of workshop photos | Home | `next/image`, CSS masonry | 2-column grid with real workshop images, no stock photography |
| 9 | **MiniFAQ** | 2-question accordion section with "See More Questions" link | Home | `Accordion`, `Button` | 2 accordion items (appointment, repair time) + text link to FAQ page |
| 10 | **FinalCTAFooter** | Dark footer with call-to-action buttons | Home | `Button`, `Card` | Charcoal full-bleed block with Call/Telegram buttons |
| 11 | **AboutStoryBlock** | Text + image layout for "Who We Are" | About | `Card`, `Avatar`, `next/image` | Dynamic text layout beside workshop photo |
| 12 | **MissionVisionCards** | Two vertically stacked clean cards | About | `Card` | Mission card + Vision card with descriptions |
| 13 | **ValuesIconArray** | 4-column or 2×2 grid of values with icons | About | `Card`, `lucide-react` icons | Integrity First, Reliable Diagnosis, Workmanship Guarantee, Customer Care |
| 14 | **ServiceCategoryCard** | Categorized service listing card | Services | `Card`, `Badge` | Service title + 1-sentence diagnostic description, grouped by category |
| 15 | **NotSureFallback** | "Not sure what's wrong?" conversion trap | Services | `Card`, `Button` | Highlighted container with diagnostic offer and CTA stack |
| 16 | **GalleryFilterBar** | Horizontal swipable filter pills | Gallery | `Tabs`, `Scroll Area` | Horizontal pill filters: All, Engine Repair, Transmission, Suspension, Brakes, Workshop |
| 17 | **MasonryPortfolioGrid** | 2-column lazy-loading image grid with lightbox | Gallery | `Dialog`, `next/image`, `Skeleton` | Progressive load masonry grid, opens lightbox on click |
| 18 | **TrustMessageCallout** | Minimal card banner between grid and CTA | Gallery | `Card` | "Every vehicle we work on is handled with care..." |
| 19 | **FAQCategoryGroup** | Segmented accordion groups by category | FAQ | `Accordion` | Grouped FAQ items: Service Scope, Pricing Clarity, Parts & Guarantees |
| 20 | **SupportEscalationCTA** | Dark accent block with contact buttons | FAQ | `Card`, `Button` | "Still have questions?" section with Call/Telegram buttons |
| 21 | **ContactActionCard** | Individual contact method card (Phone, Telegram, Address) | Contact | `Card`, `Button`, `lucide-react` icons | Icon + description + full-bleed CTA button |
| 22 | **OperatingHours** | Schedule information display | Contact | `Card`, `Separator` | Monday–Saturday / Sunday schedule with bordered listing |
| 23 | **MapContainer** | 16:9 responsive interactive map wrapper | Contact | `Aspect Ratio`, `react-leaflet` | Wraps Leaflet/Google Maps in aspect ratio container |
| 24 | **GlobalHeader** | Top navigation with logo, hamburger menu, nav links | All pages | `Sheet`, `Navigation Menu`, `Button` | Desktop: horizontal nav. Mobile: hamburger → Sheet |
| 25 | **PageHeader** | Page-specific hero/intro section | About, Services, Gallery, FAQ, Contact | Custom | Page title + subtitle + optional background |

---

## 4. Installation Command (Single Batch)

Run the following command to install all required shadcn/ui components at once:

```bash
npx shadcn@latest add button card badge accordion carousel dialog separator skeleton avatar tabs sheet navigation-menu input textarea tooltip scroll-area aspect-ratio sonner spinner breadcrumb dropdown-menu collapsible button-group empty typography
```

---

## 5. Already Installed Dependencies

The following are already present in `package.json` and do not need reinstallation:

| Package | Version | Purpose |
|---------|---------|---------|
| `@base-ui/react` | ^1.6.0 | Base UI primitives (shadcn v4 default) |
| `class-variance-authority` | ^0.7.1 | Component variant management |
| `clsx` | ^2.1.1 | Class name utility |
| `lucide-react` | ^1.23.0 | Icon library |
| `next` | 16.2.10 | Framework |
| `react` / `react-dom` | 19.2.4 | UI library |
| `tailwind-merge` | ^3.6.0 | Tailwind class merging |
| `tw-animate-css` | ^1.4.0 | Animation utilities |
| `tailwindcss` | ^4 | CSS framework |

---

## 6. Component Classification Summary

| Category | Count | Examples |
|----------|-------|---------|
| **Core shadcn/ui components** | 25 | Button, Card, Accordion, Carousel, Dialog, etc. |
| **Third-party library components** | 3 | Leaflet/Google Maps, next/image, lucide-react |
| **Custom components (to build)** | 25 | StickyConversionTray, HeroSection, ServicesCarousel, etc. |
| **Total** | **53** | |

---

## 7. Notes

- The project uses **Base UI** (not Radix UI) as the default, as confirmed by `components.json` (`"style": "base-nova"`) and the installed `@base-ui/react` dependency.
- All shadcn components will install with Base UI primitives automatically.
- The `lucide-react` icon library is already installed and will be used for all icons (Phone, Telegram, Map Pin, Wrench, etc.).
- For the interactive map, `react-leaflet` is recommended as it's free and doesn't require API keys. Google Maps API is an alternative if premium features are needed.
- Custom components should be placed in `src/components/` directory following the project's existing structure.