"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiArrowLeftLine } from "react-icons/ri";
import ArticleCard from "@/components/ui/ArticleCard";
import { useArticles } from "@/hooks/queries/use-articles";

export default function LatestArticles() {
  const t = useTranslations("Home.articles");
  const locale = useLocale() as "ar" | "ur";
  const { data } = useArticles({ limit: 4 });
  const articles = data?.items ?? [];

  return (
    <section className="container relative py-10 sm:py-16 lg:py-20">
      {/* Header */}
      <div className="flex items-center gap-x-3 sm:gap-x-7 flex-wrap sm:flex-nowrap mb-12">
        <h2 className="flex items-center gap-x-1 shrink-0 text-xl sm:text-2xl md:text-3xl font-bold cursor-default">
          <span className="text-[var(--ink)]">{t("title_1")}</span>
          <span className="text-[var(--brand)]">{t("title_2")}</span>
        </h2>
        <div className="hidden sm:block w-full h-px bg-gray-200" />
        <Link
          href="/articles"
          className="flex items-center gap-x-2 shrink-0 text-sm sm:text-base ms-auto hover:text-[var(--brand)] transition-colors whitespace-nowrap"
        >
          {t("view_all")}
          <RiArrowLeftLine size={14} />
        </Link>
      </div>

      {/* Grid — 4 cards, space for absolute read button overflow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-12 pb-6">
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
    </section>
  );
}
