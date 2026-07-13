"use client";

import { useTranslations } from "next-intl";
import { RiLeafLine, RiEyeLine } from "react-icons/ri";

export default function AboutMission() {
  const t = useTranslations("About.mission");
  return (
    <section className="py-16">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="p-8 rounded-md border border-gray-100 bg-white">
            <div className="size-12 rounded-md bg-[var(--brand)]/10 flex items-center justify-center mb-5">
              <RiLeafLine size={24} className="text-[var(--brand)]" />
            </div>
            <h2 className="text-xl font-extrabold text-[var(--ink)] mb-4">{t("mission_title")}</h2>
            <p className="text-[15px] text-gray-600 leading-8">{t("mission_body")}</p>
          </div>
          {/* Vision */}
          <div className="p-8 rounded-md border border-gray-100 bg-white">
            <div className="size-12 rounded-md bg-[var(--cta)]/10 flex items-center justify-center mb-5">
              <RiEyeLine size={24} className="text-[var(--cta)]" />
            </div>
            <h2 className="text-xl font-extrabold text-[var(--ink)] mb-4">{t("vision_title")}</h2>
            <p className="text-[15px] text-gray-600 leading-8">{t("vision_body")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
