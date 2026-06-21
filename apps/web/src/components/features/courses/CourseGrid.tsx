"use client";

import { useLocale, useTranslations } from "next-intl";
import { RiInboxLine, RiLoader4Line } from "react-icons/ri";
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
    rating: 0,
    students: 0,
    duration: Math.floor((course.durationMinutes ?? 0) / 60),
    price: free ? (locale === "ar" ? "مجاني" : "مفت") : formatMoney(course.effectivePrice, locale),
    originalPrice: course.price ? formatMoney(course.price, locale) : undefined,
    discount: disc > 0 ? disc : undefined,
    isFree: free,
    category: currency,
  };
}

export default function CourseGrid() {
  const t = useTranslations("Courses");
  const locale = useLocale() as "ar" | "ur";
  const { cats, sort, q } = useCourseFilters();
  const { data, isLoading, isError } = useCourses({ limit: 50 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RiLoader4Line size={36} className="text-[var(--brand)] animate-spin" />
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
      <div className="flex flex-col items-center justify-center py-24 text-center gap-y-3">
        <RiInboxLine size={52} className="text-gray-300" />
        <p className="font-bold text-[var(--ink)]">{t("no_results")}</p>
        <p className="text-sm text-gray-400">{t("no_results_hint")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 content-start self-start">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          fluid
          course={courseToCard(course, locale, t("currency"))}
        />
      ))}
    </div>
  );
}
