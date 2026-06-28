"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCategories } from "@/hooks/queries/use-categories";
import { useArticleFilters } from "@/hooks/useArticleFilters";

export default function PopularCategories() {
  const t = useTranslations("Articles");
  const locale = useLocale() as "ar" | "ur";
  const { cats, selectCategory } = useArticleFilters();
  const { data: categories, isLoading } = useCategories();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoading) setReady(true);
  }, [isLoading]);

  if (!ready) {
    return (
      <section className="py-8 border-y border-gray-100">
        <div className="container">
          <div className="flex justify-center mb-5">
            <div className="h-6 w-40 rounded-lg bg-gray-200 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-11 sm:h-14 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 border-y border-gray-100">
      <div className="container">
        <h2 className="flex items-center justify-center gap-x-2 text-xl font-extrabold mb-5">
          <span className="text-[var(--ink)]">{t("popular_cats_1")}</span>
          <span className="text-[var(--brand)]">{t("popular_cats_2")}</span>
        </h2>
        <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(categories ?? []).map((cat) => {
            const isActive = cats.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => selectCategory(cat.id)}
                className={`flex items-center justify-center max-w-50 min-w-min w-full text-center h-11 sm:h-14 px-2 text-sm rounded-lg transition-colors cursor-pointer font-semibold border ${
                  isActive
                    ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                    : "bg-white text-[var(--ink)] border-gray-200 hover:border-[var(--brand)] hover:text-[var(--brand)]"
                }`}
              >
                {cat.name[locale]}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
