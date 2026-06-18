"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RiAddLine, RiSubtractLine, RiLeafLine } from "react-icons/ri";

export default function AboutMission() {
  const t = useTranslations("Home.about");
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-14">
      <div className="container">
        <div className="rounded-3xl border border-[var(--brand)]/15 bg-white overflow-hidden shadow-sm">

          {/* Top bar */}
          <div className="flex items-center gap-x-4 px-8 py-6 border-b border-gray-50">
            <div className="size-11 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
              <RiLeafLine size={22} className="text-[var(--brand)]" />
            </div>
            <div>
              <p className="text-[var(--brand)] text-xs font-semibold mb-0.5">{t("tag")}</p>
              <h2 className="font-extrabold text-[var(--ink)] text-lg lg:text-xl">{t("title")}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {/* Always-visible intro — ~8 lines */}
            <div className="text-[var(--ink)] text-[15px] leading-8 space-y-4">
              <p>{t("intro")}</p>
              <p>{t("body_1")}</p>
            </div>

            {/* Expandable remainder */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                expanded ? "max-h-[400px] opacity-100 mt-4" : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-4 text-[15px] leading-8 text-[var(--ink)]">
                <p>{t("body_2")}</p>
                <p>{t("body_3")}</p>
              </div>
            </div>

            {/* Toggle button */}
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-7 flex items-center gap-x-2 mx-auto px-7 py-2.5 rounded-xl border-2 border-[var(--brand)]/30 text-[var(--brand)] font-semibold text-sm hover:border-[var(--brand)] hover:bg-[var(--brand)]/5 transition-all cursor-pointer"
            >
              {expanded ? <RiSubtractLine size={18} /> : <RiAddLine size={18} />}
              {expanded ? t("btn_less") : t("btn_more")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
