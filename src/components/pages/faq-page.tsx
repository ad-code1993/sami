"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useLocale } from "@/lib/locale-context";
import { GlobalHeader } from "@/components/global-header";
import { StickyConversionTray } from "@/components/sticky-conversion-tray";
import { FinalCTAFooter } from "@/components/final-cta-footer";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  items: FAQItem[];
}

export function FAQPage() {
  const { t } = useLocale();

  // Build FAQ categories from translation keys
  const categories: FAQCategory[] = [];
  const categoryCount = 3;
  const itemCounts = [2, 2, 2]; // items per category

  for (let ci = 0; ci < categoryCount; ci++) {
    const name = t(`faqPage.categories[${ci}].name`);
    const items: FAQItem[] = [];
    for (let ii = 0; ii < itemCounts[ci]; ii++) {
      const question = t(`faqPage.categories[${ci}].items[${ii}].question`);
      const answer = t(`faqPage.categories[${ci}].items[${ii}].answer`);
      items.push({ question, answer });
    }
    categories.push({ name, items });
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray pb-16 md:pb-0">
      <GlobalHeader />

      <main className="flex-1 pt-14">
        {/* Hero Section */}
        <section
          className="relative flex items-center"
          style={{
            minHeight: "35vh",
            backgroundImage:
              'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQc16VcLyF40y9xjMbOyJG-PvE-5-rQM4CQORHG2U0zhQ&s=10")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            className="absolute bg-neutral-gray inset-0"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)",
            }}
          />
          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 md:flex-row md:items-center md:gap-8">
            <div className="flex-1">
              <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight text-white">
                {t("faqPage.hero.title")}
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-gray-300 sm:text-lg">
                {t("faqPage.hero.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Categories */}
        <section className="bg-neutral-gray py-12">
          <div className="mx-auto max-w-3xl px-4">
            {categories.map((category, ci) => (
              <div key={ci} className="mb-10 last:mb-0">
                <h2 className="mb-4 text-lg font-bold text-charcoal">
                  {category.name}
                </h2>
                <Accordion className="gap-2">
                  {category.items.map((item, ii) => (
                    <AccordionItem
                      key={ii}
                      value={`${ci}-${ii}`}
                      className="rounded-lg border border-gray-200 overflow-hidden"
                    >
                       <AccordionTrigger className="px-4 py-3 text-sm font-medium text-charcoal bg-white">
                         {item.question}
                       </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3 text-sm leading-relaxed text-gray-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        <FinalCTAFooter />
      </main>

      <StickyConversionTray />
    </div>
  );
}
