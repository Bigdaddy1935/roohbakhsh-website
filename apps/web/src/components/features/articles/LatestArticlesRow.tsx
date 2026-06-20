"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { RiTimeLine, RiUserLine, RiArrowLeftSLine } from "react-icons/ri";
import { ARTICLES } from "@/data/articles.mock";
import { ARTICLE_CATEGORIES } from "@/data/articles.mock";

export default function LatestArticlesRow() {
  const t = useTranslations("Articles");
  const locale = useLocale() as "ar" | "ur";

  const latest = [...ARTICLES]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return (
    <section className="py-10">
      <div className="container">
        <div className="mb-8">
          <p className="text-[var(--brand)] text-sm font-semibold mb-1">{t("latest_subtitle")}</p>
          <h2 className="text-2xl font-extrabold text-[var(--ink)]">{t("latest_title")}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {latest.map((article) => {
            const catLabel =
              ARTICLE_CATEGORIES.find((c) => c.value === article.category)?.[locale] ?? "";
            return (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="group flex gap-x-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[var(--brand)]/20 transition-all overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative w-32 shrink-0 bg-gray-100">
                  <Image
                    src={article.image}
                    alt={article.title[locale]}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-y-2 py-4 pe-4 flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-lg self-start">
                    {catLabel}
                  </span>
                  <h3 className="font-bold text-[var(--ink)] text-[13px] leading-5 line-clamp-2 group-hover:text-[var(--brand)] transition-colors">
                    {article.title[locale]}
                  </h3>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-4 flex-1">
                    {article.excerpt[locale]}
                  </p>
                  <div className="flex items-center gap-x-3 text-[10px] text-gray-400 mt-auto">
                    <span className="flex items-center gap-x-1">
                      <RiUserLine size={11} />
                      {article.author[locale]}
                    </span>
                    <span className="flex items-center gap-x-1">
                      <RiTimeLine size={11} />
                      {article.readTime[locale]}
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
