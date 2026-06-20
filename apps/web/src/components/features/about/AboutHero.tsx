"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiArrowLeftSLine, RiGraduationCapLine } from "react-icons/ri";

export default function AboutHero() {
  const t = useTranslations("About.hero");
  return (
    <section className="bg-gradient-to-b from-[#edfaf5] to-[var(--bg)] py-16 border-b border-gray-100">
      <div className="container">
        <div className="flex items-center gap-x-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-[var(--brand)] transition-colors">{t("breadcrumb_home")}</Link>
          <RiArrowLeftSLine size={16} className="rotate-180 shrink-0" />
          <span className="text-[var(--ink)]">{t("breadcrumb_about")}</span>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 flex flex-col gap-y-5 text-center lg:text-start">
            <span className="inline-flex items-center gap-x-2 self-center lg:self-start px-4 py-1.5 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-sm font-bold">
              <RiGraduationCapLine size={16} />
              {t("badge")}
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[var(--ink)] leading-tight">
              {t("title")}
            </h1>
            <p className="text-gray-500 leading-8 text-[15px] max-w-xl mx-auto lg:mx-0">
              {t("subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-2">
              {(["stat_1","stat_2","stat_3"] as const).map(k => (
                <div key={k} className="bg-white rounded-2xl border border-gray-100 px-5 py-3 text-center shadow-sm">
                  <p className="text-xl font-extrabold text-[var(--brand)]">{t(`${k}_value`)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t(`${k}_label`)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full max-w-sm lg:max-w-none">
            <div className="rounded-3xl bg-gradient-to-br from-[var(--brand)] to-[#077a61] aspect-[4/3] flex items-center justify-center shadow-2xl shadow-[var(--brand)]/20">
              <RiGraduationCapLine size={96} className="text-white/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
