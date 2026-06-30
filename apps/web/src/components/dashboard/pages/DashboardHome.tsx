"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiPlayCircleLine, RiHeart3Line, RiMessage2Line,
  RiBankCardLine, RiArrowLeftSLine, RiBookReadLine,
  RiTimeLine, RiInformationLine, RiCheckboxCircleLine, RiErrorWarningLine,
} from "react-icons/ri";
import { HomePageSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useDashboard } from "@/hooks/queries/use-dashboard";
import { formatMoney } from "@/lib/format";
import type { TicketStatus } from "@roohbakhsh/shared";

const STATUS_BADGE: Record<TicketStatus, string> = {
  open: "bg-blue-50 text-blue-600",
  answered: "bg-emerald-50 text-emerald-600",
  closed: "bg-gray-100 text-gray-500",
};

const STATUS_DOT: Record<TicketStatus, string> = {
  open: "bg-blue-400",
  answered: "bg-[var(--brand)]",
  closed: "bg-gray-300",
};

const STATUS_ICON: Record<TicketStatus, React.ElementType> = {
  open: RiInformationLine,
  answered: RiCheckboxCircleLine,
  closed: RiErrorWarningLine,
};

const UI = {
  ar: {
    statLabels: ["دوراتي", "المفضلة", "التيكيتات", "إجمالي الإنفاق"],
    statLinks: ["/dashboard/my-courses", "/dashboard/favorites", "/dashboard/tickets", "/dashboard/transactions"] as string[],
    recentCourses: "آخر ما شاهدته",
    viewAll: "عرض الكل",
    recentTickets: "آخر التيكيتات",
    ticketStatus: { open: "مفتوح", answered: "تمت الإجابة", closed: "مغلق" } as Record<TicketStatus, string>,
    noCourses: "لم تشاهد أي دورة بعد",
    noTickets: "لا توجد تيكيتات بعد",
  },
  ur: {
    statLabels: ["میرے کورسز", "پسندیدہ", "ٹکٹس", "کل خرچ"],
    statLinks: ["/dashboard/my-courses", "/dashboard/favorites", "/dashboard/tickets", "/dashboard/transactions"] as string[],
    recentCourses: "حال ہی میں دیکھے گئے",
    viewAll: "سب دیکھیں",
    recentTickets: "حالیہ ٹکٹس",
    ticketStatus: { open: "کھلا", answered: "جواب دیا", closed: "بند" } as Record<TicketStatus, string>,
    noCourses: "ابھی کوئی کورس نہیں",
    noTickets: "ابھی کوئی ٹکٹ نہیں",
  },
};

const STAT_CONFIG = [
  { Icon: RiPlayCircleLine, iconBg: "bg-blue-100",    iconColor: "text-blue-500"    },
  { Icon: RiHeart3Line,     iconBg: "bg-rose-100",    iconColor: "text-rose-500"    },
  { Icon: RiMessage2Line,   iconBg: "bg-amber-100",   iconColor: "text-amber-500"   },
  { Icon: RiBankCardLine, iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
];

function SectionHeader({ title, href, label }: { title: string; href: string; label: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-[15px] font-bold text-[var(--ink)]">{title}</h2>
      <Link
        href={href}
        className="flex items-center gap-x-1 text-xs font-semibold text-[var(--brand)] hover:opacity-75 transition-opacity"
      >
        {label}
        <RiArrowLeftSLine size={15} className="mt-px" />
      </Link>
    </div>
  );
}

export default function DashboardHome() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-5 lg:p-0">
        <HomePageSkeleton />
      </div>
    );
  }

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

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STAT_CONFIG.map(({ Icon, iconBg, iconColor }, i) => (
          <Link
            key={i}
            href={ui.statLinks[i]}
            className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-x-4 hover:shadow-md transition-all duration-200 group"
          >
            <div
              className={`size-12 sm:size-14 rounded-xl ${iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
            >
              <Icon size={24} className={iconColor} />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-extrabold text-[var(--ink)] leading-tight truncate">
                {statValues[i]}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{ui.statLabels[i]}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent views */}
      <div className="bg-white rounded-2xl p-5 sm:p-6">
        <SectionHeader title={ui.recentCourses} href="/dashboard/my-courses" label={ui.viewAll} />
        {!data || data.recentViews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-y-2 text-gray-300">
            <RiBookReadLine size={40} />
            <p className="text-sm">{ui.noCourses}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {data.recentViews.slice(0, 4).map((v) => {
              const progress = progressByCourseId.get(v.courseId) ?? 0;
              return (
                <Link
                  key={`${v.type}-${v.id}`}
                  href={`/courses/${v.courseId}`}
                  className="group flex flex-col rounded-xl overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="aspect-video bg-gradient-to-br from-[var(--brand)]/20 to-[var(--brand)]/5 flex items-center justify-center">
                    <RiPlayCircleLine
                      size={32}
                      className="text-[var(--brand)]/40 group-hover:text-[var(--brand)]/70 transition-colors"
                    />
                  </div>
                  <div className="p-3 bg-gray-50 flex-1">
                    <p className="text-xs font-semibold text-[var(--ink)] line-clamp-2 mb-2 leading-relaxed">
                      {v.title[locale]}
                    </p>
                    <div className="flex items-center gap-x-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--brand)] rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0">{progress}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent tickets */}
      <div className="bg-white rounded-2xl p-5 sm:p-6">
        <SectionHeader title={ui.recentTickets} href="/dashboard/tickets" label={ui.viewAll} />
        {!data || data.recentTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-y-2 text-gray-300">
            <RiMessage2Line size={40} />
            <p className="text-sm">{ui.noTickets}</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-50">
            {data.recentTickets.map((tk) => {
              const StatusIcon = STATUS_ICON[tk.status];
              return (
                <Link
                  key={tk.id}
                  href={`/dashboard/tickets/${tk.id}`}
                  className="flex items-center gap-x-3 py-3.5 hover:bg-gray-50 -mx-2 px-2 rounded-xl transition-colors"
                >
                  <span className={`size-2 shrink-0 rounded-full ${STATUS_DOT[tk.status]}`} />
                  <span className="flex-1 text-sm text-[var(--ink)] font-medium line-clamp-1">
                    {tk.subject}
                  </span>
                  <span
                    className={`hidden sm:flex items-center gap-x-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg shrink-0 ${STATUS_BADGE[tk.status]}`}
                  >
                    <StatusIcon size={12} />
                    {ui.ticketStatus[tk.status]}
                  </span>
                  <div className="hidden md:flex items-center gap-x-1 text-[11px] text-gray-400 shrink-0">
                    <RiTimeLine size={12} />
                    <span>{tk.createdAt.slice(0, 10)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
