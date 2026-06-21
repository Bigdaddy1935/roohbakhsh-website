"use client";

import { useLocale, useTranslations } from "next-intl";
import CardSlider from "@/components/ui/CardSlider";
import CourseCard from "@/components/ui/CourseCard";
import { useCourses } from "@/hooks/queries/use-courses";

export default function FreeCourses() {
  const t = useTranslations("Home.free");
  const locale = useLocale() as "ar" | "ur";
  const { data } = useCourses({ limit: 20 });

  const freeCourses = (data?.items ?? []).filter((c) => !c.price || c.price.amountMinor === 0);

  return (
    <CardSlider
      title={t("title")}
      subtitle={t("subtitle")}
      viewAllHref="/courses?filter=free"
      viewAllLabel={t("view_all")}
      bgClass="bg-white"
    >
      {freeCourses.map((course) => {
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
              price: locale === "ar" ? "مجاني" : "مفت",
              isFree: true,
              category: "",
            }}
          />
        );
      })}
    </CardSlider>
  );
}
