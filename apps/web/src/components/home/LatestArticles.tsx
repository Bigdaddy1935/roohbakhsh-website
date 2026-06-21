"use client";

import { useLocale, useTranslations } from "next-intl";
import CardSlider from "@/components/ui/CardSlider";
import ArticleCard from "@/components/ui/ArticleCard";
import { useArticles } from "@/hooks/queries/use-articles";

export default function LatestArticles() {
  const t = useTranslations("Home.articles");
  const locale = useLocale() as "ar" | "ur";
  const { data } = useArticles({ limit: 6 });
  const articles = data?.items ?? [];

  return (
    <CardSlider
      title={t("title")}
      subtitle={t("subtitle")}
      viewAllHref="/articles"
      viewAllLabel={t("view_all")}
      bgClass="bg-white"
    >
      {articles.map((article) => {
        const thumb = article.thumbnailUrl?.[locale] ?? article.thumbnailUrl?.ar ?? "";
        return (
          <ArticleCard
            key={article.id}
            article={{
              id: article.id,
              title: article.title[locale],
              excerpt: article.summary[locale],
              author: article.authorId,
              readTime: "",
              image: thumb || "https://dl.poshtybanman.ir/upload/6%20(1)_68924fcebd53d.jpg",
              href: `/articles/${article.slug}`,
              category: "",
            }}
          />
        );
      })}
    </CardSlider>
  );
}
