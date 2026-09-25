"use client";

import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/lib/locale-context";

export function WorkflowTimeline() {
  const { t } = useLocale();

  return (
    <section className="bg-neutral-gray py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-xl font-semibold tracking-tight sm:text-2xl">
          Our Process
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Step Number */}
              <div className="flex size-12 items-center justify-center rounded-full bg-charcoal text-lg font-bold text-white">
                {index + 1}
              </div>

              {/* Connector line */}
              {index < 3 && (
                <div className="hidden h-8 w-0.5 bg-muted-foreground/40 lg:block" />
              )}

              {/* Content */}
              <div className="mt-3">
                <h3 className="text-base font-semibold">{t(`workflow.steps[${index}].title`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t(`workflow.steps[${index}].description`)}
                </p>
              </div>

              {/* Mobile separator */}
              {index < 3 && (
                <Separator className="mt-6 sm:hidden" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
