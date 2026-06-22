"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiArrowRightSLine, RiArrowLeftSLine, RiGridLine } from "react-icons/ri";
import { useRef } from "react";
import { useCategories } from "@/hooks/queries/use-categories";

const FALLBACK_IMG = "https://storage.sabzlearn.ir/app/static/files/fd5c17d5-2826-4027-b964-d092959d2a71-js-logo.png";

export default function CategoriesSection() {
  const t = useTranslations("Home.categories");
  const locale = useLocale() as "ar" | "ur";
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: cats = [] } = useCategories();

  const scroll = (dir: "next" | "prev") => {
    scrollRef.current?.scrollBy({ left: dir === "next" ? -220 : 220, behavior: "smooth" });
  };

  const courseWord = locale === "ar" ? "دورة" : "کورس";

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
        {cats.map((cat) => {
          const thumb = cat.thumbnailUrl?.[locale] ?? cat.thumbnailUrl?.ar ?? FALLBACK_IMG;
          return (
            <Link
              key={cat.id}
              href={`/courses?cat=${cat.slug}`}
              className="bg-white flex flex-col items-center gap-3 sm:gap-4 px-2.5 py-4 sm:py-6 rounded-lg border-2 border-transparent hover:border-[var(--brand)] hover:bg-[var(--brand)]/10 transition-colors text-center flex-1 min-w-36"
            >
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt={cat.name[locale]}
                  className="size-14 sm:size-16 object-cover rounded-sm"
                  loading="lazy"
                />
              ) : (
                <div className="size-14 sm:size-16 rounded-sm bg-[var(--brand)]/10 flex items-center justify-center">
                  <RiGridLine size={28} className="text-[var(--brand)]" />
                </div>
              )}
              <h3 className="text-sm sm:text-base font-semibold text-[var(--ink)]">{cat.name[locale]}</h3>
              <span className="flex items-center gap-x-0.5 px-2.5 py-1 bg-[var(--brand)]/5 text-xs sm:text-sm rounded-sm text-[var(--ink)]">
                {cat.courseCount} {courseWord}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
