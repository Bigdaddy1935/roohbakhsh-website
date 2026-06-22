"use client";

import { useTranslations } from "next-intl";
import {
  RiUserLine,
  RiBookOpenLine,
  RiTimeLine,
  RiAwardLine,
} from "react-icons/ri";

const ICONS = [RiUserLine, RiBookOpenLine, RiTimeLine, RiAwardLine];
const KEYS = ["stat_1", "stat_2", "stat_3", "stat_4"] as const;

export default function StatsBar() {
  const t = useTranslations("Home.stats");

  return (
    <section className="border-y border-gray-100 py-8">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {KEYS.map((key, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={key}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-start"
              >
                <div className="size-12 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-[var(--brand)]" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[var(--ink)]">
                    {t(`${key}_value`)}
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">{t(`${key}_label`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
