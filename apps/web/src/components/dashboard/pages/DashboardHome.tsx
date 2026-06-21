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
    continue: "متابعة",
    recentTickets: "التيكيت الأخيرة",
    ticketStatus: { open: "مفتوح", answered: "تمت الإجابة", closed: "مغلق" },
    viewDetails: "عرض التفاصيل",
    unit: "ريال",
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
    continue: "جاری رکھیں",
    recentTickets: "حالیہ ٹکٹس",
    ticketStatus: { open: "کھلا", answered: "جواب دیا", closed: "بند" },
    viewDetails: "تفصیلات دیکھیں",
    unit: "روپے",
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
    <div className="flex flex-col gap-y-6 max-w-5xl mx-auto w-full">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ui.stats.map((s, i) => (
          <Link key={i} href={ui.statLinks[i]}
            className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-2xl font-extrabold text-[var(--ink)]">{ui.statValues[i]}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
            <div className={`size-12 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon size={24} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent courses */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--ink)]">{ui.recentCourses}</h2>
          <Link href="/dashboard/my-courses" className="flex items-center gap-x-1 text-xs text-[var(--brand)] hover:underline">
            {ui.viewAll} <RiArrowLeftSLine size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MOCK_MY_COURSES.slice(0, 4).map((c) => (
            <div key={c.id} className="flex flex-col gap-y-2">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <Image src={c.thumb} alt={c.title[locale]} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="size-9 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-[7px] border-b-[7px] border-l-[12px] border-transparent border-l-[var(--brand)] ms-0.5" />
                  </div>
                </div>
              </div>
              <p className="text-xs font-semibold text-[var(--ink)] line-clamp-2">{c.title[locale]}</p>
              <div className="flex items-center gap-x-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--brand)] rounded-full" style={{ width: `${c.progress}%` }} />
                </div>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">{c.progress}% {ui.watched}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent tickets */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--ink)]">{ui.recentTickets}</h2>
          <Link href="/dashboard/tickets" className="flex items-center gap-x-1 text-xs text-[var(--brand)] hover:underline">
            {ui.viewAll} <RiArrowLeftSLine size={14} />
          </Link>
        </div>
        <div className="flex flex-col gap-y-2">
          {MOCK_TICKETS.slice(0, 3).map((tk) => (
            <div key={tk.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-x-3">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${STATUS_CLASS[tk.status]}`}>
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
