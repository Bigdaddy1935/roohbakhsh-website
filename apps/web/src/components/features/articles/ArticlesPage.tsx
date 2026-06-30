"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Suspense } from "react";
import { useCategories } from "@/hooks/queries/use-categories";
import { useArticleFilters } from "@/hooks/useArticleFilters";
import FilterSortBar from "@/components/ui/FilterSortBar";
import LatestArticlesRow from "./LatestArticlesRow";
import PopularCategories from "./PopularCategories";
import ArticlesSidebar from "./ArticlesSidebar";
import ArticleGrid from "./ArticleGrid";

function ArticlesContent() {
  const t = useTranslations("Articles");
  const locale = useLocale() as "ar" | "ur";
  const { cats, sort, toggleCategory, setSort } = useArticleFilters();
  const { data: categories } = useCategories();

  const categoryOptions = (categories ?? []).map((c) => ({
    value: c.id,
    label: c.name[locale],
  }));

  const sortOptions = [
    { value: "newest",  label: t("sort_newest")  },
    { value: "popular", label: t("sort_popular") },
  ];

  return (
    <div className="bg-[var(--bg)] min-h-screen">
      {/* Breadcrumb */}
      <div className="py-8 border-b border-gray-100">
        <div className="container">
          <div className="flex items-center gap-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-[var(--brand)] transition-colors">
              {t("breadcrumb_home")}
            </Link>
            <RiArrowLeftSLine size={16} className="rotate-180 shrink-0" />
            <span className="text-[var(--ink)]">{t("breadcrumb_articles")}</span>
          </div>
        </div>
      </div>

      {/* Latest 4 — row cards */}
      <LatestArticlesRow />

      {/* Popular categories — always visible */}
      <PopularCategories />

      {/* Mobile filter / sort bar */}
      <div className="container">
        <FilterSortBar
          categories={categoryOptions}
          selectedCategories={cats}
          onCategoryToggle={toggleCategory}
          sortOptions={sortOptions}
          sortValue={sort}
          onSortChange={setSort}
          labels={{
            filterBtn: t("filter_btn"),
            filterModalTitle: t("filter_label"),
            sortModalTitle: t("sort_label"),
            applyBtn: t("apply_btn"),
          }}
        />
      </div>

      {/* Desktop: sidebar (right) + grid (left) */}
      <div className="container py-10 pb-20 lg:pb-28">
        {/* grid-cols-[300px_1fr] → first col (sidebar) on RIGHT in RTL */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
          <ArticlesSidebar />
          <ArticleGrid />
        </div>
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <div className="min-h-[100vh]">
      <Suspense>
        <ArticlesContent />
      </Suspense>
    </div>
  );
}
