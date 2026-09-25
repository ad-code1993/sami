"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { localePath } from "@/lib/i18n";
import Link from "next/link";

export function MiniFAQ() {
  const { locale, t } = useLocale();

  return (
    <section className="bg-neutral-gray py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-xl font-semibold tracking-tight sm:text-2xl">
          {t("faq.heading")}
        </h2>

        <Accordion className="w-full gap-2 sm:gap-3">
          {[0, 1].map((index) => (
            <AccordionItem key={index} value={`item-${index}`} className="rounded-lg border bg-white overflow-hidden">
              <AccordionTrigger className="text-left px-4 py-3 text-sm font-medium transition-colors hover:bg-muted sm:text-base">
                {t(`faq.items[${index}].question`)}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 text-sm leading-relaxed text-muted-foreground">
                {t(`faq.items[${index}].answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-6 flex justify-center">
          <Link
            href={localePath(locale, "/faq")}
            className="inline-flex items-center gap-1 text-sm font-medium text-safety-orange hover:underline"
          >
            {t("faq.seeMore")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
