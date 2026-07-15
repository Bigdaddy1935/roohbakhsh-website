"use client";

import { useState, type FormEvent } from "react";
import type { AdminTicket as Ticket } from "@roohbakhsh/shared";
import {
  useTicketsAdmin,
  useTicket,
  useReplyTicket,
  useCloseTicket,
} from "@/hooks/queries/use-tickets";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { RiArrowRightLine, RiSendPlaneLine } from "react-icons/ri";

const STATUS_MAP = {
  open: { label: "باز", color: "bg-blue-50 text-blue-700" },
  answered: { label: "پاسخ‌داده‌شده", color: "bg-yellow-50 text-yellow-700" },
  closed: { label: "بسته", color: "bg-gray-100 text-gray-500" },
};

export default function TicketsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTicketsAdmin({ page, limit: 15 });
  const closeMut = useCloseTicket();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");

  const { data: ticket } = useTicket(selectedId ?? "");
  const replyMut = useReplyTicket(selectedId ?? "");

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  async function handleReply(e: FormEvent) {
    e.preventDefault();
    if (!replyBody.trim() || !selectedId) return;
    await replyMut.mutateAsync({ ticketId: selectedId, body: replyBody });
    setReplyBody("");
  }

  function formatDate(iso: string) {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(iso));
  }

  if (selectedId && ticket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
          <div className="flex items-center gap-x-3">
            <button onClick={() => setSelectedId(null)} className="p-2 rounded-[20px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <RiArrowRightLine size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">{ticket.subject}</h1>
              <div className="mt-0.5"><StatusBadge status={ticket.status} map={STATUS_MAP} /></div>
            </div>
          </div>
          {ticket.status !== "closed" && (
            <button onClick={() => closeMut.mutate(ticket.id)} disabled={closeMut.isPending}
              className="px-4 py-2 text-sm rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors">
              بستن تیکت
            </button>
          )}
        </div>

        <div className="bg-white rounded-[20px] p-6 space-y-3 min-h-[300px]">
          {ticket.messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col gap-1 ${msg.authorType === "support" ? "items-start" : "items-end"}`}>
              <span className="text-xs text-gray-400 px-1">
                {msg.authorType === "support" ? "پشتیبانی" : "کاربر"} · {formatDate(msg.createdAt)}
              </span>
              <div className={`max-w-[70%] rounded-[16px] px-4 py-3 text-sm leading-relaxed ${
                msg.authorType === "support"
                  ? "bg-[var(--brand)]/10 text-[var(--ink)] rounded-ss-none"
                  : "bg-gray-100 text-[var(--ink)] rounded-se-none"
              }`}>
                {msg.body}
              </div>
            </div>
          ))}
        </div>

        {ticket.status !== "closed" && (
          <form onSubmit={handleReply} className="bg-white rounded-[20px] p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">پاسخ به تیکت</h2>
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              rows={4}
              placeholder="متن پاسخ را وارد کنید..."
              className="w-full border border-gray-200 rounded-[12px] px-4 py-3 text-sm focus:outline-none focus:border-[var(--brand)] resize-none transition-colors"
            />
            <div className="flex justify-end">
              <button type="submit" disabled={replyMut.isPending || !replyBody.trim()}
                className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-full bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-50 transition-colors">
                <RiSendPlaneLine size={15} />
                {replyMut.isPending ? "در حال ارسال..." : "ارسال پاسخ"}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  const columns = [
    {
      key: "contact",
      label: "کاربر",
      render: (r: Ticket) => r.user?.fullName ?? r.guestEmail ?? "-",
    },
    {
      key: "status",
      label: "وضعیت",
      render: (r: Ticket) => <StatusBadge status={r.status} map={STATUS_MAP} />,
    },
    { key: "subject", label: "موضوع", render: (r: Ticket) => r.subject },
    {
      key: "createdAt",
      label: "تاریخ",
      render: (r: Ticket) => r.createdAt.slice(0, 10),
    },
    {
      key: "actions",
      label: "مشاهده",
      render: (r: Ticket) => (
        <button
          onClick={() => setSelectedId(r.id)}
          className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          مشاهده
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="تیکت‌ها" description="مدیریت تیکت‌های پشتیبانی" />

      <DataTable
        columns={columns as Parameters<typeof DataTable>[0]["columns"]}
        data={items}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}


