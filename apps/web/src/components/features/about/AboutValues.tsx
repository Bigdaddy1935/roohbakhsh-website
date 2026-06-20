"use client";

import { useTranslations } from "next-intl";
import {
  RiShieldCheckLine,
  RiHeartLine,
  RiLightbulbLine,
  RiTeamLine,
} from "react-icons/ri";

const VALUES = [
  { key: "quality",     Icon: RiShieldCheckLine, color: "from-emerald-400 to-teal-500" },
  { key: "sincerity",   Icon: RiHeartLine,        color: "from-rose-400 to-pink-500"   },
  { key: "innovation",  Icon: RiLightbulbLine,    color: "from-amber-400 to-orange-500"},
  { key: "community",   Icon: RiTeamLine,         color: "from-blue-400 to-indigo-500" },
] as const;

export default function AboutValues() {
  const t = useTranslations("About.values");
  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-[var(--brand)] text-sm font-semibold mb-1">{t("subtitle")}</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)]">{t("title")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map(({ key, Icon, color }) => (
            <div key={key} className="flex flex-col items-center text-center gap-y-4 p-7 rounded-xl bg-white border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className={`size-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <Icon size={26} className="text-white" />
              </div>
              <h3 className="font-extrabold text-[var(--ink)]">{t(`${key}_title`)}</h3>
              <p className="text-sm text-gray-500 leading-7">{t(`${key}_desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
