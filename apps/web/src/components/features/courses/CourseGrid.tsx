"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { RiInboxLine } from "react-icons/ri";
import { useCourses } from "@/hooks/queries/use-courses";
import { useCourseFilters } from "@/hooks/useCourseFilters";
import { formatMoney, isFree, discountPercent } from "@/lib/format";
import CourseCard from "@/components/ui/CourseCard";
import type { CourseRecord } from "@roohbakhsh/shared";

function courseToCard(course: CourseRecord, locale: "ar" | "ur", currency: string) {
  const free = isFree(course.effectivePrice);
  const disc = discountPercent(course.price, course.effectivePrice);
  const thumb = course.thumbnailUrl?.[locale] ?? course.thumbnailUrl?.ar ?? "";
  return {
    id: course.id,
    href: `/courses/${course.slug}`,
    image: thumb || "https://dl.poshtybanman.ir/upload/1%20(4)_63dd121c7b132.png",
    title: course.title[locale],
    description: course.description[locale],
    instructor: course.instructor.name[locale],
    averageRating: course.averageRating,
    reviewCount: course.reviewCount,
    participantCount: course.participantCount,
    lessonCount: course.lessonCount,
    durationMinutes: course.durationMinutes ?? 0,
    price: free ? (locale === "ar" ? "مجاني" : "مفت") : formatMoney(course.effectivePrice, locale),
    originalPrice: course.price ? formatMoney(course.price, locale) : undefined,
    discount: disc > 0 ? disc : undefined,
    isFree: free,
  };
}

export default function CourseGrid() {
  const t = useTranslations("Courses");
  const locale = useLocale() as "ar" | "ur";
  const { cats, sort, q, clearAll } = useCourseFilters();
  const { data, isLoading, isError } = useCourses({ limit: 50 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoading) setReady(true);
  }, [isLoading]);

  if (!ready) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 content-start self-start">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-y-3 bg-white rounded-xl overflow-hidden border border-gray-100">
            <div className="w-full aspect-video bg-gray-200 animate-pulse" />
            <div className="p-4 flex flex-col gap-y-3">
              <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
              <div className="flex items-center justify-between mt-2">
                <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-y-3">
        <RiInboxLine size={52} className="text-gray-300" />
        <p className="font-bold text-[var(--ink)]">{t("no_results")}</p>
      </div>
    );
  }

  let courses = data?.items ?? [];

  if (q) {
    const lower = q.toLowerCase();
    courses = courses.filter((c) =>
      c.title[locale].toLowerCase().includes(lower) ||
      c.description[locale].toLowerCase().includes(lower),
    );
  }

  if (cats.length > 0) {
    courses = courses.filter((c) => c.categoryId && cats.includes(c.categoryId));
  }

  courses = [...courses].sort((a, b) => {
    if (sort === "popular") return 0;
    if (sort === "advanced") return (b.price?.amountMinor ?? 0) - (a.price?.amountMinor ?? 0);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-y-6">
        <div className="relative flex items-center justify-center size-28">
          <div className="absolute inset-0 rounded-full bg-[var(--brand)]/8" />
          <div className="absolute inset-4 rounded-full bg-[var(--brand)]/12" />
          <RiInboxLine size={44} className="relative text-[var(--brand)]/50" />
        </div>
        <div className="flex flex-col gap-y-2 max-w-xs">
          <p className="text-lg font-extrabold text-[var(--ink)]">{t("no_results")}</p>
          <p className="text-sm text-gray-400 leading-6">{t("no_results_hint")}</p>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className="h-10 px-6 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {t("clear_filters")}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 content-start self-start">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={courseToCard(course, locale, t("currency"))}
        />
      ))}
    </div>
  );
}
