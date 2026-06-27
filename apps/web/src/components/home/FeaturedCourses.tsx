"use client";

import { useLocale, useTranslations } from "next-intl";
import CardSlider from "@/components/ui/CardSlider";
import CourseCard from "@/components/ui/CourseCard";
import { CourseCardSkeleton } from "@/components/ui/Skeleton";
import { useCourses } from "@/hooks/queries/use-courses";
import { formatMoney, isFree, discountPercent } from "@/lib/format";

export default function FeaturedCourses() {
  const t = useTranslations("Home.featured");
  const locale = useLocale() as "ar" | "ur";
  const { data, isLoading, isError } = useCourses({ limit: 8 });
  const courses = data?.items ?? [];
  const showSkeleton = isLoading || (isError && !data);

  return (
    <CardSlider
      title={t("title")}
      title1={t("title_1")}
      title2={t("title_2")}
      scrollAmount={1232}
    >
      {showSkeleton
        ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shrink-0 w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3*1.25rem)/4)]">
              <CourseCardSkeleton />
            </div>
          ))
        : courses.map((course) => {
        const free = isFree(course.effectivePrice);
        const thumb = course.thumbnailUrl?.[locale] ?? course.thumbnailUrl?.ar ?? "";
        return (
          <div key={course.id} className="shrink-0 w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3*1.25rem)/4)]" style={{ scrollSnapAlign: "start" }}>
          <CourseCard
            course={{
              id: course.id,
              href: `/courses/${course.slug}`,
              image: thumb || "https://dl.poshtybanman.ir/upload/1%20(4)_63dd121c7b132.png",
              title: course.title[locale],
              description: course.description?.[locale] ?? "",
              instructor: course.instructor.name[locale],
              averageRating: course.averageRating,
              reviewCount: course.reviewCount,
              participantCount: course.participantCount,
              lessonCount: course.lessonCount,
              durationMinutes: course.durationMinutes ?? 0,
              price: free ? (locale === "ar" ? "مجاني" : "مفت") : formatMoney(course.effectivePrice, locale),
              originalPrice: course.price ? formatMoney(course.price, locale) : undefined,
              discount: discountPercent(course.price, course.effectivePrice) || undefined,
              isFree: free,
              level: course.level,
            }}
          />
          </div>
        );
      })}
    </CardSlider>
  );
}
