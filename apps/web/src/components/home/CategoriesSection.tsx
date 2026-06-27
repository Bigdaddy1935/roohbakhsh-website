"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiArrowRightSLine, RiArrowLeftSLine, RiGridLine } from "react-icons/ri";
import { useRef } from "react";
import { useCategories } from "@/hooks/queries/use-categories";

export default function CategoriesSection() {
  const t = useTranslations("Home.categories");
  const locale = useLocale() as "ar" | "ur";
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: cats = [] } = useCategories();

  const courseWord = locale === "ar" ? "دورة" : "کورس";

  /* ── دکمه‌های ناوبری ── */
  const scroll = (dir: "next" | "prev") => {
    const el = scrollRef.current;
    if (!el) return;
    const itemW = el.firstElementChild?.clientWidth ?? 180;
    el.scrollBy({ left: dir === "next" ? -(itemW + 16) : (itemW + 16), behavior: "smooth" });
  };

  /* ── drag-to-scroll ── */
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { active: true, startX: e.clientX, scrollLeft: scrollRef.current?.scrollLeft ?? 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.currentTarget.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || !scrollRef.current) return;
    const dx = e.clientX - drag.current.startX;
    scrollRef.current.scrollLeft = drag.current.scrollLeft - dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current.active = false;
    e.currentTarget.style.cursor = "grab";
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
        className="flex gap-4 overflow-x-auto pb-2 select-none cursor-grab"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {cats.map((cat) => {
          const thumb = cat.thumbnailUrl?.[locale] ?? cat.thumbnailUrl?.ar ?? null;
          return (
            <Link
              key={cat.id}
              href={`/courses?cat=${cat.slug}`}
              draggable={false}
              className="bg-white flex flex-col items-center gap-3 sm:gap-4 px-2.5 py-4 sm:py-6 rounded-lg border-2 border-transparent hover:border-[var(--brand)] hover:bg-[var(--brand)]/10 transition-colors text-center shrink-0
                w-[calc((100%-5*1rem)/3)]
                sm:w-[calc((100%-5*1rem)/4)]
                lg:w-[calc((100%-5*1rem)/6)]"
            >
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumb}
                  alt={cat.name[locale]}
                  className="size-20 sm:size-24 object-cover rounded-sm pointer-events-none"
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <div className="size-14 sm:size-16 rounded-sm bg-[var(--brand)]/10 flex items-center justify-center pointer-events-none">
                  <RiGridLine size={28} className="text-[var(--brand)]" />
                </div>
              )}
              <h3 className="text-sm sm:text-base font-semibold text-[var(--ink)] pointer-events-none">{cat.name[locale]}</h3>
              <span className="flex items-center gap-x-0.5 px-2.5 py-1 bg-[var(--brand)]/5 text-xs sm:text-sm rounded-sm text-[var(--ink)] pointer-events-none">
                {cat.courseCount} {courseWord}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
