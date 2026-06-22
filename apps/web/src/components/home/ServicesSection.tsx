"use client";

import { useTranslations } from "next-intl";
import {
  RiCustomerService2Line,
  RiBookOpenLine,
  RiNodeTree,
  RiShieldCheckLine,
} from "react-icons/ri";

const SERVICES = [
  { key: "qa",        Icon: RiCustomerService2Line, bg: "bg-emerald-50",  iconColor: "text-emerald-500" },
  { key: "education", Icon: RiBookOpenLine,          bg: "bg-blue-50",     iconColor: "text-blue-500"    },
  { key: "topics",    Icon: RiNodeTree,              bg: "bg-violet-50",   iconColor: "text-violet-500"  },
  { key: "guarantee", Icon: RiShieldCheckLine,       bg: "bg-amber-50",    iconColor: "text-amber-500"   },
] as const;

export default function ServicesSection() {
  const t = useTranslations("Home.services");

  return (
    <section className="container relative py-10 sm:py-16 lg:py-20">

        {/* Header */}
        <div className="flex items-center gap-x-4 sm:gap-x-7 mb-12">
          <div className="hidden sm:block w-full h-px bg-gray-200" />
          <h2 className="flex items-center gap-x-1 shrink-0 text-xl sm:text-2xl md:text-3xl font-bold cursor-default whitespace-nowrap">
            <span className="text-[var(--ink)]">{t("title_1")}</span>
            <span className="text-[var(--brand)]">{t("title_2")}</span>
          </h2>
          <div className="hidden sm:block w-full h-px bg-gray-200" />
        </div>

        {/* Cards grid — 2 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SERVICES.map(({ key, Icon, bg, iconColor }) => (
            <div
              key={key}
              className="flex items-center gap-x-4 p-6 rounded-lg border border-gray-100 bg-white text-start"
            >
              {/* Icon */}
              <div className={`size-14 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={26} className={iconColor} />
              </div>

              <div className="flex flex-col gap-y-1.5">
                <h3 className="font-bold text-[var(--ink)] text-base leading-6">
                  {t(`${key}_title`)}
                </h3>
                <p className="text-sm text-gray-500 leading-7 min-h-[3.5rem]">
                  {t(`${key}_desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
    </section>
  );
}
