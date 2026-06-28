"use client";

import { Suspense } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiArrowLeftSLine, RiBookOpenLine, RiTimeLine, RiUserLine, RiCalendarLine } from "react-icons/ri";
import { useCategories } from "@/hooks/queries/use-categories";
import { useCourseStats } from "@/hooks/queries/use-courses";
import { useCourseFilters } from "@/hooks/useCourseFilters";
import FilterSortBar from "@/components/ui/FilterSortBar";
import CoursesSidebar from "./CoursesSidebar";
import CourseGrid from "./CourseGrid";

function CoursesContent() {
  const t = useTranslations("Courses");
  const locale = useLocale() as "ar" | "ur";
  const { cats, sort, toggleCategory, setSort } = useCourseFilters();
  const { data: categories } = useCategories();
  const { data: stats } = useCourseStats();

  const fmt = (n: number) => `+${n.toLocaleString(locale === "ar" ? "ar-EG" : "ur")}`;

  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name[locale] }));
  const sortOptions = [
    { value: "newest",  label: t("sort_newest")  },
    { value: "popular", label: t("sort_popular") },
    { value: "advanced", label: t("sort_advanced") },
  ];

  return (
    <div className="bg-[var(--bg)] min-h-screen">

      {/* Breadcrumb */}
      <div className="py-10 border-b border-gray-100">
        <div className="container">
          <div className="flex items-center gap-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-[var(--brand)] transition-colors">{t("breadcrumb_home")}</Link>
            <RiArrowLeftSLine size={16} className="rotate-180 shrink-0" />
            <span className="text-[var(--ink)]">{t("breadcrumb_courses")}</span>
          </div>
        </div>
      </div>

      {/* Hero card */}
      <div className="container pt-1 pb-5">
        <div className="relative z-0">
          <div className="max-sm:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-42 w-[calc(100%+32px)] bg-[var(--brand)] rounded-lg -z-[1]" />
        <div className="bg-[#242424] rounded-md h-[256px] px-6 sm:px-10 flex flex-col items-center justify-center gap-y-14">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white text-center sm:border-none border-s-4 border-[var(--brand)] ps-4">{t("page_title")}</h1>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-x-8 lg:gap-x-14 gap-y-5 text-white">
            {[
              { Icon: RiUserLine,     value: fmt(stats?.studentsCount ?? 0), label: t("stat_students") },
              { Icon: RiCalendarLine, value: fmt(stats?.coursesCount ?? 0),  label: t("stat_courses")  },
              { Icon: RiTimeLine,     value: fmt(stats?.totalHours ?? 0),    label: t("stat_hours")    },
            ].map(({ Icon, value, label }) => (
              <div key={label} className="flex flex-col sm:flex-row items-center gap-y-2.5 gap-x-4">
                <div className="size-11 sm:size-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-white" />
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-start">
                  <span className="font-extrabold text-lg leading-tight">{value}</span>
                  <span className="text-xs text-white/70">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Mobile filter bar */}
      <div className="container">
        <FilterSortBar
          categories={categoryOptions}
          selectedCategories={cats}
          onCategoryToggle={toggleCategory}
          sortOptions={sortOptions}
          sortValue={sort}
          onSortChange={setSort}
          labels={{
            filterBtn:       t("filter_btn"),
            filterModalTitle: t("filter_label"),
            sortModalTitle:  t("sort_label"),
            applyBtn:        t("apply_btn"),
          }}
        />
      </div>

      {/* Desktop layout */}
      <div className="container py-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
          <CoursesSidebar />
          <CourseGrid />
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div className="min-h-[100vh]">
      <Suspense>
        <CoursesContent />
      </Suspense>
    </div>
  );
}
