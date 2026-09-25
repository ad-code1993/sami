import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import NotFoundContent from "@/components/not-found-content";
import { toLocale } from "@/lib/i18n";
import { rootMetadata } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const locale = toLocale(requestHeaders.get("x-sami-locale"));
  return {
    ...rootMetadata(locale),
    title: locale === "am" ? "ገጹ አልተገኘም" : "Page Not Found",
    robots: { index: false, follow: false },
  };
}

/**
 * Next 16 global 404 for a root layout under `[locale]`. It bypasses the normal
 * route tree, so it must render the complete HTML document itself.
 */
export default async function GlobalNotFound() {
  const requestHeaders = await headers();
  const locale = toLocale(requestHeaders.get("x-sami-locale"));

  return (
    <html
      lang={locale === "am" ? "am" : "en"}
      dir="ltr"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <NotFoundContent locale={locale} />
      </body>
    </html>
  );
}
