"use client";

import { useLocale } from "next-intl";
import { RiLoader4Line, RiFileTextLine } from "react-icons/ri";
import { useMyInvoices } from "@/hooks/queries/use-invoices";
import { formatMoney } from "@/lib/format";

const UI = {
  ar: {
    title: "المعاملات",
    cols: ["رقم الفاتورة", "الدورات", "التاريخ", "المبلغ"],
    empty: "لا توجد معاملات بعد",
  },
  ur: {
    title: "لین دین",
    cols: ["انوائس نمبر", "کورسز", "تاریخ", "رقم"],
    empty: "ابھی کوئی لین دین نہیں",
  },
};

export default function Transactions() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  const { data, isLoading } = useMyInvoices({ limit: 50 });
  const invoices = data?.items ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <RiLoader4Line size={32} className="text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7 min-h-full flex flex-col items-center justify-center gap-y-3 py-20 text-gray-400">
        <RiFileTextLine size={48} className="opacity-30" />
        <p>{ui.empty}</p>
      </div>
    );
  }

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
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">{inv.invoiceNumber}</td>
                <td className="px-5 py-3.5 font-medium text-[var(--ink)]">
                  {inv.items.map((it) => it.titleSnapshot[locale]).join("، ")}
                </td>
                <td className="px-5 py-3.5 text-gray-500">{inv.issuedAt.slice(0, 10)}</td>
                <td className="px-5 py-3.5 font-bold text-[var(--brand)]">
                  {formatMoney(inv.total, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-y-3 md:hidden">
        {invoices.map((inv) => (
          <div key={inv.id} className="bg-white rounded-md border border-gray-100 p-4 flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--ink)] line-clamp-1">
                {inv.items.map((it) => it.titleSnapshot[locale]).join("، ")}
              </span>
              <span className="font-extrabold text-[var(--brand)] text-sm">{formatMoney(inv.total, locale)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-mono">{inv.invoiceNumber}</span>
              <span>{inv.issuedAt.slice(0, 10)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
