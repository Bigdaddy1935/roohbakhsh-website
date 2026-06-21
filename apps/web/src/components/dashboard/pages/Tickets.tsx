"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Select, Label, ListBox } from "@heroui/react";
import { RiAddLine, RiCloseLine, RiArrowLeftSLine, RiFolderOpenLine, RiFileTextLine, RiTimeLine, RiRefreshLine } from "react-icons/ri";
import { MOCK_TICKETS, type TicketStatus } from "@/data/dashboard.mock";

const UI = {
  ar: {
    title: "تيكيتاتي",
    newTicket: "إنشاء تيكيت جديد",
    status: { open: "مفتوح", answered: "پاسخ داده شده", closed: "مغلق" },
    viewDetails: "مشاهده جزییات",
    ticketNo: "شماره تیکت",
    dept: "دپارتمان",
    date: "تاریخ ثبت",
    statusLabel: "وضعیت",
    formTitle: "إنشاء تيكيت جديد",
    deptLabel: "القسم",
    subjectLabel: "الموضوع",
    bodyLabel: "تفاصيل المشكلة",
    bodyPlaceholder: "اكتب تفاصيل مشكلتك أو سؤالك...",
    submit: "إرسال التيكيت",
    cancel: "إلغاء",
    depts: [
      { id: "support", label: "الدعم الفني" },
      { id: "financial", label: "الدعم المالي" },
      { id: "educational", label: "الدعم التعليمي" },
    ],
  },
  ur: {
    title: "میرے ٹکٹس",
    newTicket: "نیا ٹکٹ بنائیں",
    status: { open: "کھلا", answered: "جواب دیا", closed: "بند" },
    viewDetails: "تفصیلات دیکھیں",
    ticketNo: "ٹکٹ نمبر",
    dept: "محکمہ",
    date: "تاریخ",
    statusLabel: "حیثیت",
    formTitle: "نیا ٹکٹ بنائیں",
    deptLabel: "محکمہ",
    subjectLabel: "موضوع",
    bodyLabel: "مسئلے کی تفصیل",
    bodyPlaceholder: "اپنے مسئلے یا سوال کی تفصیل لکھیں...",
    submit: "ٹکٹ بھیجیں",
    cancel: "منسوخ",
    depts: [
      { id: "support", label: "تکنیکی سپورٹ" },
      { id: "financial", label: "مالی سپورٹ" },
      { id: "educational", label: "تعلیمی سپورٹ" },
    ],
  },
};

const STATUS_CLS: Record<TicketStatus, string> = {
  open:     "bg-blue-50/10 text-blue-600",
  answered: "bg-[var(--brand)]/10 text-[var(--brand)]",
  closed:   "bg-gray-100 text-gray-500",
};

const DOT_CLS: Record<TicketStatus, string> = {
  open:     "bg-blue-400",
  answered: "bg-[var(--brand)]",
  closed:   "bg-gray-400",
};

export default function Tickets() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [dept, setDept] = useState<string>("");
  const [body, setBody] = useState("");

  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-base font-bold text-[var(--ink)]">{ui.title}</h1>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-x-1.5 h-9 px-4 rounded-md bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <RiAddLine size={18} />
          {ui.newTicket}
        </button>
      </div>

      {/* Ticket cards */}
      <div className="flex flex-col gap-y-3">
        {MOCK_TICKETS.map((tk) => (
          <div
            key={tk.id}
            className="p-5 border border-gray-100 hover:border-gray-300 hover:lg:-translate-x-1 transition-all rounded-md"
          >
            {/* Top row: subject + view button */}
            <div className="flex items-center justify-between gap-x-5 mb-4">
              <div className="flex items-center gap-x-2.5 min-w-0">
                <span className={`size-1.5 shrink-0 rounded-full ${DOT_CLS[tk.status]}`} />
                <span className="text-sm font-semibold text-[var(--ink)] line-clamp-2">
                  {tk.subject[locale]}
                </span>
              </div>
              <button
                type="button"
                className="flex items-center gap-x-1.5 shrink-0 h-8 px-3 rounded-md border border-[var(--brand)] text-[var(--brand)] text-xs font-semibold hover:bg-[var(--brand)]/5 transition-colors"
              >
                <span className="hidden sm:inline">{ui.viewDetails}</span>
                <RiArrowLeftSLine size={15} />
              </button>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-7 gap-y-2.5">
              <div className="flex items-center gap-x-2 text-xs">
                <RiFolderOpenLine size={14} className="text-gray-400 shrink-0" />
                <span className="text-gray-400">{ui.ticketNo}:</span>
                <span className="text-[var(--ink)]">{tk.id}</span>
              </div>
              <div className="flex items-center gap-x-2 text-xs">
                <RiFileTextLine size={14} className="text-gray-400 shrink-0" />
                <span className="text-gray-400">{ui.dept}:</span>
                <span className="text-[var(--ink)]">{tk.dept[locale]}</span>
              </div>
              <div className="flex items-center gap-x-2 text-xs">
                <RiTimeLine size={14} className="text-gray-400 shrink-0" />
                <span className="text-gray-400">{ui.date}:</span>
                <span className="text-[var(--ink)]">{tk.date[locale]}</span>
              </div>
              <div className="flex items-center gap-x-2 text-xs">
                <RiRefreshLine size={14} className="text-gray-400 shrink-0" />
                <span className="text-gray-400">{ui.statusLabel}:</span>
                <span className={`px-2 py-0.5 rounded-md font-semibold ${STATUS_CLS[tk.status]}`}>
                  {ui.status[tk.status]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New ticket modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg" dir="rtl">
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
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">{ui.deptLabel}</label>
                  <Select
                    fullWidth
                    placeholder="—"
                    value={dept}
                    onChange={(v) => setDept(v as string)}
                    className="h-10"
                  >
                    <Select.Trigger className="h-10 rounded-md border border-gray-200 px-3 text-sm bg-white">
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {ui.depts.map((d) => (
                          <ListBox.Item key={d.id} id={d.id} textValue={d.label}>
                            {d.label}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">{ui.bodyLabel}</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder={ui.bodyPlaceholder}
                  className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors resize-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-x-3 px-6 pb-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-10 px-5 rounded-md border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {ui.cancel}
              </button>
              <button
                type="button"
                className="flex-1 h-10 rounded-md bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {ui.submit}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
