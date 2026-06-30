"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiAddLine, RiCloseLine, RiArrowLeftSLine,
  RiMessage2Line, RiTimeLine, RiLoader4Line,
  RiHashtag, RiCheckboxCircleLine, RiErrorWarningLine,
  RiInformationLine,
} from "react-icons/ri";
import { useMyTickets, useCreateTicket } from "@/hooks/queries/use-tickets";
import type { TicketStatus } from "@roohbakhsh/shared";
import { TicketsPageSkeleton } from "@/components/dashboard/DashboardSkeleton";

const UI = {
  ar: {
    title: "الدعم الفني",
    subtitle: "تيكيتاتي ومحادثاتي مع الدعم",
    newTicket: "تيكيت جديد",
    status: { open: "مفتوح", answered: "تمت الإجابة", closed: "مغلق" } as Record<TicketStatus, string>,
    viewDetails: "التفاصيل",
    ticketNo: "رقم التيكيت",
    date: "التاريخ",
    statusLabel: "الحالة",
    formTitle: "إنشاء تيكيت جديد",
    subjectLabel: "الموضوع",
    bodyLabel: "تفاصيل المشكلة",
    bodyPlaceholder: "اكتب تفاصيل مشكلتك أو سؤالك هنا...",
    submit: "إرسال التيكيت",
    submitting: "جاري الإرسال...",
    cancel: "إلغاء",
    empty: "لا توجد تيكيتات بعد",
    emptyHint: "أنشئ تيكيتاً جديداً للحصول على المساعدة",
    error: "حدث خطأ. حاول مرة أخرى.",
    required: "هذا الحقل مطلوب.",
  },
  ur: {
    title: "سپورٹ",
    subtitle: "میرے ٹکٹس اور سپورٹ گفتگو",
    newTicket: "نیا ٹکٹ",
    status: { open: "کھلا", answered: "جواب دیا", closed: "بند" } as Record<TicketStatus, string>,
    viewDetails: "تفصیلات",
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
    emptyHint: "مدد کے لیے ایک نیا ٹکٹ بنائیں",
    error: "ایک خامی پیش آگئی۔ دوبارہ کوشش کریں۔",
    required: "یہ خانہ ضروری ہے۔",
  },
};

const STATUS_CFG: Record<TicketStatus, { badge: string; Icon: React.ElementType }> = {
  open:     { badge: "bg-blue-50 text-blue-600",       Icon: RiInformationLine       },
  answered: { badge: "bg-emerald-50 text-emerald-600", Icon: RiCheckboxCircleLine    },
  closed:   { badge: "bg-gray-100 text-gray-500",      Icon: RiErrorWarningLine      },
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
    <div className="bg-white p-4 sm:p-5 lg:rounded-lg lg:p-7 min-h-full">
      <div className="flex items-start justify-between mb-6 gap-x-4">
        <div>
          <h1 className="text-lg font-bold text-[var(--ink)]">{ui.title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{ui.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="shrink-0 flex items-center gap-x-2 h-10 px-4 rounded-md bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm shadow-[var(--brand)]/30 cursor-pointer"
        >
          <RiAddLine size={18} />
          <span className="hidden sm:inline">{ui.newTicket}</span>
        </button>
      </div>

      {isLoading ? (
        <TicketsPageSkeleton />
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-y-4">
          <div className="size-20 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
            <RiMessage2Line size={36} className="text-[var(--brand)]" />
          </div>
          <div className="text-center">
            <p className="font-bold text-[var(--ink)]">{ui.empty}</p>
            <p className="text-sm text-gray-400 mt-1">{ui.emptyHint}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-x-2 h-10 px-6 rounded-md bg-[var(--brand)] text-white text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            <RiAddLine size={16} />
            {ui.newTicket}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-y-3">
          {tickets.map((tk) => {
            const cfg = STATUS_CFG[tk.status];
            return (
              <div key={tk.id} className="group p-4 sm:p-5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between gap-x-3 mb-3">
                  <div className="flex items-start gap-x-3 min-w-0">
                    <div className={`size-8 shrink-0 rounded-lg ${cfg.badge} flex items-center justify-center mt-0.5`}>
                      <cfg.Icon size={16} />
                    </div>
                    <p className="text-sm font-semibold text-[var(--ink)] line-clamp-2 leading-relaxed">
                      {tk.subject}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/tickets/${tk.id}`}
                    className="shrink-0 flex items-center gap-x-1 h-8 px-3 rounded-lg bg-white text-[var(--brand)] text-xs font-semibold hover:shadow-sm transition-all border border-gray-100"
                  >
                    <span className="hidden sm:inline">{ui.viewDetails}</span>
                    <RiArrowLeftSLine size={15} />
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400">
                  <span className="flex items-center gap-x-1.5">
                    <RiHashtag size={12} />
                    <span className="font-mono">{tk.id.slice(0, 8)}</span>
                  </span>
                  <span className="flex items-center gap-x-1.5">
                    <RiTimeLine size={12} />
                    <span>{tk.createdAt.slice(0, 10)}</span>
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${cfg.badge}`}>
                    {ui.status[tk.status]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={closeForm}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-lg w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-[var(--ink)]">{ui.formTitle}</h2>
              <button
                onClick={closeForm}
                className="size-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <RiCloseLine size={20} />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-y-4">
              {createTicket.isError && (
                <div className="flex items-center gap-x-2 text-xs text-red-600 bg-red-50 rounded-md px-4 py-3">
                  <RiErrorWarningLine size={15} />
                  {ui.error}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{ui.subjectLabel}</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`w-full h-11 rounded-md border px-4 text-sm outline-none focus:border-[var(--brand)] transition-colors ${
                    fieldErrors.subject ? "border-red-400 bg-red-50" : "border-gray-200"
                  }`}
                />
                {fieldErrors.subject && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.subject}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">{ui.bodyLabel}</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder={ui.bodyPlaceholder}
                  className={`w-full rounded-md border px-4 py-3 text-sm outline-none focus:border-[var(--brand)] transition-colors resize-none ${
                    fieldErrors.body ? "border-red-400 bg-red-50" : "border-gray-200"
                  }`}
                />
                {fieldErrors.body && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.body}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-x-3 px-6 pb-6">
              <button
                type="button"
                onClick={closeForm}
                className="h-11 px-5 rounded-md border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {ui.cancel}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={createTicket.isPending}
                className="flex-1 h-11 rounded-md bg-[var(--brand)] text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-x-2 cursor-pointer"
              >
                {createTicket.isPending && <RiLoader4Line size={16} className="animate-spin" />}
                {createTicket.isPending ? ui.submitting : ui.submit}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
