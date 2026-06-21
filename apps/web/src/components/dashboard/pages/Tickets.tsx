"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { RiAddLine, RiCustomerService2Line, RiCloseLine } from "react-icons/ri";
import { MOCK_TICKETS, type TicketStatus } from "@/data/dashboard.mock";

const UI = {
  ar: {
    title: "تيكيتاتي",
    newTicket: "إنشاء تيكيت جديد",
    cols: { id: "رقم التيكيت", subject: "الموضوع", dept: "القسم", date: "تاريخ الإنشاء", status: "الحالة" },
    status: { open: "مفتوح", answered: "تمت الإجابة", closed: "مغلق" },
    viewDetails: "عرض",
    // New ticket form
    formTitle: "إنشاء تيكيت جديد",
    deptLabel: "القسم",
    subjectLabel: "الموضوع",
    bodyLabel: "تفاصيل المشكلة",
    bodyPlaceholder: "اكتب تفاصيل مشكلتك أو سؤالك...",
    submit: "إرسال التيكيت",
    cancel: "إلغاء",
    depts: ["الدعم الفني", "الدعم المالي", "الدعم التعليمي"],
  },
  ur: {
    title: "میرے ٹکٹس",
    newTicket: "نیا ٹکٹ بنائیں",
    cols: { id: "ٹکٹ نمبر", subject: "موضوع", dept: "محکمہ", date: "تاریخ", status: "حیثیت" },
    status: { open: "کھلا", answered: "جواب دیا", closed: "بند" },
    viewDetails: "دیکھیں",
    formTitle: "نیا ٹکٹ بنائیں",
    deptLabel: "محکمہ",
    subjectLabel: "موضوع",
    bodyLabel: "مسئلے کی تفصیل",
    bodyPlaceholder: "اپنے مسئلے یا سوال کی تفصیل لکھیں...",
    submit: "ٹکٹ بھیجیں",
    cancel: "منسوخ",
    depts: ["تکنیکی سپورٹ", "مالی سپورٹ", "تعلیمی سپورٹ"],
  },
};

const STATUS_CLS: Record<TicketStatus, string> = {
  open:     "bg-blue-50 text-blue-600",
  answered: "bg-green-50 text-green-600",
  closed:   "bg-gray-100 text-gray-500",
};

export default function Tickets() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [dept, setDept] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-extrabold text-[var(--ink)]">{ui.title}</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-x-1.5 h-9 px-4 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <RiAddLine size={18} />
          {ui.newTicket}
        </button>
      </div>

      {/* New ticket modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[var(--ink)]">{ui.formTitle}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-[var(--ink)] transition-colors">
                <RiCloseLine size={22} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">{ui.subjectLabel}</label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[var(--brand)] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">{ui.deptLabel}</label>
                  <select value={dept} onChange={(e) => setDept(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-[var(--brand)] transition-colors bg-white">
                    <option value="">—</option>
                    {ui.depts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">{ui.bodyLabel}</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)}
                  rows={5} placeholder={ui.bodyPlaceholder}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors resize-none" />
              </div>
            </div>
            <div className="flex items-center gap-x-3 px-6 pb-6">
              <button type="button" onClick={() => setShowForm(false)}
                className="h-10 px-5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                {ui.cancel}
              </button>
              <button type="button"
                className="flex-1 h-10 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                {ui.submit}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket list — desktop */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {Object.values(ui.cols).map((col) => (
                <th key={col} className="text-start px-5 py-3.5 text-xs font-bold text-gray-500">{col}</th>
              ))}
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {MOCK_TICKETS.map((tk) => (
              <tr key={tk.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">{tk.id}</td>
                <td className="px-5 py-3.5 font-medium text-[var(--ink)]">{tk.subject[locale]}</td>
                <td className="px-5 py-3.5 text-gray-500 text-xs">{tk.dept[locale]}</td>
                <td className="px-5 py-3.5 text-gray-400 text-xs">{tk.date[locale]}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${STATUS_CLS[tk.status]}`}>
                    {ui.status[tk.status]}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button type="button" className="flex items-center gap-x-1 text-xs text-[var(--brand)] hover:underline font-semibold">
                    <RiCustomerService2Line size={14} />
                    {ui.viewDetails}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-y-3 md:hidden">
        {MOCK_TICKETS.map((tk) => (
          <div key={tk.id} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-start justify-between gap-x-2 mb-2">
              <p className="text-sm font-bold text-[var(--ink)]">{tk.subject[locale]}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg shrink-0 ${STATUS_CLS[tk.status]}`}>
                {ui.status[tk.status]}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{tk.dept[locale]}</span>
              <span>{tk.date[locale]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
