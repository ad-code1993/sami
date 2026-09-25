"use client";

import { Phone, Send, MapPin } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { business } from "@/lib/business";

export function StickyConversionTray() {
  const { t } = useLocale();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
      aria-label="Quick actions"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
        <a
          href={business.telephone.href}
          className="flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Phone className="size-5 text-safety-orange" />
          <span>{t("tray.call")}</span>
        </a>

        <a
          href={business.telegram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Send className="size-5 text-telegram-blue" />
          <span>{t("tray.telegram")}</span>
        </a>

        <a
          href={business.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <MapPin className="size-5 text-muted-foreground" />
          <span>{t("tray.directions")}</span>
        </a>
      </div>
    </nav>
  );
}
