"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useArticles } from "@/hooks/queries/use-articles";

export default function LatestArticlesRow() {
  const t = useTranslations("Articles");
  const locale = useLocale() as "ar" | "ur";
  const [ready, setReady] = useState(false);

  const { data: articlesData, isLoading } = useArticles({ limit: 4 });
  const latest = [...(articlesData?.items ?? [])]
    .sort((a, b) => new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime())
    .slice(0, 4);

  useEffect(() => {
    if (!isLoading) setReady(true);
  }, [isLoading]);

  if (!ready) {
    return (
      <section className="py-10">
        <div className="container">
          {/* title skeleton */}
          <div className="mb-8 flex justify-center">
            <div className="h-7 w-48 rounded-lg bg-gray-200 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-x-5">
                <div className="hidden sm:block w-40 h-28 lg:w-52 lg:h-32 shrink-0 rounded-xl bg-gray-200 animate-pulse" />
                <div className="flex flex-col justify-between flex-1 min-w-0 py-1 gap-y-3">
                  <div className="flex flex-col gap-y-2">
                    <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
                    <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
                    <div className="hidden lg:block h-3 w-full rounded bg-gray-100 animate-pulse" />
                  </div>
                  <div className="h-3 w-16 rounded bg-gray-200 animate-pulse ms-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container">
        <div className="mb-8 text-center">
          <h2 className="flex items-center justify-center gap-x-2 text-2xl font-extrabold">
            <span className="text-[var(--ink)]">{t("latest_title_1")}</span>
            <span className="text-[var(--brand)]">{t("latest_title_2")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {latest.map((article) => {
            const thumb = article.thumbnailUrl?.[locale] ?? article.thumbnailUrl?.ar ?? "";
            return (
              <div key={article.id} className="flex gap-x-5">
                {/* Thumbnail */}
                <Link
                  href={`/articles/${article.slug}`}
                  className="relative hidden sm:block w-40 h-28 lg:w-52 lg:h-32 shrink-0"
                >
                  <Image
                    src={thumb || "/placeholder.jpg"}
                    alt={article.title[locale]}
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width:1024px) 160px, 208px"
                  />
                </Link>

                {/* Content */}
                <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
                  <div className="flex flex-col gap-y-2">
                    <Link
                      href={`/articles/${article.slug}`}
                      className="font-bold text-[var(--ink)] text-sm leading-6 line-clamp-2 hover:text-[var(--brand)] transition-colors"
                    >
                      {article.title[locale]}
                    </Link>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-5 hidden lg:block">
                      {article.summary[locale]}
                    </p>
                  </div>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="flex items-center gap-x-1.5 text-sm text-gray-400 hover:text-[var(--brand)] transition-colors w-fit mt-2 ms-auto"
                  >
                    <span className="text-xs">{t("read_btn")}</span>
                    <RiArrowLeftSLine size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
