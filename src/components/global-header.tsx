"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Languages } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { localePath } from "@/lib/i18n";
import { LogoMark } from "@/components/logo-mark";
import Link from "next/link";

const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "gallery", href: "/gallery" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
] as const;

const SCROLL_THRESHOLD = 80;
const HIDE_DELAY = 150;

export function GlobalHeader() {
  const [open, setOpen] = useState(false);
  const { t, locale, setLocale } = useLocale();

  // Smart scroll state
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Track if we've scrolled past the threshold (for visual styling)
      setIsScrolled(currentScrollY > SCROLL_THRESHOLD);

      // Smart hide/show based on scroll direction
      if (currentScrollY > SCROLL_THRESHOLD) {
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down — hide header with a small delay
          if (!hideTimer.current) {
            hideTimer.current = setTimeout(() => {
              setIsVisible(false);
              hideTimer.current = null;
            }, HIDE_DELAY);
          }
        } else {
          // Scrolling up — show header immediately
          if (hideTimer.current) {
            clearTimeout(hideTimer.current);
            hideTimer.current = null;
          }
          setIsVisible(true);
        }
      } else {
        // At the top — always show
        if (hideTimer.current) {
          clearTimeout(hideTimer.current);
          hideTimer.current = null;
        }
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 z-40 w-full bg-charcoal text-white transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled
          ? "shadow-[0_2px_12px_rgba(0,0,0,0.3)] border-b border-white/10"
          : "shadow-none border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href={localePath(locale, "/")}
          aria-label={t("site.name")}
          className="flex items-center gap-2"
        >
          {/* True display size is 32px tall inside the 56px bar (A11Y-03).
              Deliberately NOT priority-preloaded: the logo is above the fold but
              is not the LCP element (SPEED-05). Decorative — the link's
              aria-label carries the accessible name for both breakpoints. */}
          <LogoMark className="h-8 w-auto shrink-0 text-white" />
          <span className="text-lg font-semibold text-white md:block hidden">{t("site.name")}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={localePath(locale, item.href)}
              className="rounded-md px-3 py-1.5 text-sm text-white/70 transition-colors hover:text-white hover:bg-white/10"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          {/* Language Switcher */}
          <button
            onClick={() => setLocale(locale === "en" ? "am" : "en")}
            className="ml-2 flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-white/70 transition-colors hover:text-white hover:bg-white/10"
            aria-label="Switch language"
          >
            <Languages className="size-3.5" />
            <span>{locale === "en" ? "አማ" : "EN"}</span>
          </button>
        </nav>

        {/* Mobile Menu Trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 md:hidden"
              />
            }
          >
            <Menu className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-72 bg-charcoal text-white border-white/10"
          >
            <nav className="mt-8 flex flex-col gap-2" aria-label="Mobile">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={localePath(locale, item.href)}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-base text-white/70 transition-colors hover:text-white hover:bg-white/10"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
              {/* Mobile Language Switcher */}
              <button
                onClick={() => {
                  setLocale(locale === "en" ? "am" : "en");
                  setOpen(false);
                }}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-base text-white/70 transition-colors hover:text-white hover:bg-white/10"
              >
                <Languages className="size-4" />
                <span>{locale === "en" ? "አማርኛ" : "English"}</span>
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}