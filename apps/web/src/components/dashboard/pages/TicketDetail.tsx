"use client";

import { useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiArrowRightSLine, RiLoader4Line, RiUserLine, RiCustomerService2Line,
  RiAttachment2, RiSendPlaneLine, RiCheckLine, RiErrorWarningLine,
} from "react-icons/ri";
import { useTicket, useReplyTicket, useCloseTicket } from "@/hooks/queries/use-tickets";
import type { TicketStatus } from "@roohbakhsh/shared";

const UI = {
  ar: {
    back: "رجوع إلى التيكيتات",
    ticketNo: "رقم التيكيت",
    date: "تاریخ ثبت",
    status: { open: "مفتوح", answered: "تمت الإجابة", closed: "مغلق" } as Record<TicketStatus, string>,
    you: "أنت",
    support: "الدعم الفني",
    replyPlaceholder: "اكتب ردك هنا...",
    send: "إرسال الرد",
    sending: "جاري الإرسال...",
    attach: "إرفاق ملف",
    attachSoon: "رفع الملفات غير مفعّل حالياً — سيتم إضافته قريباً.",
    closeTicket: "إغلاق التيكيت",
    closing: "جاري الإغلاق...",
    closedNotice: "هذا التيكيت مغلق ولا يمكن الرد عليه.",
    notFound: "التيكيت غير موجود أو لا يمكنك الوصول إليه.",
    error: "حدث خطأ. حاول مرة أخرى.",
    required: "الرد لا يمكن أن يكون فارغاً.",
  },
  ur: {
    back: "ٹکٹس کی طرف واپس",
    ticketNo: "ٹکٹ نمبر",
    date: "تاریخ",
    status: { open: "کھلا", answered: "جواب دیا", closed: "بند" } as Record<TicketStatus, string>,
    you: "آپ",
    support: "سپورٹ",
    replyPlaceholder: "اپنا جواب یہاں لکھیں...",
    send: "جواب بھیجیں",
    sending: "بھیجا جا رہا ہے...",
    attach: "فائل منسلک کریں",
    attachSoon: "فائل اپ لوڈ ابھی فعال نہیں ہے — جلد شامل کیا جائے گا۔",
    closeTicket: "ٹکٹ بند کریں",
    closing: "بند ہو رہا ہے...",
    closedNotice: "یہ ٹکٹ بند ہے اور اس کا جواب نہیں دیا جا سکتا۔",
    notFound: "ٹکٹ موجود نہیں یا آپ اس تک رسائی نہیں رکھتے۔",
    error: "ایک خامی پیش آگئی۔ دوبارہ کوشش کریں۔",
    required: "جواب خالی نہیں ہو سکتا۔",
  },
};

const STATUS_CLS: Record<TicketStatus, string> = {
  open: "bg-blue-50 text-blue-600",
  answered: "bg-[var(--brand)]/10 text-[var(--brand)]",
  closed: "bg-gray-100 text-gray-500",
};

