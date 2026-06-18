"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiArrowLeftSLine, RiGraduationCapLine } from "react-icons/ri";

export default function CtaBanner() {
  const t = useTranslations("Home.cta");

  return (
    <section className="py-16">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--brand)] to-[#077a61] px-8 py-14 lg:px-16 text-center lg:text-start">

          {/* Decorative */}
          <span className="pointer-events-none absolute -top-16 -end-16 size-64 rounded-full bg-white/5 blur-2xl" />
          <span className="pointer-events-none absolute -bottom-10 start-10 size-48 rounded-full bg-white/8 blur-2xl" />

          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            <div className="size-20 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <RiGraduationCapLine size={40} className="text-white" />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                {t("title")}
              </h2>
              <p className="text-white/70 text-sm mt-3 leading-7 max-w-xl">
                {t("description")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/auth/signup"
                className="flex items-center justify-center gap-x-2 h-12 px-7 rounded-xl bg-[var(--cta)] text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-black/20"
              >
                {t("cta_primary")}
                <RiArrowLeftSLine size={18} />
              </Link>
              <Link
                href="/courses"
                className="flex items-center justify-center gap-x-2 h-12 px-7 rounded-xl bg-white/15 border border-white/30 text-white font-bold text-sm hover:bg-white/25 transition-all"
              >
                {t("cta_secondary")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
