"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Checkbox, RadioGroup, Radio } from "@heroui/react";
import { RiSearchLine } from "react-icons/ri";
import { useCategories } from "@/hooks/queries/use-categories";
import { useArticleFilters } from "@/hooks/useArticleFilters";

export default function ArticlesSidebar() {
  const t = useTranslations("Articles");
  const locale = useLocale() as "ar" | "ur";
  const { cats, sort, q, toggleCategory, setSort, setSearch } = useArticleFilters();
  const { data: categories } = useCategories();

  const [localSearch, setLocalSearch] = useState(q);

  // Debounce: push to URL only after 300ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => setSearch(localSearch), 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  // Sync local state if URL param changes externally (e.g. browser back)
  useEffect(() => { setLocalSearch(q); }, [q]);

  return (
    <aside className="hidden lg:flex flex-col gap-y-6 sticky top-24 self-start">

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-sm font-extrabold text-[var(--ink)] mb-3">{t("search_label")}</p>
        <div className="relative">
          <RiSearchLine
            size={16}
            className="absolute top-1/2 -translate-y-1/2 start-3 text-gray-400 pointer-events-none"
          />
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full h-10 rounded-xl border border-gray-200 ps-9 pe-3 text-sm text-[var(--ink)] placeholder-gray-400 focus:outline-none focus:border-[var(--brand)] transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-sm font-extrabold text-[var(--ink)] mb-4">{t("filter_label")}</p>
        <div className="flex flex-col gap-y-3 max-h-64 overflow-y-auto scrollbar-thin pe-1">
          {(categories ?? []).map((cat) => (
            <Checkbox
              key={cat.id}
              isSelected={cats.includes(cat.id)}
              onChange={() => toggleCategory(cat.id)}
            >
              <Checkbox.Content>
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <span className="text-[13px] text-[var(--ink)]">{cat.name[locale]}</span>
              </Checkbox.Content>
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-sm font-extrabold text-[var(--ink)] mb-4">{t("sort_label")}</p>
        <RadioGroup value={sort} onChange={setSort} className="flex flex-col gap-y-2">
          <Radio value="newest">
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <span className="text-[13px] text-[var(--ink)]">{t("sort_newest")}</span>
            </Radio.Content>
          </Radio>
          <Radio value="popular">
            <Radio.Content>
              <Radio.Control>
                <Radio.Indicator />
              </Radio.Control>
              <span className="text-[13px] text-[var(--ink)]">{t("sort_popular")}</span>
            </Radio.Content>
          </Radio>
        </RadioGroup>
      </div>
    </aside>
  );
}
