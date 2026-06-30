"use client";

import { useLocale } from "next-intl";
import { RiBankCardLine, RiCalendar2Line, RiHashtag } from "react-icons/ri";
import { TransactionsPageSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useMyInvoices } from "@/hooks/queries/use-invoices";
import { formatMoney } from "@/lib/format";

const UI = {
  ar: {
    title: "المعاملات",
    subtitle: "سجل جميع مشترياتك وفواتيرك",
    cols: ["رقم الفاتورة", "الدورات", "التاريخ", "المبلغ"],
    empty: "لا توجد معاملات بعد",
    emptyHint: "ستظهر فواتيرك هنا بعد أول عملية شراء",
  },
  ur: {
    title: "لین دین",
    subtitle: "آپ کی تمام خریداریوں اور انوائسز کا ریکارڈ",
    cols: ["انوائس نمبر", "کورسز", "تاریخ", "رقم"],
    empty: "ابھی کوئی لین دین نہیں",
    emptyHint: "پہلی خریداری کے بعد آپ کے انوائس یہاں ظاہر ہوں گے",
  },
};

export default function Transactions() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  const { data, isLoading } = useMyInvoices({ limit: 50 });
  const invoices = data?.items ?? [];

  if (isLoading) return <TransactionsPageSkeleton />;

  if (invoices.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-5 lg:rounded-2xl lg:p-7 min-h-full flex flex-col items-center justify-center py-24 gap-y-4">
        <div className="size-20 rounded-2xl bg-[var(--brand)]/10 flex items-center justify-center">
          <RiBankCardLine size={36} className="text-[var(--brand)]" />
        </div>
        <div className="text-center">
          <p className="font-bold text-[var(--ink)]">{ui.empty}</p>
          <p className="text-sm text-gray-400 mt-1">{ui.emptyHint}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-2xl lg:p-7 min-h-full">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[var(--ink)]">{ui.title}</h1>
        <p className="text-sm text-gray-400 mt-0.5">{ui.subtitle}</p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl overflow-hidden border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {ui.cols.map((col) => (
                <th key={col} className="px-5 py-4 text-xs font-bold text-gray-500 text-start">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4">
                  <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                    {inv.invoiceNumber}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm font-medium text-[var(--ink)] max-w-[200px] truncate">
                  {inv.items.map((it) => it.titleSnapshot[locale]).join("، ")}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-x-1.5 text-gray-500 text-xs">
                    <RiCalendar2Line size={13} className="text-gray-300" />
                    {inv.issuedAt.slice(0, 10)}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="font-bold text-[var(--brand)]">{formatMoney(inv.total, locale)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-y-3 md:hidden">
        {invoices.map((inv) => (
          <div key={inv.id} className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-y-3">
            <div className="flex items-center justify-between gap-x-3">
              <p className="text-sm font-semibold text-[var(--ink)] line-clamp-2 flex-1">
                {inv.items.map((it) => it.titleSnapshot[locale]).join("، ")}
              </p>
              <span className="font-extrabold text-[var(--brand)] text-sm shrink-0">
                {formatMoney(inv.total, locale)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-x-1.5">
                <RiHashtag size={12} />
                <span className="font-mono">{inv.invoiceNumber}</span>
              </div>
              <div className="flex items-center gap-x-1.5">
                <RiCalendar2Line size={12} />
                <span>{inv.issuedAt.slice(0, 10)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
