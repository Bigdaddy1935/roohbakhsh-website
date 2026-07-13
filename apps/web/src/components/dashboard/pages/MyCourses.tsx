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
    <div className="bg-white p-4 sm:p-5 lg:rounded-lg lg:p-7 min-h-full">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[var(--ink)]">{ui.title}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{ui.subtitle}</p>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-y-4">
          <div className="size-20 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
            <RiBookReadLine size={36} className="text-[var(--brand)]" />
          </div>
          <div className="text-center">
            <p className="font-bold text-[var(--ink)]">{ui.empty}</p>
            <p className="text-sm text-gray-400 mt-1">{ui.emptyHint}</p>
          </div>
          <Link
            href="/courses"
            className="mt-2 flex items-center gap-x-2 h-11 px-7 rounded-md bg-[var(--brand)] text-white text-sm font-bold hover:opacity-90 transition-opacity"
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
              className="group flex flex-col rounded-lg overflow-hidden border border-gray-200 hover:border-[var(--brand)]/40 transition-colors duration-300 bg-white p-3"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-[var(--brand)]/8 flex items-center justify-center rounded-lg overflow-hidden">
                <RiPlayCircleLine
                  size={36}
                  className="text-[var(--brand)]/30 group-hover:text-[var(--brand)]/60 transition-colors duration-300"
                />
              </div>

              {/* Content */}
              <div className="px-4 pt-4 pb-3 flex-1 flex flex-col gap-y-3">
                <p className="text-sm font-semibold text-[var(--ink)] line-clamp-2 leading-relaxed">
                  {c.title[locale]}
                </p>
                {/* Progress */}
                <div className="flex items-center gap-x-2 mt-4">
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--brand)] rounded-full w-0" />
                  </div>
                  <span className="text-xs text-gray-500 shrink-0 font-medium">0%</span>
                </div>
              </div>

              {/* Continue button */}
              <div className="px-0 pb-0 pt-3">
                <Link
                  href={`/courses/${c.courseId}`}
                  className="flex items-center justify-center gap-x-2 h-9 rounded-md bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <RiPlayCircleLine size={15} />
                  {ui.continueLearning}
                  <RiArrowLeftSLine size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