export default function TicketDetail({ id }: { id: string }) {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  const { data: ticket, isLoading, isError } = useTicket(id);
  const replyTicket = useReplyTicket();
  const closeTicket = useCloseTicket();

  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [attachedName, setAttachedName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setAttachedName(file ? file.name : null);
  }

  function handleSend() {
    if (!body.trim()) {
      setError(ui.required);
      return;
    }
    setError("");
    replyTicket.mutate(
      { id, body: body.trim() },
      {
        onSuccess: () => {
          setBody("");
          setAttachedName(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <RiLoader4Line size={32} className="text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7 min-h-full flex flex-col items-center justify-center gap-y-3 py-20 text-gray-400">
        <RiErrorWarningLine size={48} className="opacity-30" />
        <p>{ui.notFound}</p>
        <Link href="/dashboard/tickets" className="mt-2 text-sm text-[var(--brand)] hover:underline">
          {ui.back}
        </Link>
      </div>
    );
  }

  const isClosed = ticket.status === "closed";

  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7 min-h-full flex flex-col gap-y-5">
      <Link href="/dashboard/tickets" className="flex items-center gap-x-1 text-xs text-[var(--brand)] hover:underline self-start">
        <RiArrowRightSLine size={14} />
        {ui.back}
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-base font-bold text-[var(--ink)]">{ticket.subject}</h1>
          <div className="flex items-center gap-x-4 mt-1.5 text-xs text-gray-400">
            <span>{ui.ticketNo}: <span className="font-mono text-gray-500">{ticket.id.slice(0, 8)}</span></span>
            <span>{ui.date}: {ticket.createdAt.slice(0, 10)}</span>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${STATUS_CLS[ticket.status]}`}>
          {ui.status[ticket.status]}
        </span>
      </div>

      {/* Messages thread */}
      <div className="flex flex-col gap-y-4">
        {ticket.messages.map((m) => {
          const isSupport = m.authorType === "support";
          return (
            <div key={m.id} className={`flex gap-x-3 ${isSupport ? "" : "flex-row-reverse"}`}>
              <div
                className={`size-9 shrink-0 rounded-full flex items-center justify-center ${
                  isSupport ? "bg-[var(--brand)]/10 text-[var(--brand)]" : "bg-gray-100 text-gray-500"
                }`}
              >
                {isSupport ? <RiCustomerService2Line size={18} /> : <RiUserLine size={18} />}
              </div>
              <div className={`flex-1 max-w-[85%] ${isSupport ? "" : "flex flex-col items-end"}`}>
                <div
                  className={`rounded-lg px-4 py-2.5 text-sm whitespace-pre-wrap ${
                    isSupport ? "bg-[var(--brand)]/5 text-[var(--ink)]" : "bg-gray-50 text-[var(--ink)]"
                  }`}
                >
                  {m.body}
                </div>
                <div className="flex items-center gap-x-2 mt-1 text-[11px] text-gray-400">
                  <span>{isSupport ? ui.support : ui.you}</span>
                  <span>·</span>
                  <span>{m.createdAt.slice(0, 16).replace("T", " ")}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply form */}
      {isClosed ? (
        <div className="border-t border-gray-100 pt-4 text-center text-sm text-gray-400">
          {ui.closedNotice}
        </div>
      ) : (
        <div className="border-t border-gray-100 pt-4 flex flex-col gap-y-2.5">
          {replyTicket.isError && (
            <p className="text-xs text-red-500 bg-red-50 rounded-md px-3 py-2">{ui.error}</p>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder={ui.replyPlaceholder}
            className="w-full min-h-[200px] rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors resize-y"
          />

          {/* File attach — UI placeholder; backend has no attachment support yet */}
          <div className="flex items-center gap-x-2">
            <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" id="ticket-attach" disabled />
            <label
              htmlFor="ticket-attach"
              title={ui.attachSoon}
              className="flex items-center gap-x-1.5 h-9 px-3 rounded-md border border-gray-200 text-xs text-gray-400 cursor-not-allowed select-none"
            >
              <RiAttachment2 size={15} />
              {attachedName ?? ui.attach}
            </label>
            <span className="text-[11px] text-gray-300">{ui.attachSoon}</span>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={replyTicket.isPending}
            className="self-end flex items-center gap-x-1.5 h-10 px-5 rounded-md bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            <RiSendPlaneLine size={16} />
            {replyTicket.isPending ? ui.sending : ui.send}
          </button>

          <button
            type="button"
            onClick={() => closeTicket.mutate(id)}
            disabled={closeTicket.isPending}
            className="self-start flex items-center gap-x-1.5 h-9 px-4 rounded-md border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            <RiCheckLine size={15} />
            {closeTicket.isPending ? ui.closing : ui.closeTicket}
          </button>
        </div>
      )}
    </div>
  );
}
