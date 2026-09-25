import type { Locale } from "@/lib/i18n";
import { business } from "@/lib/business";

/**
 * Localized SEO copy (SEO-01 / SEO-03).
 *
 * Kept out of `src/lib/translations/*.json` on purpose: this text is only ever
 * rendered on the server into `<title>`, `<meta>` and JSON-LD, never through
 * `t()`, so it must not be pulled into the client bundle. Both locales are
 * required by the type — adding a route to one locale and forgetting the other
 * is a TypeScript error.
 *
 * Writing rules followed here (why it isn't just the visible hero copy):
 *  - the title leads with the brand + the searched-for service and city;
 *  - the description is a self-contained, quotable answer (CTA + address +
 *    hours) because it is what Google and AI answer engines lift;
 *  - the Amharic titles carry the Amharic brand name *and* the Latin one
 *    (`SAMI Auto Service`) so mixed-language queries still match.
 */

export type SeoRouteKey =
  | "home"
  | "about"
  | "services"
  | "gallery"
  | "faq"
  | "contact";

export type PageSeo = {
  title: string;
  description: string;
  keywords: string[];
};

export type LocaleSeo = {
  siteName: string;
  defaultTitle: string;
  /** `%s` is replaced with the page title by Next's title template. */
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  pages: Record<SeoRouteKey, PageSeo>;
  /** Localized breadcrumb label per route, used for BreadcrumbList JSON-LD. */
  breadcrumbs: Record<SeoRouteKey, string>;
};

