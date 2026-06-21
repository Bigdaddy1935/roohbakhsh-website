"use client";

import { useLocale } from "next-intl";
import { MOCK_TRANSACTIONS } from "@/data/dashboard.mock";

const UI = {
  ar: {
    title: "المعاملات",
    cols: ["المعرف", "وصف المعاملة", "التاريخ", "المبلغ", "الحالة"],
    unit: "ريال",
  },
  ur: {
    title: "لین دین",
    cols: ["شناخت", "تفصیل", "تاریخ", "رقم", "حیثیت"],
    unit: "روپے",
  },
};

const STATUS: Record<string, { ar: string; ur: string; cls: string }> = {
  paid:      { ar: "مدفوع",  ur: "ادا شدہ", cls: "bg-green-50 text-green-600" },
  cancelled: { ar: "ملغي",   ur: "منسوخ",   cls: "bg-red-50 text-red-500" },
};

export default function Transactions() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7 min-h-full">
      <h1 className="text-base font-bold text-[var(--ink)] mb-5">{ui.title}</h1>

      {/* Desktop table */}
      <div className="rounded-md border border-gray-100 overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {ui.cols.map((col) => (
                <th key={col} className="text-start px-5 py-3.5 text-xs font-bold text-gray-500">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_TRANSACTIONS.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">{tx.id}</td>
                <td className="px-5 py-3.5 font-medium text-[var(--ink)]">{tx.desc[locale]}</td>
                <td className="px-5 py-3.5 text-gray-500">{tx.date[locale]}</td>
                <td className="px-5 py-3.5 font-bold text-[var(--ink)]">
                  {tx.amount.toLocaleString()} {ui.unit}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${STATUS[tx.status].cls}`}>
                    {STATUS[tx.status][locale]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-y-3 md:hidden">
        {MOCK_TRANSACTIONS.map((tx) => (
          <div key={tx.id} className="bg-white rounded-md border border-gray-100 p-4 flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--ink)]">{tx.desc[locale]}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${STATUS[tx.status].cls}`}>
                {STATUS[tx.status][locale]}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-mono">{tx.id}</span>
              <span>{tx.date[locale]}</span>
            </div>
            <p className="text-sm font-extrabold text-[var(--ink)]">{tx.amount.toLocaleString()} {ui.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
