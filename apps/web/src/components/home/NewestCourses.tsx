"use client";

import { useLocale, useTranslations } from "next-intl";
import CardSlider from "@/components/ui/CardSlider";
import CourseCard from "@/components/ui/CourseCard";
import { useCourses } from "@/hooks/queries/use-courses";
import { formatMoney, isFree, discountPercent } from "@/lib/format";

export default function NewestCourses() {
  const t = useTranslations("Home.newest");
  const locale = useLocale() as "ar" | "ur";
  const { data } = useCourses({ limit: 8 });
  const courses = data?.items ?? [];

  return (
    <CardSlider
      title={t("title")}
      subtitle={t("subtitle")}
      viewAllHref="/courses?sort=newest"
      viewAllLabel={t("view_all")}
    >
      {courses.map((course) => {
        const free = isFree(course.effectivePrice);
        const thumb = course.thumbnailUrl?.[locale] ?? course.thumbnailUrl?.ar ?? "";
        return (
          <CourseCard
            key={course.id}
            course={{
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
              discount: discountPercent(course.price, course.effectivePrice) || undefined,
              isFree: free,
              category: "",
            }}
          />
        );
      })}
    </CardSlider>
  );
}
