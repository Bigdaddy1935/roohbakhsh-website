"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiBookOpenLine, RiQuestionLine, RiCustomerService2Line,
  RiWalletLine, RiArrowLeftSLine, RiLoader4Line,
} from "react-icons/ri";
import { useMe } from "@/hooks/queries/use-auth";
import { useMyOrders } from "@/hooks/queries/use-orders";
import { MOCK_TICKETS } from "@/data/dashboard.mock";
import { formatMoney } from "@/lib/format";

const STATUS_CLASS: Record<string, string> = {
  open:     "bg-blue-50 text-blue-600",
  answered: "bg-green-50 text-[var(--brand)]",
  closed:   "bg-gray-100 text-gray-500",
};

const UI = {
  ar: {
    statLabels: ["دوراتي", "الأسئلة", "التيكيت", "إجمالي الإنفاق"],
    statLinks: ["/dashboard/my-courses", "#", "/dashboard/tickets", "#"],
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
  },
  ur: {
    statLabels: ["میرے کورسز", "سوالات", "ٹکٹس", "کل خرچ"],
    statLinks: ["/dashboard/my-courses", "#", "/dashboard/tickets", "#"],
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
  },
};

const STAT_ICONS = [RiBookOpenLine, RiQuestionLine, RiCustomerService2Line, RiWalletLine];

export default function DashboardHome() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  const { data: user } = useMe();
  const { data: ordersData, isLoading: loadingOrders } = useMyOrders({ limit: 50 });

  const paidOrders = (ordersData?.items ?? []).filter((o) => o.status === "paid");

  // Unique enrolled courses
  const courseMap = new Map<string, { courseId: string; title: Record<string, string> }>();
  paidOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!courseMap.has(item.courseId)) {
        courseMap.set(item.courseId, { courseId: item.courseId, title: item.titleSnapshot as Record<string, string> });
      }
    });
  });
  const myCourses = Array.from(courseMap.values());

  // Total spend: sum of paid order totals
  const totalSpent = paidOrders.reduce<number>((sum, o) => sum + o.total.amountMinor, 0);
  const firstOrder = paidOrders[0];
  const spentMoney = firstOrder
    ? { amountMinor: totalSpent, currency: firstOrder.total.currency }
    : null;

  const statValues = [
    myCourses.length.toString(),
    "—",
    MOCK_TICKETS.length.toString(),
    spentMoney ? formatMoney(spentMoney, locale) : "—",
  ];

  return (
    <div className="flex flex-col gap-y-5 p-4 sm:p-5 lg:p-0">

      {/* Stats */}
      {loadingOrders ? (
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

      {/* Recent courses */}
      <div className="bg-white rounded-md border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[var(--ink)]">{ui.recentCourses}</h2>
          <Link href="/dashboard/my-courses" className="flex items-center gap-x-1 text-xs text-[var(--brand)] hover:underline">
            {ui.viewAll} <RiArrowLeftSLine size={14} />
          </Link>
        </div>
        {myCourses.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">{ui.noCourses}</p>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {myCourses.slice(0, 4).map((c) => (
              <div key={c.courseId} className="col-span-6 sm:col-span-6 lg:col-span-4 xl:col-span-3 bg-white rounded-md overflow-hidden border border-gray-100">
                <div className="aspect-video bg-[var(--brand)]/10 flex items-center justify-center">
                  <RiBookOpenLine size={28} className="text-[var(--brand)] opacity-40" />
                </div>
                <div className="p-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-[var(--ink)] line-clamp-2 h-8">{c.title[locale]}</p>
                </div>
                <div className="flex items-center gap-x-1 px-3 py-2 text-[var(--brand)]">
                  <span className="text-[11px] shrink-0 select-none">0% {ui.watched}</span>
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--brand)] rounded-full w-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent tickets — still mock, no tickets API */}
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
                  {ui.ticketStatus[tk.status as keyof typeof ui.ticketStatus]}
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
