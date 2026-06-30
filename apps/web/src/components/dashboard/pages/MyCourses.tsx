"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiPlayCircleLine, RiArrowLeftSLine, RiBookReadLine, RiShoppingBag3Line } from "react-icons/ri";
import { CoursesPageSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useMyOrders } from "@/hooks/queries/use-orders";

const UI = {
  ar: {
    title: "دوراتي",
    subtitle: "جميع الدورات التي اشتريتها",
    continueLearning: "متابعة التعلم",
    empty: "لا توجد دورات بعد",
    emptyHint: "اشترِ دورة للبدء في رحلة التعلم",
    browse: "استعرض الدورات",
  },
  ur: {
    title: "میرے کورسز",
    subtitle: "آپ کے خریدے ہوئے تمام کورسز",
    continueLearning: "سیکھنا جاری رکھیں",
    empty: "ابھی کوئی کورس نہیں",
    emptyHint: "سیکھنے کا سفر شروع کرنے کے لیے کورس خریدیں",
    browse: "کورسز دیکھیں",
  },
};

export default function MyCourses() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  const { data, isLoading } = useMyOrders({ limit: 50 });

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

  if (isLoading) return <CoursesPageSkeleton />;

  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-2xl lg:p-7 min-h-full">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[var(--ink)]">{ui.title}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{ui.subtitle}</p>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-y-4">
          <div className="size-20 rounded-2xl bg-[var(--brand)]/10 flex items-center justify-center">
            <RiBookReadLine size={36} className="text-[var(--brand)]" />
          </div>
          <div className="text-center">
            <p className="font-bold text-[var(--ink)]">{ui.empty}</p>
            <p className="text-sm text-gray-400 mt-1">{ui.emptyHint}</p>
          </div>
          <Link
            href="/courses"
            className="mt-2 flex items-center gap-x-2 h-11 px-7 rounded-xl bg-[var(--brand)] text-white text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <RiShoppingBag3Line size={18} />
            {ui.browse}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courses.map((c) => (
            <div
              key={c.courseId}
              className="group flex flex-col rounded-2xl overflow-hidden bg-gray-50 hover:shadow-lg transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-[var(--brand)]/20 via-[var(--brand)]/10 to-transparent flex items-center justify-center">
                <RiPlayCircleLine
                  size={40}
                  className="text-[var(--brand)]/40 group-hover:text-[var(--brand)]/70 transition-colors duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col gap-y-3">
                <p className="text-sm font-semibold text-[var(--ink)] line-clamp-2 leading-relaxed">
                  {c.title[locale]}
                </p>
                {/* Progress */}
                <div className="flex items-center gap-x-2 mt-auto">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--brand)] rounded-full w-0" />
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0">0%</span>
                </div>
              </div>

              {/* Continue button */}
              <Link
                href={`/courses/${c.courseId}`}
                className="flex items-center justify-center gap-x-2 py-3 bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <RiPlayCircleLine size={16} />
                {ui.continueLearning}
                <RiArrowLeftSLine size={16} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
