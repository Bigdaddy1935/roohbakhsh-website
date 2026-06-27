"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiBookOpenLine, RiHeartLine, RiCustomerService2Line,
  RiWalletLine, RiArrowLeftSLine, RiLoader4Line,
} from "react-icons/ri";
import { useDashboard } from "@/hooks/queries/use-dashboard";
import { formatMoney } from "@/lib/format";
import type { TicketStatus } from "@roohbakhsh/shared";

const STATUS_CLASS: Record<TicketStatus, string> = {
  open: "bg-blue-50 text-blue-600",
  answered: "bg-green-50 text-[var(--brand)]",
  closed: "bg-gray-100 text-gray-500",
};

const UI = {
  ar: {
    statLabels: ["دوراتي", "علاقاتي", "التيكيت", "إجمالي الإنفاق"],
    statLinks: ["/dashboard/my-courses", "#", "/dashboard/tickets", "/dashboard/transactions"],
    statColors: [
      "bg-blue-50 text-blue-500",
      "bg-purple-50 text-purple-500",
      "bg-orange-50 text-orange-500",
      "bg-green-50 text-green-600",
    ],
    recentCourses: "آخر ما شاهدته",
    viewAll: "عرض الكل",
    recentTickets: "التيكيت الأخيرة",
    ticketStatus: { open: "مفتوح", answered: "تمت الإجابة", closed: "مغلق" },
    viewDetails: "عرض التفاصيل",
    watched: "مشاهدة",
    noCourses: "لا توجد دورات بعد",
    noTickets: "لا توجد تيكيت بعد",
  },
  ur: {
    statLabels: ["میرے کورسز", "پسندیدہ", "ٹکٹس", "کل خرچ"],
    statLinks: ["/dashboard/my-courses", "#", "/dashboard/tickets", "/dashboard/transactions"],
    statColors: [
      "bg-blue-50 text-blue-500",
      "bg-purple-50 text-purple-500",
      "bg-orange-50 text-orange-500",
      "bg-green-50 text-green-600",
    ],
    recentCourses: "حال ہی میں دیکھے گئے",
    viewAll: "سب دیکھیں",
    recentTickets: "حالیہ ٹکٹس",
    ticketStatus: { open: "کھلا", answered: "جواب دیا", closed: "بند" },
    viewDetails: "تفصیلات دیکھیں",
    watched: "دیکھا",
    noCourses: "ابھی کوئی کورس نہیں",
    noTickets: "ابھی کوئی ٹکٹ نہیں",
  },
};

const STAT_ICONS = [RiBookOpenLine, RiHeartLine, RiCustomerService2Line, RiWalletLine];

export default function DashboardHome() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  const { data, isLoading } = useDashboard();

  const progressByCourseId = new Map(
    (data?.coursesProgress ?? []).map((p) => [p.courseId, p.progressPercent]),
  );

  const statValues = [
    (data?.myCoursesCount ?? 0).toString(),
    (data?.favorites.length ?? 0).toString(),
    (data?.ticketsCount ?? 0).toString(),
    data?.totalSpent ? formatMoney(data.totalSpent, locale) : "—",
  ];

  return (
    <div className="flex flex-col gap-y-5 p-4 sm:p-5 lg:p-0">

      {/* Stats */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <RiLoader4Line size={28} className="text-[var(--brand)] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STAT_ICONS.map((Icon, i) => (
            <Link key={i} href={(ui.statLinks[i] ?? "#") as string}
              className="bg-white rounded-md p-4 flex items-center justify-between border border-gray-100 hover:border-gray-200 transition-colors">
              <div>
                <p className="text-2xl font-extrabold text-[var(--ink)]">{statValues[i]}</p>
                <p className="text-xs text-gray-400 mt-0.5">{ui.statLabels[i]}</p>
              </div>
              <div className={`size-12 rounded-md flex items-center justify-center ${ui.statColors[i]}`}>
                <Icon size={24} />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Recent views */}
      <div className="bg-white rounded-md border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--ink)]">{ui.recentCourses}</h2>
          <Link href="/dashboard/my-courses" className="flex items-center gap-x-1 text-xs text-[var(--brand)] hover:underline">
            {ui.viewAll} <RiArrowLeftSLine size={14} />
          </Link>
        </div>
        {!data || data.recentViews.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">{ui.noCourses}</p>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {data.recentViews.slice(0, 4).map((v) => {
              const progress = progressByCourseId.get(v.courseId) ?? 0;
              return (
                <div key={`${v.type}-${v.id}`} className="col-span-6 sm:col-span-6 lg:col-span-4 xl:col-span-3 bg-white rounded-md overflow-hidden border border-gray-100">
                  <div className="aspect-video bg-[var(--brand)]/10 flex items-center justify-center">
                    <RiBookOpenLine size={28} className="text-[var(--brand)] opacity-40" />
                  </div>
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs font-semibold text-[var(--ink)] line-clamp-2 h-8">{v.title[locale]}</p>
                  </div>
                  <div className="flex items-center gap-x-1 px-3 py-2 text-[var(--brand)]">
                    <span className="text-[11px] shrink-0 select-none">{progress}% {ui.watched}</span>
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--brand)] rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent tickets */}
      <div className="bg-white rounded-md border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--ink)]">{ui.recentTickets}</h2>
          <Link href="/dashboard/tickets" className="flex items-center gap-x-1 text-xs text-[var(--brand)] hover:underline">
            {ui.viewAll} <RiArrowLeftSLine size={14} />
          </Link>
        </div>
        {!data || data.recentTickets.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">{ui.noTickets}</p>
        ) : (
          <div className="flex flex-col gap-y-3">
            {data.recentTickets.map((tk) => (
              <div key={tk.id} className="flex items-center justify-between rounded-md border border-gray-100 px-4 py-3 hover:border-gray-200 transition-colors">
                <div className="flex items-center gap-x-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${STATUS_CLASS[tk.status]}`}>
                    {ui.ticketStatus[tk.status]}
                  </span>
                  <span className="text-sm text-[var(--ink)] font-medium">{tk.subject}</span>
                </div>
                <div className="flex items-center gap-x-3">
                  <span className="text-xs text-gray-400 hidden sm:block">{tk.createdAt.slice(0, 10)}</span>
                  <Link href="/dashboard/tickets" className="text-xs text-[var(--brand)] flex items-center gap-x-0.5 hover:underline">
                    {ui.viewDetails} <RiArrowLeftSLine size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
