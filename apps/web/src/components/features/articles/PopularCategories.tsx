"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCategories } from "@/hooks/queries/use-categories";
import { useArticleFilters } from "@/hooks/useArticleFilters";

export default function PopularCategories() {
  const t = useTranslations("Articles");
  const locale = useLocale() as "ar" | "ur";
  const { cats, selectCategory } = useArticleFilters();
  const { data: categories } = useCategories();

  return (
    <section className="py-8 border-y border-gray-100">
      <div className="container">
        <h2 className="flex items-center justify-center gap-x-2 text-xl font-extrabold mb-5">
          <span className="text-[var(--ink)]">{t("popular_cats_1")}</span>
          <span className="text-[var(--brand)]">{t("popular_cats_2")}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(categories ?? []).map((cat) => {
            const isActive = cats.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => selectCategory(cat.id)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer text-center border ${
                  isActive
                    ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-md"
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
