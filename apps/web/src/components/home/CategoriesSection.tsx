"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiBookOpenLine,
  RiScales2Line,
  RiMoonLine,
  RiTimeLine,
  RiPenNibLine,
  RiHeartLine,
  RiArrowRightSLine,
  RiArrowLeftSLine,
} from "react-icons/ri";
import { useRef } from "react";

type Cat = {
  id: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  name: { ar: string; ur: string };
  count: { ar: string; ur: string };
  gradient: string;
  iconColor: string;
};

const CATS: Cat[] = [
  { id:"quran",    href:"/courses/quran",    Icon:RiBookOpenLine, name:{ar:"العلوم القرآنية",ur:"قرآنی علوم"},    count:{ar:"١٢ دورة",ur:"12 کورسز"}, gradient:"from-emerald-400 to-teal-600",   iconColor:"text-white" },
  { id:"fiqh",     href:"/courses/fiqh",     Icon:RiScales2Line,  name:{ar:"الفقه والأصول",ur:"فقہ و اصول"},     count:{ar:"٨ دورات",ur:"8 کورسز"},  gradient:"from-blue-400 to-indigo-600",   iconColor:"text-white" },
  { id:"aqeedah",  href:"/courses/aqeedah",  Icon:RiMoonLine,     name:{ar:"العقيدة والكلام",ur:"عقیدہ و کلام"}, count:{ar:"٦ دورات",ur:"6 کورسز"},  gradient:"from-violet-400 to-purple-600", iconColor:"text-white" },
  { id:"history",  href:"/courses/history",  Icon:RiTimeLine,     name:{ar:"التاريخ الإسلامي",ur:"اسلامی تاریخ"}, count:{ar:"٩ دورات",ur:"9 کورسز"}, gradient:"from-amber-400 to-orange-500",  iconColor:"text-white" },
  { id:"arabic",   href:"/courses/arabic",   Icon:RiPenNibLine,   name:{ar:"اللغة العربية",ur:"عربی زبان"},     count:{ar:"١٥ دورة",ur:"15 کورسز"}, gradient:"from-rose-400 to-pink-600",     iconColor:"text-white" },
  { id:"tazkiyah", href:"/courses/tazkiyah", Icon:RiHeartLine,    name:{ar:"التزكية والسلوك",ur:"تزکیہ و سلوک"}, count:{ar:"٧ دورات",ur:"7 کورسز"}, gradient:"from-teal-400 to-cyan-600",    iconColor:"text-white" },
];

export default function CategoriesSection() {
  const t = useTranslations("Home.categories");
  const locale = useLocale() as "ar" | "ur";
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "next" | "prev") => {
    scrollRef.current?.scrollBy({ left: dir === "next" ? -220 : 220, behavior: "smooth" });
  };

  return (
    <section className="py-14">
      <div className="container">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[var(--brand)] text-sm font-semibold mb-1">{t("subtitle")}</p>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)]">{t("title")}</h2>
          </div>
          <div className="flex items-center gap-x-2">
            <button type="button" onClick={() => scroll("prev")} className="size-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors cursor-pointer">
              <RiArrowRightSLine size={18} />
            </button>
            <button type="button" onClick={() => scroll("next")} className="size-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors cursor-pointer">
              <RiArrowLeftSLine size={18} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={scrollRef}
          className="flex gap-x-4 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATS.map(({ id, href, Icon, name, count, gradient, iconColor }) => (
            <Link
              key={id}
              href={href}
              className="group flex flex-col items-center gap-y-3 p-6 rounded-2xl border border-gray-100 bg-white hover:border-transparent hover:shadow-lg transition-all duration-200 text-center w-44 shrink-0"
            >
              <div className={`size-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={28} className={iconColor} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--ink)] leading-5">{name[locale]}</p>
                <p className="text-[11px] text-gray-400 mt-1">{count[locale]}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
