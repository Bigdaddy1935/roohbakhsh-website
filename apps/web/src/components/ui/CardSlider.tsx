"use client";

import { useRef, ReactNode, useCallback } from "react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "@/i18n/navigation";

type Props = {
  title: string;
  title1?: string;
  title2?: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: ReactNode;
  bgClass?: string;
  scrollAmount?: number;
};

export default function CardSlider({
  title,
  title1,
  title2,
  subtitle,
  viewAllHref,
  viewAllLabel,
  children,
  bgClass = "",
  scrollAmount = 308,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const scroll = (dir: "next" | "prev") => {
    scrollRef.current?.scrollBy({
      left: dir === "next" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault(); // prevent native image/link drag
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX;
    startScrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const delta = e.pageX - startX.current;
    if (Math.abs(delta) > 4) hasDragged.current = true;
    scrollRef.current.scrollLeft = startScrollLeft.current - delta;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!scrollRef.current) return;
    isDragging.current = false;
    scrollRef.current.style.cursor = "grab";
    scrollRef.current.style.userSelect = "";
  }, []);

  const onClickCapture = useCallback((e: React.MouseEvent) => {
    // Prevent link clicks if user just dragged
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged.current = false;
    }
  }, []);

  return (
    <section className={`container relative py-10 sm:py-16 lg:py-20 ${bgClass}`}>
        {/* Header */}
        <div className="flex items-center gap-x-3 sm:gap-x-7 flex-wrap sm:flex-nowrap mb-12">
          <h2 className="flex items-center gap-x-1 shrink-0 text-xl sm:text-2xl md:text-3xl font-bold cursor-default">
            {title1 && title2 ? (
              <>
                <span className="text-[var(--ink)]">{title1}</span>
                <span className="text-[var(--brand)]">{title2}</span>
              </>
            ) : (
              <span className="text-[var(--ink)]">{title}</span>
            )}
          </h2>
          <div className="hidden sm:block w-full h-px bg-gray-200" />
          <div className="flex items-center gap-x-2 shrink-0 ms-auto">
            <button
              type="button"
              onClick={() => scroll("prev")}
              className="size-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors cursor-pointer"
              aria-label="previous"
            >
              <RiArrowRightSLine size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll("next")}
              className="size-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors cursor-pointer"
              aria-label="next"
            >
              <RiArrowLeftSLine size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable row */}
        <div className="overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-x-5 overflow-x-auto scroll-smooth select-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              cursor: "grab",
              scrollSnapType: "x mandatory",
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onClickCapture={onClickCapture}
          >
            {children}
          </div>
        </div>
    </section>
  );
}
