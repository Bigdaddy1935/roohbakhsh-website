"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { RiTimeLine, RiUserLine, RiArrowLeftSLine, RiEyeLine, RiInboxLine } from "react-icons/ri";
import { ARTICLES, ARTICLE_CATEGORIES } from "@/data/articles.mock";
import { useArticleFilters } from "@/hooks/useArticleFilters";

export default function ArticleGrid() {
  const t = useTranslations("Articles");
  const locale = useLocale() as "ar" | "ur";
  const { cats, sort, q } = useArticleFilters();

  let articles = [...ARTICLES];

  // Filter by categories
  if (cats.length > 0) {
    articles = articles.filter((a) => cats.includes(a.category));
  }

  // Filter by search
  if (q) {
    const lower = q.toLowerCase();
    articles = articles.filter((a) =>
      a.title[locale].toLowerCase().includes(lower) ||
      a.excerpt[locale].toLowerCase().includes(lower),
    );
  }

  // Sort
  articles.sort((a, b) =>
    sort === "popular"
      ? b.views - a.views
      : new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-y-3">
        <RiInboxLine size={52} className="text-gray-300" />
        <p className="font-bold text-[var(--ink)]">{t("no_results")}</p>
        <p className="text-sm text-gray-400">{t("no_results_hint")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 content-start self-start">
      {articles.map((article) => {
        const catLabel =
          ARTICLE_CATEGORIES.find((c) => c.value === article.category)?.[locale] ?? "";
        return (
          <div
            key={article.id}
            className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[var(--brand)]/20 transition-all duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-gray-100">
              <Image
                src={article.image}
                alt={article.title[locale]}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width:640px) 100vw, 50vw"
              />
              <span className="absolute top-3 start-3 px-2.5 py-1 rounded-lg bg-[var(--brand)] text-white text-[11px] font-semibold">
                {catLabel}
              </span>
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-4 gap-y-2.5">
              <h3 className="font-bold text-[var(--ink)] text-[14px] leading-6 line-clamp-2 group-hover:text-[var(--brand)] transition-colors">
                {article.title[locale]}
              </h3>
              <p className="text-[12px] text-gray-400 line-clamp-2 leading-5 flex-1">
                {article.excerpt[locale]}
              </p>

              {/* Meta */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-50">
                <span className="flex items-center gap-x-1.5">
                  <span className="size-6 rounded-full bg-[var(--brand)]/10 flex items-center justify-center">
                    <RiUserLine size={12} className="text-[var(--brand)]" />
                  </span>
                  <span className="truncate max-w-[110px]">{article.author[locale]}</span>
                </span>
                <span className="flex items-center gap-x-3">
                  <span className="flex items-center gap-x-1">
                    <RiTimeLine size={11} />
                    {article.readTime[locale]}
                  </span>
                  <span className="flex items-center gap-x-1">
                    <RiEyeLine size={11} />
                    {article.views.toLocaleString()}
                  </span>
                </span>
              </div>

              <Link
                href={`/articles/${article.id}`}
                className="flex items-center justify-center gap-x-1.5 h-9 rounded-xl bg-[var(--brand)] text-white text-[12px] font-bold hover:opacity-90 transition-opacity"
              >
                <RiArrowLeftSLine size={15} />
                {t("read_btn")}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
