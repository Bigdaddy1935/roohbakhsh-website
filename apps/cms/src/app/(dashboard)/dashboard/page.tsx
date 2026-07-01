"use client";

import { useAdminStats } from "@/hooks/queries/use-admin-stats";
import {
  RiUserLine,
  RiBookOpenLine,
  RiArticleLine,
  RiShoppingCartLine,
  RiCustomerService2Line,
  RiStarLine,
} from "react-icons/ri";

interface StatCardProps {
  label: string;
  value: number | undefined;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, sub, icon, color }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-5 flex items-start gap-4">
      <div className={`p-3 rounded-md ${color}`}>{icon}</div>
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-extrabold text-[var(--ink)]">
          {value === undefined ? "—" : value.toLocaleString("fa-IR")}
        </span>
        <span className="text-sm text-gray-500">{label}</span>
        {sub && <span className="text-xs text-gray-400 mt-0.5">{sub}</span>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading } = useAdminStats();

  const cards: StatCardProps[] = [
    {
      label: "کاربران",
      value: data?.totalUsers,
      icon: <RiUserLine size={20} className="text-purple-600" />,
      color: "bg-purple-50",
    },
    {
      label: "دوره‌ها",
      value: data?.totalCourses,
      sub: data ? `${data.publishedCourses} منتشرشده` : undefined,
      icon: <RiBookOpenLine size={20} className="text-[var(--brand)]" />,
      color: "bg-emerald-50",
    },
    {
      label: "مقالات",
      value: data?.totalArticles,
      icon: <RiArticleLine size={20} className="text-blue-600" />,
      color: "bg-blue-50",
    },
    {
      label: "سفارش‌های پرداخت‌شده",
      value: data?.paidOrders,
      icon: <RiShoppingCartLine size={20} className="text-[var(--cta)]" />,
      color: "bg-orange-50",
    },
    {
      label: "تیکت‌های باز",
      value: data?.pendingTickets,
      icon: <RiCustomerService2Line size={20} className="text-red-500" />,
      color: "bg-red-50",
    },
    {
      label: "نظرات در انتظار تأیید",
      value: data?.pendingReviews,
      icon: <RiStarLine size={20} className="text-yellow-500" />,
      color: "bg-yellow-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold text-[var(--ink)]">داشبورد</h1>
        <p className="text-sm text-gray-400 mt-1">نگاه کلی به وضعیت آکادمی روح‌بخش</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-lg p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {cards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      )}
    </div>
  );
}
