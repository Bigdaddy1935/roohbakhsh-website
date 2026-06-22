"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { useRef } from "react";

const STATIC_IMG = "https://storage.sabzlearn.ir/app/static/files/fd5c17d5-2826-4027-b964-d092959d2a71-js-logo.png";

type Cat = {
  id: string;
  href: string;
  name: { ar: string; ur: string };
  count: { ar: string; ur: string };
};

const CATS: Cat[] = [
  { id:"quran",    href:"/courses/quran",    name:{ar:"العلوم القرآنية",ur:"قرآنی علوم"},    count:{ar:"١٢ دورة",ur:"12 کورس"} },
  { id:"fiqh",     href:"/courses/fiqh",     name:{ar:"الفقه والأصول",ur:"فقہ و اصول"},     count:{ar:"٨ دورات",ur:"8 کورس"}  },
  { id:"aqeedah",  href:"/courses/aqeedah",  name:{ar:"العقيدة والكلام",ur:"عقیدہ و کلام"}, count:{ar:"٦ دورات",ur:"6 کورس"}  },
  { id:"history",  href:"/courses/history",  name:{ar:"التاريخ الإسلامي",ur:"اسلامی تاریخ"}, count:{ar:"٩ دورات",ur:"9 کورس"} },
  { id:"arabic",   href:"/courses/arabic",   name:{ar:"اللغة العربية",ur:"عربی زبان"},     count:{ar:"١٥ دورة",ur:"15 کورس"} },
  { id:"tazkiyah", href:"/courses/tazkiyah", name:{ar:"التزكية والسلوك",ur:"تزکیہ و سلوک"}, count:{ar:"٧ دورات",ur:"7 کورس"}  },
];

export default function CategoriesSection() {
  const t = useTranslations("Home.categories");
  const locale = useLocale() as "ar" | "ur";
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "next" | "prev") => {
    scrollRef.current?.scrollBy({ left: dir === "next" ? -220 : 220, behavior: "smooth" });
  };

  return (
    <section className="container relative py-10 sm:py-16 lg:py-20">

        {/* Header */}
        <div className="flex items-center gap-x-3 sm:gap-x-7 flex-wrap sm:flex-nowrap mb-12">
          <h2 className="flex items-center gap-x-1 shrink-0 text-xl sm:text-2xl md:text-3xl font-bold cursor-default">
            <span className="text-[var(--ink)]">{t("title_1")}</span>
            <span className="text-[var(--brand)]">{t("title_2")}</span>
          </h2>
          <div className="hidden sm:block w-full h-px bg-gray-200" />
          <div className="flex items-center gap-x-2 shrink-0 ms-auto">
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
          {CATS.map(({ id, href, name, count }) => (
            <Link
              key={id}
              href={href}
              className="bg-white flex flex-col items-center gap-3 sm:gap-4 px-2.5 py-4 sm:py-6 rounded-lg border-2 border-transparent hover:border-[var(--brand)] hover:bg-[var(--brand)]/10 transition-colors text-center flex-1 min-w-36"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={STATIC_IMG}
                alt={name[locale]}
                className="size-14 sm:size-16 object-cover rounded-sm"
                loading="lazy"
              />
              <h3 className="text-sm sm:text-base font-semibold text-[var(--ink)]">{name[locale]}</h3>
              <span className="flex items-center gap-x-0.5 px-2.5 py-1 bg-[var(--brand)]/5 text-xs sm:text-sm rounded-sm text-[var(--ink)]">
                {count[locale]}
              </span>
            </Link>
          ))}
        </div>
    </section>
  );
}
