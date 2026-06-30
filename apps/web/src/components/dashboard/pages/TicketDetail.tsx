"use client";

import { useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiArrowRightSLine, RiLoader4Line, RiUser3Line, RiCustomerService2Line,
  RiAttachment2, RiSendPlaneLine, RiCheckLine, RiErrorWarningLine,
} from "react-icons/ri";
import { useTicket, useReplyTicket, useCloseTicket } from "@/hooks/queries/use-tickets";
import { TicketDetailSkeleton } from "@/components/dashboard/DashboardSkeleton";
import type { TicketStatus } from "@roohbakhsh/shared";

const UI = {
  ar: {
    back: "العودة إلى التيكيتات",
    ticketNo: "رقم التيكيت",
    status: { open: "مفتوح", answered: "تمت الإجابة", closed: "مغلق" } as Record<TicketStatus, string>,
    you: "أنت",
    support: "الدعم الفني",
    replyPlaceholder: "اكتب ردك هنا...",
    send: "إرسال",
    sending: "جاري الإرسال...",
    attach: "إرفاق",
    attachSoon: "رفع الملفات سيتم إضافته قريباً.",
    closeTicket: "إغلاق التيكيت",
    closing: "جاري الإغلاق...",
    closedNotice: "هذا التيكيت مغلق ولا يمكن الرد عليه.",
    notFound: "التيكيت غير موجود.",
    error: "حدث خطأ. حاول مرة أخرى.",
    required: "الرد لا يمكن أن يكون فارغاً.",
  },
  ur: {
    back: "ٹکٹس کی طرف واپس",
    ticketNo: "ٹکٹ نمبر",
    status: { open: "کھلا", answered: "جواب دیا", closed: "بند" } as Record<TicketStatus, string>,
    you: "آپ",
    support: "سپورٹ",
    replyPlaceholder: "اپنا جواب یہاں لکھیں...",
    send: "بھیجیں",
    sending: "بھیجا جا رہا ہے...",
    attach: "منسلک کریں",
    attachSoon: "فائل اپ لوڈ جلد شامل ہوگا۔",
    closeTicket: "ٹکٹ بند کریں",
    closing: "بند ہو رہا ہے...",
    closedNotice: "یہ ٹکٹ بند ہے۔",
    notFound: "ٹکٹ موجود نہیں۔",
    error: "ایک خامی پیش آگئی۔",
    required: "جواب خالی نہیں ہو سکتا۔",
  },
};

const STATUS_BADGE: Record<TicketStatus, string> = {
  open:     "bg-blue-50 text-blue-600",
  answered: "bg-emerald-50 text-emerald-600",
  closed:   "bg-gray-100 text-gray-500",
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
    if (!body.trim()) { setError(ui.required); return; }
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

  if (isLoading) return <TicketDetailSkeleton />;

  if (isError || !ticket) {
    return (
      <div className="bg-white p-4 sm:p-5 lg:rounded-lg lg:p-7 min-h-full flex flex-col items-center justify-center py-24 gap-y-4">
        <div className="size-20 rounded-lg bg-red-50 flex items-center justify-center">
          <RiErrorWarningLine size={36} className="text-red-400" />
        </div>
        <p className="text-[var(--ink)] font-semibold">{ui.notFound}</p>
        <Link href="/dashboard/tickets" className="text-sm text-[var(--brand)] hover:underline">
          {ui.back}
        </Link>
      </div>
    );
  }

  const isClosed = ticket.status === "closed";

  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-lg lg:p-7 min-h-full flex flex-col gap-y-5">
      {/* Back */}
      <Link
        href="/dashboard/tickets"
        className="flex items-center gap-x-1 text-xs font-semibold text-[var(--brand)] hover:opacity-75 transition-opacity self-start"
      >
        <RiArrowRightSLine size={15} />
        {ui.back}
      </Link>

      {/* Ticket header */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-5 border-b border-gray-100">
        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-[var(--ink)] leading-snug">
            {ticket.subject}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
            <span className="font-mono"># {ticket.id.slice(0, 8)}</span>
            <span>{ticket.createdAt.slice(0, 10)}</span>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-md shrink-0 ${STATUS_BADGE[ticket.status]}`}>
          {ui.status[ticket.status]}
        </span>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-y-5">
        {ticket.messages.map((m) => {
          const isSupport = m.authorType === "support";
          return (
            <div key={m.id} className={`flex gap-x-3 ${isSupport ? "" : "flex-row-reverse"}`}>
              <div
                className={`size-9 shrink-0 rounded-full flex items-center justify-center ${
                  isSupport ? "bg-[var(--brand)] text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {isSupport ? <RiCustomerService2Line size={17} /> : <RiUser3Line size={17} />}
              </div>
              <div className={`max-w-[80%] ${isSupport ? "" : "flex flex-col items-end"}`}>
                <div
                  className={`rounded-lg px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                    isSupport
                      ? "bg-[var(--brand)]/8 text-[var(--ink)] rounded-ss-none"
                      : "bg-gray-100 text-[var(--ink)] rounded-se-none"
                  }`}
                >
                  {m.body}
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5 px-1">
                  {isSupport ? ui.support : ui.you} · {m.createdAt.slice(0, 16).replace("T", " ")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply or closed notice */}
      {isClosed ? (
        <div className="mt-auto border-t border-gray-100 pt-5 text-center">
          <div className="inline-flex items-center gap-x-2 text-sm text-gray-400 bg-gray-50 rounded-md px-4 py-3">
            <RiCheckLine size={16} className="text-gray-300" />
            {ui.closedNotice}
          </div>
        </div>
      ) : (
        <div className="mt-auto border-t border-gray-100 pt-5 flex flex-col gap-y-3">
          {replyTicket.isError && (
            <div className="flex items-center gap-x-2 text-xs text-red-600 bg-red-50 rounded-md px-4 py-3">
              <RiErrorWarningLine size={15} />
              {ui.error}
            </div>
          )}
          {error && <p className="text-xs text-red-500">{error}</p>}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder={ui.replyPlaceholder}
            className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[var(--brand)] transition-colors resize-none"
          />
          <div className="flex items-center justify-between gap-x-3">
            <div className="flex items-center gap-x-2">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="ticket-attach"
                disabled
              />
              <label
                htmlFor="ticket-attach"
                title={ui.attachSoon}
                className="flex items-center gap-x-1.5 h-9 px-3 rounded-md border border-gray-200 text-xs text-gray-400 cursor-not-allowed select-none"
              >
                <RiAttachment2 size={15} />
                {attachedName ?? ui.attach}
              </label>
            </div>
            <div className="flex items-center gap-x-2">
              <button
                type="button"
                onClick={() => closeTicket.mutate(id)}
                disabled={closeTicket.isPending}
                className="h-9 px-4 rounded-md border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60 cursor-pointer"
              >
                {closeTicket.isPending ? ui.closing : ui.closeTicket}
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={replyTicket.isPending}
                className="flex items-center gap-x-2 h-9 px-5 rounded-md bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
              >
                {replyTicket.isPending
                  ? <RiLoader4Line size={16} className="animate-spin" />
                  : <RiSendPlaneLine size={16} />
                }
                {replyTicket.isPending ? ui.sending : ui.send}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
