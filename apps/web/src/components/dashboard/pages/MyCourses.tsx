"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { RiUserLine, RiArrowLeftSLine } from "react-icons/ri";
import { MOCK_MY_COURSES } from "@/data/dashboard.mock";

const UI = {
  ar: { title: "دوراتي", continue: "ادامه یادگیری", watched: "مشاهدة" },
  ur: { title: "میرے کورسز", continue: "سیکھنا جاری رکھیں", watched: "دیکھا" },
};

export default function MyCourses() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7 min-h-full">
      <h1 className="text-base font-bold text-[var(--ink)] mb-5">{ui.title}</h1>
      <div className="grid grid-cols-12 gap-4 sm:gap-5">
        {MOCK_MY_COURSES.map((c) => (
          <div
            key={c.id}
            className="col-span-6 lg:col-span-4 xl:col-span-3 bg-white rounded-md overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={c.thumb}
                alt={c.title[locale]}
                fill
                className="object-cover"
              />
            </div>

            {/* Title + instructor */}
            <div className="p-3 mb-0 border-b border-gray-100">
              <p className="text-xs sm:text-sm font-semibold text-[var(--ink)] line-clamp-2 h-8 sm:h-10">
                {c.title[locale]}
              </p>
              <div className="flex items-center gap-x-1 mt-2">
                <RiUserLine size={14} className="text-gray-400 shrink-0" />
                <span className="text-[11px] sm:text-xs text-gray-400 truncate">
                  {c.instructor[locale]}
                </span>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-x-1 px-3 py-2.5 text-[var(--brand)]">
              <span className="text-[11px] sm:text-xs shrink-0 select-none">
                {c.progress}% {ui.watched}
              </span>
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--brand)] rounded-full"
                  style={{ width: `${c.progress}%` }}
                />
              </div>
            </div>

            {/* Continue button */}
            <a
              href="#"
              className="flex items-center justify-center gap-x-1 py-2.5 bg-[var(--brand)]/10 text-[var(--brand)] text-xs sm:text-sm font-semibold hover:bg-[var(--brand)]/20 transition-colors"
            >
              {ui.continue}
              <RiArrowLeftSLine size={16} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
