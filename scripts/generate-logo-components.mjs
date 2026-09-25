import fs from "node:fs";

const read = (p) => fs.readFileSync(p, "utf8");
const mobile = read("public/mobilelogo.svg");
const tablet = read("public/tabletlogo.svg");

const mobileD = /\sd="([^"]+)"/.exec(mobile)[1];
const tabletD = /\sd="([^"]+)"/.exec(tablet)[1];

// Tight, padded viewBoxes measured from the rendered artwork (see probe.mjs)
const MOBILE_VB = "210 278 640 304";
const TABLET_VB = "118 362 772 228";

const header = `/* AUTO-GENERATED from public/mobilelogo.svg — regenerate if the artwork changes. */
`;

const mark = `${header}
import type { SVGProps } from "react";

/**
 * Tight viewBox of the artwork (the source SVG ships a 1024x1024 canvas that is
 * ~80% empty padding, which made the mark render tiny inside every icon box).
 */
export const LOGO_MARK_VIEWBOX = "${MOBILE_VB}";

/** Intrinsic size of the cropped artwork — keep in sync with the viewBox. */
export const LOGO_MARK_WIDTH = 128;
export const LOGO_MARK_HEIGHT = 61;

const LOGO_MARK_PATH =
  "${mobileD}";

type LogoMarkProps = SVGProps<SVGSVGElement> & {
  /** Accessible name. Omit when the mark sits next to a visible wordmark. */
  title?: string;
};

/**
 * The "SA" monogram. The artwork is line-art, so it is painted with
 * currentColor as a stroke (the original hairline is invisible at UI sizes and
 * on dark backgrounds — see public/mobilelogo.svg).
 */
export function LogoMark({ title, ...props }: LogoMarkProps) {
  const decorative = !title;

  return (
    <svg
      viewBox={LOGO_MARK_VIEWBOX}
      width={LOGO_MARK_WIDTH}
      height={LOGO_MARK_HEIGHT}
      fill="none"
      stroke="currentColor"
      strokeWidth={14}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      focusable="false"
      {...props}
    >
      <path d={LOGO_MARK_PATH} />
    </svg>
  );
}
`;

const lockup = `${header}
import type { SVGProps } from "react";

/** Tight viewBox of the monogram + "SAMI AUTO SERVICE" wordmark lockup. */
export const LOGO_LOCKUP_VIEWBOX = "${TABLET_VB}";
export const LOGO_LOCKUP_WIDTH = 193;
export const LOGO_LOCKUP_HEIGHT = 57;

const LOGO_LOCKUP_PATH =
  "${tabletD}";

type LogoLockupProps = SVGProps<SVGSVGElement> & {
  /** Accessible name. Omit when a visible wordmark repeats the name. */
  title?: string;
};

/**
 * Monogram + wordmark. Same line-art treatment as LogoMark but with a finer
 * stroke so the secondary "AUTO SERVICE" line stays legible.
 */
export function LogoLockup({ title, ...props }: LogoLockupProps) {
  const decorative = !title;

  return (
    <svg
      viewBox={LOGO_LOCKUP_VIEWBOX}
      width={LOGO_LOCKUP_WIDTH}
      height={LOGO_LOCKUP_HEIGHT}
      fill="none"
      stroke="currentColor"
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      focusable="false"
      {...props}
    >
      <path d={LOGO_LOCKUP_PATH} />
    </svg>
  );
}
`;

fs.mkdirSync("scripts", { recursive: true });
fs.writeFileSync("src/components/logo-mark.tsx", mark);
fs.writeFileSync("src/components/logo-lockup.tsx", lockup);
console.log("logo-mark.tsx", mark.length, "bytes; logo-lockup.tsx", lockup.length, "bytes");

// Also normalise the public assets so <img>/JSON-LD/manifest consumers get a
// cropped, correctly coloured vector instead of the padded black original.
const rebuilt = (vb, w, h, d) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${vb}" fill="none" stroke="#1A1A1A" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>\n`;

fs.writeFileSync(
  "public/mobilelogo.svg",
  rebuilt(MOBILE_VB, 128, 61, mobileD)
);
fs.writeFileSync(
  "public/tabletlogo.svg",
  rebuilt(TABLET_VB, 193, 57, tabletD).replace(
    'stroke-width="14"',
    'stroke-width="7"'
  )
);
console.log("public svgs normalised");
