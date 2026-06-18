"use client";

import { useRef, ReactNode, useCallback } from "react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { Link } from "@/i18n/navigation";

type Props = {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: ReactNode;
  bgClass?: string;
};

export default function CardSlider({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel,
  children,
  bgClass = "",
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const scroll = (dir: "next" | "prev") => {
    scrollRef.current?.scrollBy({
      left: dir === "next" ? -296 : 296,
      behavior: "smooth",
    });
  };

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
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
    <section className={`py-14 ${bgClass}`}>
      <div className="container">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {subtitle && (
              <p className="text-[var(--brand)] text-sm font-semibold mb-1">{subtitle}</p>
            )}
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[var(--ink)]">{title}</h2>
          </div>
          <div className="flex items-center gap-x-3">
            <div className="hidden sm:flex items-center gap-x-2">
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
            {viewAllHref && viewAllLabel && (
              <Link
                href={viewAllHref}
                className="text-sm font-semibold text-[var(--brand)] hover:underline"
              >
                {viewAllLabel}
              </Link>
            )}
          </div>
        </div>

        {/* Scrollable row — py-4 / -my-4 trick so box-shadows aren't clipped */}
        <div className="-my-4 py-4 overflow-x-hidden">
          <div
            ref={scrollRef}
            className="flex gap-x-5 overflow-x-auto py-4 scroll-smooth select-none"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              cursor: "grab",
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
      </div>
    </section>
  );
}
