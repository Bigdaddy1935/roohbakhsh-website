"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function AboutHero() {
  const t = useTranslations("About.hero");
  return (
    <section className="py-10 sm:py-16 lg:py-20 border-b border-gray-100 overflow-hidden">
      <div className="container">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 flex flex-col gap-y-6 text-center lg:text-start">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[var(--ink)] leading-tight">
              {t("title_1")}
              <span className="block text-[var(--brand)] mt-1">{t("title_2")}</span>
            </h1>
            <p className="text-base text-gray-500 leading-8 max-w-xl mx-auto lg:mx-0">
              {t("subtitle")}
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-1">
              {(["stat_1","stat_2","stat_3"] as const).map(k => (
                <div key={k} className="bg-white rounded-md border border-gray-100 px-5 py-3 text-center">
                  <p className="text-xl font-extrabold text-[var(--brand)]">{t(`${k}_value`)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t(`${k}_label`)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full max-w-md lg:max-w-none flex items-end justify-center">
            <Image
              src="/hero-student.png"
              alt={t("title")}
              width={520}
              height={468}
              className="w-full h-auto max-w-[520px] object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
