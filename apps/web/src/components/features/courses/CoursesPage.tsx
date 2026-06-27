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

      {/* Hero */}
      <div className="bg-gradient-to-b from-[var(--ink)] to-[#1a1c2e] py-12 text-white">
        <div className="container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-x-2 text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">{t("breadcrumb_home")}</Link>
            <RiArrowLeftSLine size={16} className="rotate-180 shrink-0" />
            <span className="text-white/90">{t("breadcrumb_courses")}</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold mb-8 text-center">{t("page_title")}</h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { Icon: RiUserLine,     value: fmt(stats?.studentsCount ?? 0), label: t("stat_students") },
              { Icon: RiCalendarLine, value: fmt(stats?.coursesCount ?? 0),  label: t("stat_courses")  },
              { Icon: RiTimeLine,     value: fmt(stats?.totalHours ?? 0),    label: t("stat_hours")    },
            ].map(({ Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-y-2 bg-white/10 rounded-xl p-4">
                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Icon size={20} className="text-[var(--cta)]" />
                </div>
                <span className="text-lg font-extrabold">{value}</span>
                <span className="text-xs text-white/60 text-center">{label}</span>
              </div>
            ))}
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
      <div className="container py-10">
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
    <Suspense>
      <CoursesContent />
    </Suspense>
  );
}
