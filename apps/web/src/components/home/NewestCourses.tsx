"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiArrowLeftLine } from "react-icons/ri";
import CourseCard from "@/components/ui/CourseCard";
import { useCourses } from "@/hooks/queries/use-courses";
import { formatMoney, isFree, discountPercent } from "@/lib/format";

export default function NewestCourses() {
  const t = useTranslations("Home.newest");
  const locale = useLocale() as "ar" | "ur";
  const { data } = useCourses({ limit: 8 });
  const courses = data?.items ?? [];

  return (
    <section className="container relative py-10 sm:py-16 lg:py-20">
        <div className="flex items-center justify-between gap-x-3 sm:gap-x-7 flex-wrap sm:flex-nowrap mb-12">
          <h2 className="flex items-center gap-x-1 shrink-0 text-xl sm:text-2xl md:text-3xl font-bold cursor-default">
            <span className="text-[var(--ink)]">{t("title_1")}</span>
            <span className="text-[var(--brand)]">{t("title_2")}</span>
          </h2>
          <div className="hidden sm:block w-full h-px bg-gray-200" />
          <Link
            href="/courses?sort=newest"
            className="flex items-center gap-x-2 shrink-0 text-sm sm:text-base ms-auto hover:text-[var(--brand)] transition-colors whitespace-nowrap"
          >
            {t("view_all")}
            <RiArrowLeftLine size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
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
        </div>
    </section>
  );
}
