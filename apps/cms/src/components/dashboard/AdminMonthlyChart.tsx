"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useAdminMonthlyStats } from "@/hooks/queries/use-admin-monthly-stats";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const CURRENCY_COLORS: Record<string, string> = {
  IRR: "#0CA789",
  USD: "#FF9F1C",
  EUR: "#2B2D42",
};

export default function AdminMonthlyChart() {
  const year = new Date().getFullYear();
  const { data, isLoading } = useAdminMonthlyStats(year);

  const countsData = useMemo(() => {
    if (!data) return null;
    return {
      labels: data.months,
      datasets: [
        {
          label: "سفارش‌های پرداخت‌شده",
          data: data.paidOrdersCount,
          borderColor: "#FF9F1C",
          backgroundColor: "#FF9F1C",
          tension: 0.3,
        },
        {
          label: "کاربران ثبت‌نامی",
          data: data.newUsersCount,
          borderColor: "#0CA789",
          backgroundColor: "#0CA789",
          tension: 0.3,
        },
        {
          label: "نظرات ثبت‌شده",
          data: data.reviewsCount,
          borderColor: "#2B2D42",
          backgroundColor: "#2B2D42",
          tension: 0.3,
        },
      ],
    };
  }, [data]);

  const revenueData = useMemo(() => {
    if (!data) return null;
    const currencies = Object.keys(data.revenueByCurrency);
    return {
      labels: data.months,
      datasets: currencies.map((currency) => {
        // amountMinor → واحد اصلی: ریال بدون تقسیم، دلار/یورو بر ۱۰۰ (سنت)
        const divisor = currency === "IRR" ? 1 : 100;
        return {
          label: `درآمد (${currency})`,
          data: data.revenueByCurrency[currency]!.map((v) => v / divisor),
          backgroundColor: CURRENCY_COLORS[currency] ?? "#0CA789",
          borderRadius: 4,
        };
      }),
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-[20px] p-5 h-80 animate-pulse" />
        <div className="bg-white border border-gray-100 rounded-[20px] p-5 h-80 animate-pulse" />
      </div>
    );
  }

  if (!countsData || !revenueData) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <div className="bg-white border border-gray-100 rounded-[20px] p-5">
        <h2 className="text-sm font-bold text-[var(--ink)] mb-4">آمار ماهانه {year}</h2>
        <div className="h-64">
          <Line
            data={countsData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "bottom", labels: { font: { size: 11 } } } },
              scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
            }}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[20px] p-5">
        <h2 className="text-sm font-bold text-[var(--ink)] mb-4">درآمد ماهانه {year}</h2>
        <div className="h-64">
          <Bar
            data={revenueData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "bottom", labels: { font: { size: 11 } } } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      </div>
    </div>
  );
}
