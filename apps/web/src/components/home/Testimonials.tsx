"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { RiStarFill, RiArrowRightSLine, RiArrowLeftSLine, RiDoubleQuotesL } from "react-icons/ri";
import { useReviews } from "@/hooks/queries/use-reviews";

const VISIBLE_LG = 3;
const VISIBLE_SM = 2;
const VISIBLE_XS = 1;

const AVATAR_COLORS = [
  "bg-emerald-500", "bg-blue-500", "bg-amber-500",
  "bg-rose-500", "bg-purple-500", "bg-teal-500",
];

export default function Testimonials() {
  const t = useTranslations("Home.testimonials");
  const locale = useLocale() as "ar" | "ur";
  const [start, setStart] = useState(0);
  const [visible, setVisible] = useState(VISIBLE_LG);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setVisible(VISIBLE_XS);
      else if (window.innerWidth < 1024) setVisible(VISIBLE_SM);
      else setVisible(VISIBLE_LG);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { data } = useReviews({ limit: 12, rating: 5 });
  const reviews = data?.items ?? [];
  const total = reviews.length;
  const maxStart = Math.max(0, total - visible);

  const next = useCallback(() => setStart((s) => (s >= maxStart ? 0 : s + 1)), [maxStart]);
  const prev = useCallback(() => setStart((s) => (s <= 0 ? maxStart : s - 1)), [maxStart]);

  useEffect(() => { setStart(0); }, [visible]);

  useEffect(() => {
    if (total < 2) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next, total]);

  /* drag-to-swipe */
  const dragStartX = useRef(0);
  const dragging = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > 50) diff > 0 ? prev() : next();
  };

  const visibleItems = total > 0
    ? Array.from({ length: Math.min(visible, total) }, (_, i) => reviews[(start + i) % total]!)
    : [];

  return (
    <section className="container relative py-10 sm:py-16 lg:py-20 overflow-hidden">

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-x-4 sm:gap-x-7">
          <div className="hidden sm:block w-full h-px bg-gray-200" />
          <h2 className="flex items-center gap-x-1 shrink-0 text-xl sm:text-2xl md:text-3xl font-bold cursor-default whitespace-nowrap">
            <span className="text-[var(--ink)]">{t("title_1")}</span>
            <span className="text-[var(--brand)]">{t("title_2")}</span>
          </h2>
          <div className="hidden sm:block w-full h-px bg-gray-200" />
        </div>
      </div>

      {/* Slider row */}
      <div
        className="cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div className="flex gap-5 transition-all duration-500 items-stretch">
          {visibleItems.map((item, i) => {
            const colorClass = AVATAR_COLORS[(item.userId.charCodeAt(0) + i) % AVATAR_COLORS.length]!;
            const initials = item.user.fullName.slice(0, 2);

            return (
              <div
                key={`${start}-${i}`}
                className="bg-white rounded-lg border border-gray-100 p-5 flex flex-col justify-between h-full shrink-0 w-full sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
              >
                {/* Quote + text */}
                <div className="flex-1">
                  <RiDoubleQuotesL size={28} className="text-[var(--brand)]/15 mb-2" />
                  <p className="text-[var(--ink)] text-sm leading-7 line-clamp-4">
                    {item.comment ?? ""}
                  </p>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-x-0.5 mt-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <RiStarFill
                      key={s}
                      size={13}
                      className={s <= (item.rating ?? 0) ? "text-[var(--cta)]" : "text-gray-200"}
                    />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-x-3 pt-3 mt-1 border-t border-gray-100">
                  {item.user.avatarUrl ? (
                    <Image
                      src={item.user.avatarUrl}
                      alt={item.user.fullName}
                      width={40}
                      height={40}
                      className="size-10 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className={`size-10 rounded-lg ${colorClass} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-[var(--ink)] text-sm truncate">
                      {item.user.fullName}
                    </p>
                    <p className="text-[11px] text-[var(--brand)] truncate">
                      {item.target.title[locale]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      {total > visible && (
        <div className="flex items-center justify-center gap-x-4 mt-8">
          <button
            type="button"
            onClick={prev}
            className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors cursor-pointer"
          >
            <RiArrowRightSLine size={18} />
          </button>
          <div className="flex items-center gap-x-1.5">
            {Array.from({ length: maxStart + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStart(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === start ? "w-5 h-2 bg-[var(--brand)]" : "size-2 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors cursor-pointer"
          >
            <RiArrowLeftSLine size={18} />
          </button>
        </div>
      )}

    </section>
  );
}
