"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiArrowLeftSLine } from "react-icons/ri";

export default function AboutCta() {
  const t = useTranslations("About.cta");
  return (
    <section className="py-16">
      <div className="container">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#077a61] px-8 py-14 text-center">
          <span className="pointer-events-none absolute -top-16 -end-16 size-64 rounded-full bg-white/5 blur-2xl" />
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-4">{t("title")}</h2>
          <p className="text-white/70 text-sm leading-7 max-w-lg mx-auto mb-8">{t("desc")}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/auth/signup" className="flex items-center gap-x-1.5 h-12 px-8 rounded-xl bg-[var(--cta)] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg">
              {t("cta_primary")} <RiArrowLeftSLine size={18} />
            </Link>
            <Link href="/courses" className="flex items-center gap-x-1.5 h-12 px-8 rounded-xl bg-white/15 border border-white/30 text-white font-bold text-sm hover:bg-white/25 transition-all">
              {t("cta_secondary")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
