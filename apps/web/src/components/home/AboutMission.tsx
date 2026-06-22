"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RiAddLine, RiSubtractLine, RiLeafLine } from "react-icons/ri";

export default function AboutMission() {
  const t = useTranslations("Home.about");
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="container relative py-10 sm:py-16 lg:py-20">
        <div className="bg-white rounded-lg relative pb-8">

          {/* Top bar */}
          <div className="flex items-center gap-x-4 px-8 py-6 border-b border-gray-100">
            <div className="size-11 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
              <RiLeafLine size={22} className="text-[var(--brand)]" />
            </div>
            <div>
              <p className="text-[var(--brand)] text-xs font-semibold mb-0.5">{t("tag")}</p>
              <h2 className="font-extrabold text-[var(--ink)] text-lg lg:text-xl">{t("title")}</h2>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pt-6 pb-4">
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
          </div>

          {/* Toggle button — absolute, centered at bottom */}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 size-8 rounded-full bg-[var(--brand)] text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
          >
            {expanded ? <RiSubtractLine size={18} /> : <RiAddLine size={18} />}
          </button>
        </div>
    </section>
  );
}
