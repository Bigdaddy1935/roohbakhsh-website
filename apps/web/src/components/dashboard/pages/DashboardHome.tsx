"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiBookOpenLine, RiQuestionLine, RiCustomerService2Line, RiWalletLine, RiArrowLeftSLine } from "react-icons/ri";
import { MOCK_STATS, MOCK_MY_COURSES, MOCK_TICKETS } from "@/data/dashboard.mock";

const UI = {
  ar: {
    stats: [
      { label: "دوراتي", icon: RiBookOpenLine, color: "bg-blue-50 text-blue-500" },
      { label: "الأسئلة", icon: RiQuestionLine, color: "bg-purple-50 text-purple-500" },
      { label: "التيكيت", icon: RiCustomerService2Line, color: "bg-orange-50 text-orange-500" },
      { label: "المحفظة", icon: RiWalletLine, color: "bg-green-50 text-green-600" },
    ],
    statValues: [MOCK_STATS.courses, MOCK_STATS.questions, MOCK_STATS.tickets, MOCK_STATS.wallet],
    statLinks: ["/dashboard/my-courses", "#", "/dashboard/tickets", "#"],
    recentCourses: "آخر ما شاهدته",
    viewAll: "عرض الكل",
    recentTickets: "التيكيت الأخيرة",
    ticketStatus: { open: "مفتوح", answered: "تمت الإجابة", closed: "مغلق" },
    viewDetails: "عرض التفاصيل",
    watched: "مشاهدة",
  },
  ur: {
    stats: [
      { label: "میرے کورسز", icon: RiBookOpenLine, color: "bg-blue-50 text-blue-500" },
      { label: "سوالات", icon: RiQuestionLine, color: "bg-purple-50 text-purple-500" },
      { label: "ٹکٹس", icon: RiCustomerService2Line, color: "bg-orange-50 text-orange-500" },
      { label: "والٹ", icon: RiWalletLine, color: "bg-green-50 text-green-600" },
    ],
    statValues: [MOCK_STATS.courses, MOCK_STATS.questions, MOCK_STATS.tickets, MOCK_STATS.wallet],
    statLinks: ["/dashboard/my-courses", "#", "/dashboard/tickets", "#"],
    recentCourses: "حال ہی میں دیکھے گئے",
    viewAll: "سب دیکھیں",
    recentTickets: "حالیہ ٹکٹس",
    ticketStatus: { open: "کھلا", answered: "جواب دیا", closed: "بند" },
    viewDetails: "تفصیلات دیکھیں",
    watched: "دیکھا",
  },
};

const STATUS_CLASS: Record<string, string> = {
  open:     "bg-blue-50 text-blue-600",
  answered: "bg-green-50 text-[var(--brand)]",
  closed:   "bg-gray-100 text-gray-500",
};

export default function DashboardHome() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  return (
    <div className="flex flex-col gap-y-5 p-4 sm:p-5 lg:p-0">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ui.stats.map((s, i) => (
          <Link key={i} href={ui.statLinks[i]}
            className="bg-white rounded-md p-4 flex items-center justify-between border border-gray-100 hover:border-gray-200 transition-colors">
            <div>
              <p className="text-2xl font-extrabold text-[var(--ink)]">{ui.statValues[i]}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
            <div className={`size-12 rounded-md flex items-center justify-center ${s.color}`}>
              <s.icon size={24} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent courses */}
      <div className="bg-white rounded-md border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--ink)]">{ui.recentCourses}</h2>
          <Link href="/dashboard/my-courses" className="flex items-center gap-x-1 text-xs text-[var(--brand)] hover:underline">
            {ui.viewAll} <RiArrowLeftSLine size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-12 gap-4">
          {MOCK_MY_COURSES.slice(0, 4).map((c) => (
            <div key={c.id} className="col-span-6 sm:col-span-6 lg:col-span-4 xl:col-span-3 bg-white rounded-md overflow-hidden border border-gray-100">
              <div className="relative aspect-video overflow-hidden">
                <Image src={c.thumb} alt={c.title[locale]} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="size-9 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[7px] border-b-[7px] border-l-[11px] border-transparent border-l-[var(--brand)] ms-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-[var(--ink)] line-clamp-2 h-8">{c.title[locale]}</p>
              </div>
              <div className="flex items-center gap-x-1 px-3 py-2 text-[var(--brand)]">
                <span className="text-[11px] shrink-0 select-none">{c.progress}% {ui.watched}</span>
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--brand)] rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent tickets */}
      <div className="bg-white rounded-md border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--ink)]">{ui.recentTickets}</h2>
          <Link href="/dashboard/tickets" className="flex items-center gap-x-1 text-xs text-[var(--brand)] hover:underline">
            {ui.viewAll} <RiArrowLeftSLine size={14} />
          </Link>
        </div>
        <div className="flex flex-col gap-y-3">
          {MOCK_TICKETS.slice(0, 3).map((tk) => (
            <div key={tk.id} className="flex items-center justify-between rounded-md border border-gray-100 px-4 py-3 hover:border-gray-200 transition-colors">
              <div className="flex items-center gap-x-3">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${STATUS_CLASS[tk.status]}`}>
                  {ui.ticketStatus[tk.status]}
                </span>
                <span className="text-sm text-[var(--ink)] font-medium">{tk.subject[locale]}</span>
              </div>
              <div className="flex items-center gap-x-3">
                <span className="text-xs text-gray-400 hidden sm:block">{tk.date[locale]}</span>
                <Link href="/dashboard/tickets" className="text-xs text-[var(--brand)] flex items-center gap-x-0.5 hover:underline">
                  {ui.viewDetails} <RiArrowLeftSLine size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
