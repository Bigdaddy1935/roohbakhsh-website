"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiArrowLeftSLine, RiLoader4Line, RiBookOpenLine } from "react-icons/ri";
import { useMyOrders } from "@/hooks/queries/use-orders";

const UI = {
  ar: { title: "دوراتي", continueLearning: "متابعة التعلم", empty: "لا توجد دورات بعد", emptyHint: "اشترِ دورة للبدء" },
  ur: { title: "میرے کورسز", continueLearning: "سیکھنا جاری رکھیں", empty: "ابھی کوئی کورس نہیں", emptyHint: "شروع کرنے کے لیے ایک کورس خریدیں" },
};

export default function MyCourses() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  const { data, isLoading } = useMyOrders({ limit: 50 });

  // Collect unique courses from all paid orders
  const courseMap = new Map<string, { courseId: string; title: Record<string, string> }>();
  (data?.items ?? [])
    .filter((o) => o.status === "paid")
    .forEach((order) => {
      order.items.forEach((item) => {
        if (!courseMap.has(item.courseId)) {
          courseMap.set(item.courseId, {
            courseId: item.courseId,
            title: item.titleSnapshot as Record<string, string>,
          });
        }
      });
    });
  const courses = Array.from(courseMap.values());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <RiLoader4Line size={32} className="text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7 min-h-full">
        <h1 className="text-base font-bold text-[var(--ink)] mb-5">{ui.title}</h1>
        <div className="flex flex-col items-center justify-center py-20 gap-y-3 text-gray-400">
          <RiBookOpenLine size={48} className="opacity-30" />
          <p className="font-semibold">{ui.empty}</p>
          <p className="text-sm">{ui.emptyHint}</p>
          <Link href="/courses" className="mt-2 h-10 px-6 rounded-xl bg-[var(--brand)] text-white text-sm font-bold hover:opacity-90 transition-opacity">
            {locale === "ar" ? "استعرض الدورات" : "کورسز دیکھیں"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7 min-h-full">
      <h1 className="text-base font-bold text-[var(--ink)] mb-5">{ui.title}</h1>
      <div className="grid grid-cols-12 gap-4 sm:gap-5">
        {courses.map((c) => (
          <div
            key={c.courseId}
            className="col-span-6 lg:col-span-4 xl:col-span-3 bg-white rounded-md overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors flex flex-col"
          >
            {/* Placeholder thumbnail */}
            <div className="aspect-video bg-[var(--brand)]/10 flex items-center justify-center">
              <RiBookOpenLine size={32} className="text-[var(--brand)] opacity-40" />
            </div>

            {/* Title */}
            <div className="p-3 border-b border-gray-100 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-[var(--ink)] line-clamp-2">
                {c.title[locale]}
              </p>
            </div>

            {/* Progress bar — 0% since backend has no progress API */}
            <div className="flex items-center gap-x-1 px-3 py-2.5 text-[var(--brand)]">
              <span className="text-[11px] sm:text-xs shrink-0 select-none">0%</span>
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--brand)] rounded-full w-0" />
              </div>
            </div>

            {/* Continue button */}
            <Link
              href={`/courses/${c.courseId}`}
              className="flex items-center justify-center gap-x-1 py-2.5 bg-[var(--brand)]/10 text-[var(--brand)] text-xs sm:text-sm font-semibold hover:bg-[var(--brand)]/20 transition-colors"
            >
              {ui.continueLearning}
              <RiArrowLeftSLine size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
