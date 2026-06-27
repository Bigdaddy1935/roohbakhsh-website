"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiAddLine, RiCloseLine, RiArrowLeftSLine, RiFolderOpenLine,
  RiTimeLine, RiRefreshLine, RiLoader4Line, RiQuestionLine,
} from "react-icons/ri";
import { useMyTickets, useCreateTicket } from "@/hooks/queries/use-tickets";
import type { TicketStatus } from "@roohbakhsh/shared";

const UI = {
  ar: {
    title: "تيكيتاتي",
    newTicket: "إنشاء تيكيت جديد",
    status: { open: "مفتوح", answered: "تمت الإجابة", closed: "مغلق" },
    viewDetails: "مشاهدة التفاصيل",
    ticketNo: "رقم التيكيت",
    date: "تاریخ ثبت",
    statusLabel: "الحالة",
    formTitle: "إنشاء تيكيت جديد",
    subjectLabel: "الموضوع",
    bodyLabel: "تفاصيل المشكلة",
    bodyPlaceholder: "اكتب تفاصيل مشكلتك أو سؤالك...",
    submit: "إرسال التيكيت",
    submitting: "جاري الإرسال...",
    cancel: "إلغاء",
    empty: "لا توجد تيكيت بعد",
    error: "حدث خطأ. حاول مرة أخرى.",
    required: "هذا الحقل مطلوب.",
  },
  ur: {
    title: "میرے ٹکٹس",
    newTicket: "نیا ٹکٹ بنائیں",
    status: { open: "کھلا", answered: "جواب دیا", closed: "بند" },
    viewDetails: "تفصیلات دیکھیں",
    ticketNo: "ٹکٹ نمبر",
    date: "تاریخ",
    statusLabel: "حیثیت",
    formTitle: "نیا ٹکٹ بنائیں",
    subjectLabel: "موضوع",
    bodyLabel: "مسئلے کی تفصیل",
    bodyPlaceholder: "اپنے مسئلے یا سوال کی تفصیل لکھیں...",
    submit: "ٹکٹ بھیجیں",
    submitting: "بھیجا جا رہا ہے...",
    cancel: "منسوخ",
    empty: "ابھی کوئی ٹکٹ نہیں",
    error: "ایک خامی پیش آگئی۔ دوبارہ کوشش کریں۔",
    required: "یہ خانہ ضروری ہے۔",
  },
};

const STATUS_CLS: Record<TicketStatus, string> = {
  open: "bg-blue-50 text-blue-600",
  answered: "bg-[var(--brand)]/10 text-[var(--brand)]",
  closed: "bg-gray-100 text-gray-500",
};

const DOT_CLS: Record<TicketStatus, string> = {
  open: "bg-blue-400",
  answered: "bg-[var(--brand)]",
  closed: "bg-gray-400",
};

export default function Tickets() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  const { data, isLoading } = useMyTickets({ limit: 50 });
  const createTicket = useCreateTicket();

  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ subject?: string; body?: string }>({});

  const tickets = data?.items ?? [];

  function closeForm() {
    setShowForm(false);
    setSubject("");
    setBody("");
    setFieldErrors({});
    createTicket.reset();
  }

  function handleSubmit() {
    const errors: typeof fieldErrors = {};
    if (!subject.trim()) errors.subject = ui.required;
    if (!body.trim()) errors.body = ui.required;
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    createTicket.mutate(
      { subject: subject.trim(), body: body.trim() },
      { onSuccess: () => closeForm() },
    );
  }

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

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RiLoader4Line size={32} className="text-[var(--brand)] animate-spin" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-y-3 text-gray-400">
          <RiQuestionLine size={48} className="opacity-30" />
          <p className="font-semibold">{ui.empty}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-3">
          {tickets.map((tk) => (
            <div
              key={tk.id}
              className="p-5 border border-gray-100 hover:border-gray-300 hover:lg:-translate-x-1 transition-all rounded-md"
            >
              <div className="flex items-center justify-between gap-x-5 mb-4">
                <div className="flex items-center gap-x-2.5 min-w-0">
                  <span className={`size-1.5 shrink-0 rounded-full ${DOT_CLS[tk.status]}`} />
                  <span className="text-sm font-semibold text-[var(--ink)] line-clamp-2">
                    {tk.subject}
                  </span>
                </div>
                <Link
                  href={`/dashboard/tickets/${tk.id}`}
                  className="flex items-center gap-x-1.5 shrink-0 h-8 px-3 rounded-md border border-[var(--brand)] text-[var(--brand)] text-xs font-semibold hover:bg-[var(--brand)]/5 transition-colors"
                >
                  <span className="hidden sm:inline">{ui.viewDetails}</span>
                  <RiArrowLeftSLine size={15} />
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-7 gap-y-2.5">
                <div className="flex items-center gap-x-2 text-xs">
                  <RiFolderOpenLine size={14} className="text-gray-400 shrink-0" />
                  <span className="text-gray-400">{ui.ticketNo}:</span>
                  <span className="text-[var(--ink)] font-mono">{tk.id.slice(0, 8)}</span>
                </div>
                <div className="flex items-center gap-x-2 text-xs">
                  <RiTimeLine size={14} className="text-gray-400 shrink-0" />
                  <span className="text-gray-400">{ui.date}:</span>
                  <span className="text-[var(--ink)]">{tk.createdAt.slice(0, 10)}</span>
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
      )}

      {/* New ticket modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg" dir="rtl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[var(--ink)]">{ui.formTitle}</h2>
              <button onClick={closeForm} className="text-gray-400 hover:text-[var(--ink)] transition-colors">
                <RiCloseLine size={22} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-y-4">
              {createTicket.isError && (
                <p className="text-xs text-red-500 bg-red-50 rounded-md px-3 py-2">{ui.error}</p>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">{ui.subjectLabel}</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`w-full h-10 rounded-md border px-3 text-sm outline-none focus:border-[var(--brand)] transition-colors ${
                    fieldErrors.subject ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {fieldErrors.subject && <p className="text-xs text-red-500 mt-1">{fieldErrors.subject}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">{ui.bodyLabel}</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder={ui.bodyPlaceholder}
                  className={`w-full rounded-md border px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors resize-none ${
                    fieldErrors.body ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {fieldErrors.body && <p className="text-xs text-red-500 mt-1">{fieldErrors.body}</p>}
              </div>
            </div>
            <div className="flex items-center gap-x-3 px-6 pb-6">
              <button
                type="button"
                onClick={closeForm}
                className="h-10 px-5 rounded-md border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {ui.cancel}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={createTicket.isPending}
                className="flex-1 h-10 rounded-md bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {createTicket.isPending ? ui.submitting : ui.submit}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