const AMHARIC: LocaleSeo = {
  siteName: "ሳሚ አውቶ ሰርቪስ",
  defaultTitle: "ሳሚ አውቶ ሰርቪስ — ሐቀኛ የመኪና ጥገና በአዲስ አበባ",
  titleTemplate: "%s | ሳሚ አውቶ ሰርቪስ — አዲስ አበባ",
  defaultDescription:
    "ሳሚ አውቶ ሰርቪስ (SAMI Auto Service) በአዲስ አበባ ሰሚት ኮንዶሚኒየም አካባቢ የሚገኝ የመኪና ጥገና ወርክሾፕ ነው። ፈጣን፣ ሐቀኛ እና ተመጣጣኝ የሞተር፣ የጊር ሳጥን፣ የሱስፔንሽን እና የብሬክ ጥገና። ቀጠሮ አያስፈልግም — ይደውሉ ወይም በቴሌግራም ያግኙን።",
  keywords: [
    "የመኪና ጥገና አዲስ አበባ",
    "መካኒክ አዲስ አበባ",
    "የሞተር ጥገና",
    "የጊር ሳጥን ጥገና",
    "የሱስፔንሽን ጥገና",
    "የብሬክ ጥገና",
    "የመኪና ጋራዥ",
    "ሳሚ አውቶ ሰርቪስ",
    "auto repair Addis Ababa",
  ],
  pages: {
    home: {
      title: "ሳሚ አውቶ ሰርቪስ — ሐቀኛ የመኪና ጥገና በአዲስ አበባ",
      description:
        "ሳሚ አውቶ ሰርቪስ (SAMI Auto Service) በአዲስ አበባ ሰሚት ኮንዶሚኒየም አካባቢ የሚገኝ የመኪና ጥገና ወርክሾፕ ነው። ፈጣን፣ ሐቀኛ እና ተመጣጣኝ የሞተር፣ የጊር ሳጥን፣ የሱስፔንሽን እና የብሬክ ጥገና። ቀጠሮ አያስፈልግም — ይደውሉ ወይም በቴሌግራም ያግኙን።",
      keywords: [
        "የመኪና ጥገና አዲስ አበባ",
        "መካኒክ አዲስ አበባ",
        "የሞተር ጥገና",
        "የጊር ሳጥን ጥገና",
        "የሱስፔንሽን ጥገና",
        "የብሬክ ጥገና",
        "ሳሚ አውቶ ሰርቪስ",
        "auto repair Addis Ababa",
      ],
    },
    about: {
      title: "ስለ እኛ — የአካባቢ የመኪና ጥገና ቡድን በአዲስ አበባ",
      description:
        "ሳሚ አውቶ ሰርቪስ በአዲስ አበባ የሚገኝ፣ በአካባቢው የተመሠረተ የመኪና ጥገና ወርክሾፕ ነው። ልምድ ያላቸው መካኒኮቻችን ሐቀኛ ምርመራ፣ ግልጽ ዋጋ እና ዋስትና ያለው ስራ ይሰጣሉ — ተልዕኳችንን እና እሴቶቻችንን ይወቁ።",
      keywords: [
        "ስለ ሳሚ አውቶ ሰርቪስ",
        "የአካባቢ የመኪና ጥገና",
        "አስተማማኝ መካኒክ አዲስ አበባ",
        "የስራ ዋስትና ያለው ጥገና",
      ],
    },
    services: {
      title: "የመኪና ጥገና አገልግሎቶች — ሞተር፣ ጊር ሳጥን እና ሱስፔንሽን",
      description:
        "የሞተር ጥገና እና ድጋሚ ግንባታ፣ አውቶማቲክ ጊር ሳጥን እና ዲፈረንሻል ጥገና፣ የፓወር ስቲሪንግ፣ የሾክ አብዞርበር እና የብሬክ ጥገና፣ የኦይል እና ፊልተር መቀየር በአዲስ አበባ። ለሁሉም አይነት ተሽከርካሪዎች — ቀጠሮ ሳያስፈልግ።",
      keywords: [
        "የሞተር ጥገና",
        "የሞተር ድጋሚ ግንባታ",
        "አውቶማቲክ ጊር ሳጥን ጥገና",
        "የፓወር ስቲሪንግ ጥገና",
        "የሾክ አብዞርበር ጥገና",
        "የብሬክ ጥገና",
        "የኦይል መቀየር አዲስ አበባ",
      ],
    },
    gallery: {
      title: "የወርክሾፕ እና የጥገና ስራዎች ፎቶዎች",
      description:
        "በሳሚ አውቶ ሰርቪስ ወርክሾፕ የተሰሩ እውነተኛ የሞተር፣ የጊር ሳጥን፣ የሱስፔንሽን እና የብሬክ ጥገና ስራዎችን በፎቶ ይመልከቱ። የአዲስ አበባ ወርክሾፓችንን እና የስራ ዘዴያችንን ይወቁ።",
      keywords: [
        "የጥገና ስራ ፎቶዎች",
        "የወርክሾፕ ፎቶ",
        "የሞተር ጥገና ስራ",
        "አዲስ አበባ የመኪና ጋራዥ",
      ],
    },
    faq: {
      title: "ተደጋጋሚ ጥያቄዎች — ቀጠሮ፣ ዋጋ እና የጥገና ሂደት",
      description:
        "ቀጠሮ ያስፈልጋል? የምርመራ ክፍያ እንዴት ይሰላል? የራስዎን መለዋወጫ እቃ ማምጣት ይችላሉ? የስራ ዋስትና አለ? ስለ አገልግሎቶቻችን፣ ዋጋ እና የጥገና ሂደት የሚጠየቁ ጥያቄዎች ላይ ግልጽ መልሶች።",
      keywords: [
        "የመኪና ጥገና ጥያቄዎች",
        "የምርመራ ክፍያ",
        "የጥገና ዋጋ አዲስ አበባ",
        "የስራ ዋስትና",
      ],
    },
    contact: {
      title: "አግኙን — አድራሻ፣ ስልክ እና የስራ ሰዓት",
      description:
        "ሳሚ አውቶ ሰርቪስ በሰሚት ኮንዶሚኒየም፣ አዲስ አበባ ይገኛል። ስልክ +251 919 238 356። ሰኞ እስከ ቅዳሜ ከጧቱ 8:00 እስከ ከምሽቱ 6:00 ክፍት ነው፤ እሁድ ዝግ ነው። ካርታ፣ አቅጣጫ እና የቴሌግራም አድራሻ እዚህ ያገኛሉ።",
      keywords: [
        "የሳሚ አውቶ ሰርቪስ አድራሻ",
        "የመኪና ጥገና ስልክ ቁጥር አዲስ አበባ",
        "የስራ ሰዓት",
        "ሰሚት ኮንዶሚኒየም ጋራዥ",
        "አቅጣጫ ካርታ",
      ],
    },
  },
  breadcrumbs: {
    home: "መነሻ",
    about: "ስለ እኛ",
    services: "አገልግሎቶች",
    gallery: "ፎቶ ጋለሪ",
    faq: "ተደጋጋሚ ጥያቄዎች",
    contact: "አግኙን",
  },
};

