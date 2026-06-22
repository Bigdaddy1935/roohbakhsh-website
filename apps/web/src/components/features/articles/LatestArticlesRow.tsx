"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { RiTimeLine, RiUserLine, RiArrowLeftSLine, RiLoader4Line } from "react-icons/ri";
import { useArticles } from "@/hooks/queries/use-articles";

export default function LatestArticlesRow() {
  const t = useTranslations("Articles");
  const locale = useLocale() as "ar" | "ur";

  const { data: articlesData, isLoading } = useArticles({ limit: 4 });
  const latest = [...(articlesData?.items ?? [])]
    .sort((a, b) => new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime())
    .slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="container flex justify-center">
          <RiLoader4Line size={28} className="text-[var(--brand)] animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="container">
        <div className="mb-8">
          <p className="text-[var(--brand)] text-sm font-semibold mb-1">{t("latest_subtitle")}</p>
          <h2 className="text-2xl font-extrabold text-[var(--ink)]">{t("latest_title")}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {latest.map((article) => {
            const thumb = article.thumbnailUrl?.[locale] ?? article.thumbnailUrl?.ar ?? "";
            return (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group flex gap-x-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[var(--brand)]/20 transition-all overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative w-32 shrink-0 bg-gray-100">
                  {thumb && (
                    <Image
                      src={thumb}
                      alt={article.title[locale]}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-y-2 py-4 pe-4 flex-1 min-w-0">
<h3 className="font-bold text-[var(--ink)] text-[13px] leading-5 line-clamp-2 group-hover:text-[var(--brand)] transition-colors">
                    {article.title[locale]}
                  </h3>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-4 flex-1">
                    {article.summary[locale]}
                  </p>
                  <div className="flex items-center gap-x-3 text-[10px] text-gray-400 mt-auto">
                    <span className="flex items-center gap-x-1">
                      <RiUserLine size={11} />
                      {article.authorId}
                    </span>
                    <span className="flex items-center gap-x-1">
                      <RiTimeLine size={11} />
                      {article.publishedAt?.slice(0, 10) ?? article.createdAt.slice(0, 10)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
