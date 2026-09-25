/**
 * Single source of truth for everything that identifies the business (GEO-L1).
 *
 * Every phone/tel:, Telegram, directions, map embed, JSON-LD, footer and
 * metadata value must be derived from this object — do not hardcode any of it
 * again. `NEXT_PUBLIC_*` variables are readable in both server and client
 * components, so the same values are used everywhere.
 *
 * Owner inputs still needed (see DEPLOYMENT_OPTIMIZATION_PLAN.md §12 Q3):
 * postal code and the Google Business Profile URL/Place ID — the coordinate
 * itself is now confirmed (see the pin below). The remaining values are
 * overridable with environment variables so production data never requires a
 * code change.
 */

const env = {
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER,
  telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL,
  mapsShare: process.env.NEXT_PUBLIC_MAPS_SHARE_URL,
  latitude: process.env.NEXT_PUBLIC_LATITUDE,
  longitude: process.env.NEXT_PUBLIC_LONGITUDE,
} as const;

const E164 = env.phone ?? "+251919238356";
const TELEGRAM_URL = env.telegram ?? "https://t.me/samiautoservice";

/**
 * Canonical workshop pin, confirmed by the owner.
 *
 * Human-readable: 8°59'32.7"N 38°51'09.5"E
 * Decimal (used by every URL below): 8.9924167, 38.8526389
 *
 * TODO(owner): the Google Business Profile URL/Place ID is still missing, so
 * the embed pins bare coordinates and cannot reinforce the listing entity.
 *
 * Superseded — the previous build shipped two conflicting pairs ~13 km apart:
 * 8.992418, 38.8524308 (home) and 9.0317, 38.7361 (contact).
 */
const LATITUDE = Number(env.latitude ?? "8.9924167");
const LONGITUDE = Number(env.longitude ?? "38.8526389");

const SHARE_URL =
  env.mapsShare ?? `https://maps.google.com/?q=${LATITUDE},${LONGITUDE}`;

/** E.164 digits only, for `tel:` hrefs. */
const phoneDigits = E164.replace(/[^\d+]/g, "");

/** "+251919238356" → "+251 919 238 356" */
function formatPhone(value: string): string {
  const match = /^\+(\d{3})(\d{3})(\d{3})(\d{3})$/.exec(value);
  if (!match) return value;
  return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
}

const address = {
  /** Street as given by the owner. TODO(owner): postal code from the Business Profile. */
  street: "Semit Condominium",
  subCity: "",
  city: "Addis Ababa",
  region: "Addis Ababa",
  postalCode: "",
  country: "Ethiopia",
  countryCode: "ET",
} as const;

/** Full address for display, skipping the parts that are not known yet. */
const displayLocation = [
  address.street,
  address.subCity,
  address.city,
  address.country,
].filter(Boolean).join(", ");

export const business = {
  name: "SAMI Auto Service",
  /** Name used in Amharic copy — keep in sync with `site.name` in am.json. */
  localName: "ሳሚ አውቶ ሰርቪስ",
  description:
    "Fast, honest, and affordable mechanical repair for all vehicles.",
  telephone: {
    /** Machine readable, E.164 — used by `tel:` links and JSON-LD. */
    e164: E164,
    /** Human readable — used for display. */
    display: formatPhone(E164),
    href: `tel:${phoneDigits}`,
  },
  telegram: {
    url: TELEGRAM_URL,
    handle: `@${TELEGRAM_URL.replace(/^https?:\/\/t\.me\//, "")}`,
  },
  address,
  /** "Semit Condominium, Addis Ababa, Ethiopia" — full NAP display string. */
  displayLocation,
  geo: {
    latitude: LATITUDE,
    longitude: LONGITUDE,
  },
  /** Coordinates in the "lat,lng" form Google Maps expects. */
  coordinates: `${LATITUDE},${LONGITUDE}`,
  hours: {
    /** Mon–Sat 08:00–18:00, closed Sunday. */
    opens: "08:00",
    closes: "18:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
  languages: ["en", "am"] as const,
  /** Plain share link — for social profiles / `sameAs`. */
  mapsShareUrl: SHARE_URL,
  /** Turn-by-turn navigation intent — for every "Directions" CTA. */
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${LATITUDE},${LONGITUDE}`,
  /** Google Business Profile — TODO(owner): replace with the profile URL. */
  gbpUrl: SHARE_URL,
} as const;

/** Keyless Google Maps embed URL (no bare `0x0:0x0` place ID). */
export function mapEmbedUrl(locale: string): string {
  const hl = locale === "am" ? "am" : "en";
  return `https://maps.google.com/maps?q=${business.coordinates}&z=16&hl=${hl}&output=embed`;
}

