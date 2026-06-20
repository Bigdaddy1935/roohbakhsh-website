"use client";

import { useTranslations } from "next-intl";
import { RiShieldCheckLine, RiArrowLeftSLine } from "react-icons/ri";
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
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#edfaf5] to-[var(--bg)] py-14 border-b border-gray-100">
        <div className="container">
          <div className="flex items-center gap-x-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-[var(--brand)] transition-colors">{t("breadcrumb_home")}</Link>
            <RiArrowLeftSLine size={16} className="shrink-0 rotate-180" />
            <span className="text-[var(--ink)]">{t("breadcrumb_terms")}</span>
          </div>
          <div className="flex items-center gap-x-5">
            <div className="size-14 rounded-2xl bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
              <RiShieldCheckLine size={28} className="text-[var(--brand)]" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)]">{t("title")}</h1>
              <p className="text-gray-400 text-sm mt-1">{t("updated")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          {/* Intro */}
          <p className="text-[var(--ink)] leading-8 text-[15px] mb-10 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
            {t("intro")}
          </p>

          {/* Sections */}
          <div className="flex flex-col gap-y-8">
            {SECTION_KEYS.map((key, i) => (
              <div key={key} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-x-4 px-6 py-4 border-b border-gray-50">
                  <span className="size-8 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] text-sm font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <h2 className="font-extrabold text-[var(--ink)] text-base">{t(`${key}_title`)}</h2>
                </div>
                <p className="px-6 py-5 text-[15px] text-gray-600 leading-8">
                  {t(`${key}_body`)}
                </p>
              </div>
            ))}
          </div>

          {/* Contact note */}
          <div className="mt-10 p-6 rounded-2xl bg-[var(--brand)]/5 border border-[var(--brand)]/15 text-center">
            <p className="text-sm text-gray-600 leading-7">{t("contact_note")}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-x-1.5 mt-3 px-5 py-2 rounded-xl bg-[var(--brand)] text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              {t("contact_cta")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
