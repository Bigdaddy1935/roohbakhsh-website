"use client";

import { useLocale, useTranslations } from "next-intl";
import { RiInboxLine } from "react-icons/ri";
import { COURSES, COURSE_CATEGORIES } from "@/data/courses.mock";
import { useCourseFilters } from "@/hooks/useCourseFilters";
import CourseCard from "@/components/ui/CourseCard";

export default function CourseGrid() {
  const t = useTranslations("Courses");
  const locale = useLocale() as "ar" | "ur";
  const { cats, sort, q } = useCourseFilters();

  let courses = [...COURSES];

  if (cats.length > 0) courses = courses.filter((c) => cats.includes(c.category));
  if (q) {
    const lower = q.toLowerCase();
    courses = courses.filter((c) =>
      c.title[locale].toLowerCase().includes(lower) ||
      c.excerpt[locale].toLowerCase().includes(lower),
    );
  }

  courses.sort((a, b) => {
    if (sort === "popular") return b.students - a.students;
    if (sort === "updated") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (sort === "advanced") return b.originalPrice - a.originalPrice;
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
      {courses.map((course) => {
        const catLabel = COURSE_CATEGORIES.find((c) => c.value === course.category)?.[locale] ?? "";
        return (
          <CourseCard
            key={course.id}
            fluid
            course={{
              id: course.id,
              href: `/courses/${course.id}`,
              image: course.image,
              title: course.title[locale],
              description: course.excerpt[locale],
              instructor: course.instructor.name[locale],
              rating: course.rating,
              students: course.students,
              duration: 0,
              price: `${course.discountedPrice.toLocaleString()} ${t("currency")}`,
              originalPrice: course.originalPrice.toLocaleString(),
              discount: course.discountPct,
              category: catLabel,
            }}
          />
        );
      })}
    </div>
  );
}
