"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { RiSearchLine } from "react-icons/ri";
import { useArticles } from "@/hooks/queries/use-articles";
import { useArticleFilters } from "@/hooks/useArticleFilters";
import ArticleCard from "@/components/ui/ArticleCard";

function EmptyState({ t }: { t: (k: string) => string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-y-5">
      <div className="relative size-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[var(--brand)]/8" />
        <div className="absolute inset-3 rounded-full bg-[var(--brand)]/12" />
        <RiSearchLine size={36} className="relative text-[var(--brand)]/50" />
      </div>
      <div className="flex flex-col gap-y-2">
        <p className="text-lg font-extrabold text-[var(--ink)]">{t("no_results")}</p>
        <p className="text-sm text-gray-400 max-w-xs">{t("no_results_hint")}</p>
      </div>
    </div>
  );
}

export default function ArticleGrid() {
  const t = useTranslations("Articles");
  const locale = useLocale() as "ar" | "ur";
  const { cats, sort, q } = useArticleFilters();
  const { data, isLoading, isError } = useArticles({ limit: 50 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoading) setReady(true);
  }, [isLoading]);

  if (!ready) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-7 gap-y-12 pb-6 content-start self-start">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-y-3">
            <div className="w-full aspect-[16/9] rounded-xl bg-gray-200 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
            <div className="flex items-center justify-between mt-1">
              <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-12 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) return <EmptyState t={t} />;

  let articles = data?.items ?? [];

  if (q) {
    const lower = q.toLowerCase();
    articles = articles.filter((a) =>
      a.title[locale].toLowerCase().includes(lower) ||
      a.summary[locale].toLowerCase().includes(lower),
    );
  }

  articles = [...articles].sort((a, b) =>
    sort === "popular"
      ? new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      : new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime(),
  );

  if (articles.length === 0) return <EmptyState t={t} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-7 gap-y-12 pb-6 content-start self-start">
      {articles.map((article) => {
        const thumb = article.thumbnailUrl?.[locale] ?? article.thumbnailUrl?.ar ?? "";
        return (
          <ArticleCard
            key={article.id}
            article={{
              id: article.id,
              title: article.title[locale],
              excerpt: article.summary[locale],
              author: article.instructor.name[locale],
              averageRating: article.averageRating,
              reviewCount: article.reviewCount,
              image: thumb || "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg",
              href: `/articles/${article.slug}`,
            }}
          />
        );
      })}
    </div>
  );
}