const ENGLISH: LocaleSeo = {
  siteName: business.name,
  defaultTitle: `${business.name} — Reliable Auto Repair in ${business.address.city}`,
  titleTemplate: `%s | ${business.name} — ${business.address.city}`,
  defaultDescription:
    "SAMI Auto Service is an owner-run car repair workshop in Semit Condominium, Addis Ababa. Fast, honest and affordable engine, transmission, suspension and brake repair for all makes and models. No appointment needed — call or message us on Telegram.",
  keywords: [
    "auto repair Addis Ababa",
    "car mechanic Addis Ababa",
    "engine repair",
    "transmission repair",
    "suspension repair",
    "brake repair",
    "car garage Semit Condominium",
    "SAMI Auto Service",
    "የመኪና ጥገና",
  ],
  pages: {
    home: {
      title: `${business.name} — Reliable Auto Repair in ${business.address.city}`,
      description:
        "SAMI Auto Service is an owner-run car repair workshop in Semit Condominium, Addis Ababa. Fast, honest and affordable engine, transmission, suspension and brake repair for all makes and models. No appointment needed — call or message us on Telegram.",
      keywords: [
        "auto repair Addis Ababa",
        "car mechanic Addis Ababa",
        "engine repair Addis Ababa",
        "transmission repair",
        "suspension repair",
        "brake repair",
        "SAMI Auto Service",
        "የመኪና ጥገና",
      ],
    },
    about: {
      title: "About Us — Your Local Auto Repair Team in Addis Ababa",
      description:
        "SAMI Auto Service is a locally owned car repair workshop in Addis Ababa. Experienced mechanics deliver honest diagnosis, transparent pricing and guaranteed workmanship — read our mission, vision and values.",
      keywords: [
        "about SAMI Auto Service",
        "local car repair Addis Ababa",
        "trusted mechanic Addis Ababa",
        "guaranteed car repair",
      ],
    },
    services: {
      title: "Auto Repair Services — Engine, Transmission & Suspension",
      description:
        "Engine repair and overhaul, automatic transmission and differential repair, power steering, shock absorber and brake repair, oil and filter changes in Addis Ababa. All makes and models, no appointment required.",
      keywords: [
        "engine repair",
        "engine overhaul",
        "automatic transmission repair",
        "power steering repair",
        "shock absorber replacement",
        "brake repair",
        "oil change Addis Ababa",
      ],
    },
    gallery: {
      title: "Workshop and Repair Work Photos",
      description:
        "See real engine, transmission, suspension and brake repair work carried out in the SAMI Auto Service workshop in Addis Ababa, and how our team and tools are set up.",
      keywords: [
        "car repair photos",
        "auto workshop gallery",
        "engine repair work",
        "Addis Ababa car garage",
      ],
    },
    faq: {
      title: "FAQ — Appointments, Diagnostic Fees and Repair Process",
      description:
        "Do I need an appointment? How are diagnostic fees calculated? Can I bring my own parts? Is the repair guaranteed? Clear answers about our services, pricing and repair process.",
      keywords: [
        "car repair questions",
        "diagnostic fee",
        "repair pricing Addis Ababa",
        "repair guarantee",
      ],
    },
    contact: {
      title: "Contact Us — Address, Phone and Opening Hours",
      description:
        "SAMI Auto Service is located at Semit Condominium, Addis Ababa. Phone +251 919 238 356. Open Monday to Saturday 8:00 AM – 6:00 PM, closed Sunday. Find the map, directions and our Telegram here.",
      keywords: [
        "SAMI Auto Service address",
        "car repair phone number Addis Ababa",
        "opening hours",
        "Semit Condominium garage",
        "directions map",
      ],
    },
  },
  breadcrumbs: {
    home: "Home",
    about: "About",
    services: "Services",
    gallery: "Gallery",
    faq: "FAQ",
    contact: "Contact",
  },
};


export const SEO_CONTENT: Record<Locale, LocaleSeo> = {
  en: ENGLISH,
  am: AMHARIC,
};

export function getSeoContent(locale: Locale): LocaleSeo {
  return SEO_CONTENT[locale];
}
