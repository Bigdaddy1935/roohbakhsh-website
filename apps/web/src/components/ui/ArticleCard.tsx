"use client";

import { Link } from "@/i18n/navigation";
import { RiTimeLine, RiUserLine, RiArrowLeftLine } from "react-icons/ri";

export type ArticleCardData = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  image: string;
  href: string;
  category: string;
};

export default function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <div className="group/blog flex flex-col gap-y-3 sm:gap-y-4 h-full rounded-lg bg-white">
      {/* Image */}
      <Link href={article.href} className="block">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="block w-full object-cover aspect-video rounded-lg group-hover/blog:brightness-110 transition-all"
        />
      </Link>

      {/* Body */}
      <div className="flex flex-col gap-y-5 justify-between h-full px-3 sm:px-4 pb-10 sm:pb-12 cursor-default relative">
        {/* Title + excerpt */}
        <div className="flex flex-col items-start gap-y-1">
          <Link
            href={article.href}
            className="text-sm font-bold text-[var(--ink)] line-clamp-2 leading-6 hover:text-[var(--brand)] transition-colors"
          >
            {article.title}
          </Link>
          <p className="text-[12px] text-gray-400 line-clamp-2 leading-5">
            {article.excerpt}
          </p>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-1.5">
            <span className="size-5 sm:size-6 rounded-full bg-[var(--brand)]/15 flex items-center justify-center shrink-0">
              <RiUserLine size={11} className="text-[var(--brand)]" />
            </span>
            <span className="text-[11px] sm:text-xs text-gray-500 truncate max-w-[110px]">
              {article.author}
            </span>
          </div>
          {article.readTime && (
            <div className="flex items-center gap-x-1 rounded-md px-1.5 py-1 text-gray-400 bg-gray-100 text-[11px]">
              <RiTimeLine size={13} />
              <span>{article.readTime}</span>
            </div>
          )}
        </div>

        {/* Read button — absolute, overflows card bottom */}
        <Link
          href={article.href}
          className="absolute -bottom-5 inset-x-3 sm:inset-x-4 flex items-center justify-center gap-x-2 h-10 sm:h-11 rounded-lg bg-[var(--brand)] text-white text-[13px] font-bold hover:opacity-90 transition-opacity"
        >
          مطالعة
          <RiArrowLeftLine size={14} />
        </Link>
      </div>
    </div>
  );
}
