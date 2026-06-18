"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { RiTimeLine, RiUserLine, RiArrowLeftSLine } from "react-icons/ri";

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
    <div className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[var(--brand)]/20 transition-all duration-300 overflow-hidden w-72 shrink-0">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="288px"
        />
        <span className="absolute top-3 start-3 px-2.5 py-1 rounded-lg bg-[var(--brand)] text-white text-[11px] font-semibold">
          {article.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-y-3">
        <h3 className="font-bold text-[var(--ink)] text-[14px] leading-6 line-clamp-2 group-hover:text-[var(--brand)] transition-colors">
          {article.title}
        </h3>
        <p className="text-[12px] text-gray-400 line-clamp-2 leading-5 flex-1">
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-50">
          <span className="flex items-center gap-x-1.5">
            <span className="size-6 rounded-full bg-[var(--brand)]/15 flex items-center justify-center shrink-0">
              <RiUserLine size={12} className="text-[var(--brand)]" />
            </span>
            <span className="truncate max-w-[100px]">{article.author}</span>
          </span>
          <span className="flex items-center gap-x-1">
            <RiTimeLine size={11} />
            {article.readTime}
          </span>
        </div>

        {/* Read button */}
        <Link
          href={article.href}
          className="flex items-center justify-center gap-x-1.5 h-9 rounded-xl bg-[var(--brand)] text-white text-[12px] font-bold hover:opacity-90 transition-opacity"
        >
          <RiArrowLeftSLine size={15} />
          مطالعة
        </Link>
      </div>
    </div>
  );
}
