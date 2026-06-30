"use client";

import { useTranslations } from "next-intl";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "@/i18n/navigation";

const SECTION_KEYS = [
  "acceptance",
  "eligibility",
  "content_use",
  "payments",
  "refund",
  "conduct",
  "privacy",
  "changes",
] as const;

export default function TermsContent() {
  const t = useTranslations("Terms");

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      {/* Breadcrumb */}
      <div className="py-8 border-b border-gray-100">
        <div className="container">
          <div className="flex items-center gap-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-[var(--brand)] transition-colors">{t("breadcrumb_home")}</Link>
            <RiArrowLeftSLine size={16} className="shrink-0 rotate-180" />
            <span className="text-[var(--ink)]">{t("breadcrumb_terms")}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-6 pb-24">
        <div className="bg-white w-full rounded-lg p-8 sm:p-12">
          {/* Intro */}
          <p className="text-[var(--ink)] leading-9 text-[15px] mb-10 pb-8 border-b border-gray-100">
            {t("intro")}
          </p>

          {/* Sections */}
          <div className="flex flex-col gap-y-10">
            {SECTION_KEYS.map((key, i) => (
              <div key={key}>
                <div className="flex items-center gap-x-3 mb-4">
                  <span className="size-7 rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <h2 className="font-extrabold text-[var(--ink)] text-base">{t(`${key}_title`)}</h2>
                </div>
                <p className="text-[15px] text-gray-600 leading-9 pe-10">
                  {t(`${key}_body`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
