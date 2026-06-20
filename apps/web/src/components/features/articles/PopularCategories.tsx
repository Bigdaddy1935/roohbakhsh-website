"use client";

import { useLocale, useTranslations } from "next-intl";
import { ARTICLE_CATEGORIES } from "@/data/articles.mock";
import { useArticleFilters } from "@/hooks/useArticleFilters";

export default function PopularCategories() {
  const t = useTranslations("Articles");
  const locale = useLocale() as "ar" | "ur";
  const { cats, selectCategory } = useArticleFilters();

  return (
    <section className="py-8 bg-white border-y border-gray-100">
      <div className="container">
        <h2 className="text-base font-extrabold text-[var(--ink)] mb-5">{t("popular_cats")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ARTICLE_CATEGORIES.map((cat) => {
            const isActive = cats.includes(cat.value);
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => selectCategory(cat.value)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer text-center border ${
                  isActive
                    ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-md"
                    : "bg-white text-[var(--ink)] border-gray-200 hover:border-[var(--brand)] hover:text-[var(--brand)]"
                }`}
              >
                {cat[locale]}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
