"use client";

import { useTranslations } from "next-intl";
import {
  RiCustomerService2Line,
  RiBookOpenLine,
  RiNodeTree,
  RiShieldCheckLine,
} from "react-icons/ri";

const SERVICES = [
  { key: "qa",        Icon: RiCustomerService2Line, color: "from-emerald-400 to-teal-500",  shadow: "shadow-emerald-200" },
  { key: "education", Icon: RiBookOpenLine,          color: "from-blue-400 to-indigo-500",   shadow: "shadow-blue-200"   },
  { key: "topics",    Icon: RiNodeTree,              color: "from-violet-400 to-purple-500", shadow: "shadow-violet-200" },
  { key: "guarantee", Icon: RiShieldCheckLine,       color: "from-amber-400 to-orange-500",  shadow: "shadow-amber-200"  },
] as const;

export default function ServicesSection() {
  const t = useTranslations("Home.services");

  return (
    <section className="py-16 bg-white">
      <div className="container">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[var(--brand)] text-sm font-semibold mb-1.5">{t("subtitle")}</p>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)]">{t("title")}</h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map(({ key, Icon, color, shadow }) => (
            <div
              key={key}
              className="group flex flex-col items-center text-center gap-y-4 p-7 rounded-xl border border-gray-100 bg-white hover:border-transparent hover:shadow-xl transition-all duration-300"
            >
              {/* Icon bubble */}
              <div
                className={`size-16 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ${shadow} group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon size={28} className="text-white" />
              </div>

              <h3 className="font-extrabold text-[var(--ink)] text-base leading-6">
                {t(`${key}_title`)}
              </h3>
              <p className="text-sm text-gray-500 leading-7">
                {t(`${key}_desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
