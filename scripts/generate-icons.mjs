import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require(
  path.join(process.cwd(), "node_modules/.pnpm/sharp@0.34.5/node_modules/sharp")
);

const CHARCOAL = "#1A1A1A";
const ORANGE = "#E65F19";

// NAP text on the share card — keep in sync with src/lib/business.ts.
const OG_PHONE = "+251 919 238 356";
const OG_ADDRESS = "Semit Condominium, Addis Ababa, Ethiopia";

const mark = fs.readFileSync("public/mobilelogo.svg", "utf8");
const markD = /\sd="([^"]+)"/.exec(mark)[1];
const MOBILE_VB = "210 278 640 304";

const lockup = fs.readFileSync("public/tabletlogo.svg", "utf8");
const lockupD = /\sd="([^"]+)"/.exec(lockup)[1];

/** White monogram, optionally inset inside a rounded charcoal tile. */
const tile = ({ size, inset, radius, bg }) => {
  const [vx, vy, vw, vh] = MOBILE_VB.split(" ").map(Number);
  const pad = vw * inset;
  const scale = (size - pad * 2) / vw;
  const dx = pad - vx * scale;
  const dy = (size - vh * scale) / 2 - vy * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" fill="${bg}"/>
  <g transform="translate(${dx.toFixed(2)} ${dy.toFixed(2)}) scale(${scale.toFixed(5)})">
    <path d="${markD}" fill="none" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;
};

// 1. Scalable app/tab icon — readable on both light and dark browser chrome.
const icon = tile({ size: 512, inset: 0.06, radius: 96, bg: CHARCOAL });
fs.writeFileSync("src/app/icon.svg", icon + "\n");

// 2. iOS home-screen icon (bitmap only per the Next file convention).
const appleIcon = tile({ size: 180, inset: 0.05, radius: 0, bg: CHARCOAL });
await sharp(Buffer.from(appleIcon), { density: 600 })
  .png({ compressionLevel: 9, palette: true, colours: 64 })
  .toFile("src/app/apple-icon.png");

// 3. Open Graph / Telegram share card (1200x630).
const ogW = 1200;
const ogH = 630;
const lockupScale = 640 / 772;
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${ogW}" height="${ogH}" viewBox="0 0 ${ogW} ${ogH}">
  <rect width="${ogW}" height="${ogH}" fill="${CHARCOAL}"/>
  <rect x="0" y="0" width="${ogW}" height="10" fill="${ORANGE}"/>
  <g transform="translate(${(ogW - 772 * lockupScale) / 2} ${180 - 362 * lockupScale}) scale(${lockupScale})">
    <path d="${lockupD}" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="${ogW / 2}" y="470" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="700" fill="#FFFFFF">${OG_PHONE}</text>
  <text x="${ogW / 2}" y="530" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="${ORANGE}">${OG_ADDRESS}</text>
</svg>`;
await sharp(Buffer.from(og), { density: 300 })
  .png({ compressionLevel: 9, palette: true })
  .toFile("src/app/opengraph-image.png");

for (const f of ["src/app/icon.svg", "src/app/apple-icon.png", "src/app/opengraph-image.png"]) {
  console.log(f, fs.statSync(f).size, "bytes");
}
