"use client";

import { useEffect, useState } from "react";
import { readStoredLocale, useLocale } from "@/lib/locale-context";
import { LogoMark } from "@/components/logo-mark";
import { Languages } from "lucide-react";

/**
 * First-visit language chooser.
 *
 * With URL-based locales (SEO-03) the language is already resolved from the
 * path, so this is only a convenience for a visitor who arrives without a stored
 * preference: picking a language simply navigates to the other locale's URL and
 * remembers the choice in a cookie.
 */
export function LanguageModal() {
  const { setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only ask when there is no remembered choice — never over an explicit URL.
    if (readStoredLocale() !== null) return;

    const timer = window.setTimeout(() => setOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!open) return null;

  function handleSelect(newLocale: "en" | "am") {
    setOpen(false);
    setLocale(newLocale);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Logo — currentColor stroke keeps the line-art visible on the white card */}
        <div className="mb-4 flex justify-center">
          <LogoMark
            title={t("site.name")}
            className="h-10 w-auto text-charcoal"
          />
        </div>

        {/* Heading */}
        <h2 className="text-center text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          {t("modal.title")}
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          {t("modal.subtitle")}
        </p>

        {/* Language Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => handleSelect("en")}
            className="flex items-center gap-4 rounded-xl border-2 border-gray-200 p-4 text-left transition-all hover:border-safety-orange hover:bg-orange-50 active:scale-[0.98]"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-lg">
              🇬🇧
            </span>
            <div>
              <p className="text-base font-semibold text-gray-900">English</p>
              <p className="text-sm text-gray-500">English</p>
            </div>
          </button>

          <button
            onClick={() => handleSelect("am")}
            className="flex items-center gap-4 rounded-xl border-2 border-gray-200 p-4 text-left transition-all hover:border-safety-orange hover:bg-orange-50 active:scale-[0.98]"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-green-100 text-lg">
              🇪🇹
            </span>
            <div>
              <p className="text-base font-semibold text-gray-900">አማርኛ</p>
              <p className="text-sm text-gray-500">Amharic</p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          <Languages className="inline size-3 mr-1" />
          {t("site.name")}
        </p>
      </div>
    </div>
  );
}