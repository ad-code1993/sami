import Link from "next/link";
import { ArrowRight, Home, Phone } from "lucide-react";
import { business } from "@/lib/business";
import {
  getDictionary,
  localePath,
  translate,
  type Locale,
} from "@/lib/i18n";

/** Server-rendered branded 404 UI shared by the locale boundary files. */
export default function NotFoundContent({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const t = (key: string) => translate(dictionary, key);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-gray px-4 py-16 text-center">
      <p className="text-sm font-semibold tracking-widest text-safety-orange">
        404
      </p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-charcoal sm:text-3xl">
        {t("notFound.title")}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600">
        {t("notFound.description")}
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href={localePath(locale, "/")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-safety-orange px-4 text-sm font-semibold text-white transition-all hover:bg-safety-orange/90"
        >
          <Home className="size-4" aria-hidden="true" />
          {t("notFound.backHome")}
        </Link>
        <Link
          href={localePath(locale, "/services")}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-charcoal/15 px-4 text-sm font-semibold text-charcoal transition-colors hover:bg-white"
        >
          {t("notFound.viewServices")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <a
          href={business.telephone.href}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-charcoal/15 px-4 text-sm font-semibold text-charcoal transition-colors hover:bg-white"
        >
          <Phone className="size-4" aria-hidden="true" />
          {t("hero.callNow")}
        </a>
      </div>
    </div>
  );
}
