"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { MOCK_MY_COURSES } from "@/data/dashboard.mock";
import { RiArrowLeftSLine } from "react-icons/ri";

const UI = {
  ar: { title: "دوراتي", continue: "متابعة التعلم", watched: "مشاهدة", instructor: "المدرب" },
  ur: { title: "میرے کورسز", continue: "سیکھنا جاری رکھیں", watched: "دیکھا", instructor: "استاد" },
};

export default function MyCourses() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  return (
    <div className="max-w-5xl mx-auto w-full">
      <h1 className="text-lg font-extrabold text-[var(--ink)] mb-5">{ui.title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {MOCK_MY_COURSES.map((c) => (
          <div key={c.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="relative aspect-video bg-gray-100">
              <Image src={c.thumb} alt={c.title[locale]} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="size-10 rounded-full bg-white/90 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[13px] border-transparent border-l-[var(--brand)] ms-0.5" />
                </div>
              </div>
            </div>
            <div className="p-3 flex flex-col gap-y-2 flex-1">
              <p className="text-sm font-bold text-[var(--ink)] line-clamp-2">{c.title[locale]}</p>
              <p className="text-xs text-gray-400">{ui.instructor}: {c.instructor[locale]}</p>
              <div className="flex items-center gap-x-2 mt-auto">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--brand)] rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">{c.progress}%</span>
              </div>
              <button className="w-full h-8 rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-semibold hover:bg-[var(--brand)]/20 transition-colors flex items-center justify-center gap-x-1 mt-1">
                {ui.continue} <RiArrowLeftSLine size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
