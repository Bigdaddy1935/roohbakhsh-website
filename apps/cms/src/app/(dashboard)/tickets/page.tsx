"use client";

import { useState, type FormEvent } from "react";
import type { Ticket } from "@roohbakhsh/shared";
import {
  useTicketsAdmin,
  useTicket,
  useReplyTicket,
  useCloseTicket,
} from "@/hooks/queries/use-tickets";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { RiArrowRightLine, RiSendPlanLine } from "react-icons/ri";

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

  if (selectedId && ticket) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setSelectedId(null)}
            className="p-1.5 rounded-md text-gray-500 hover:text-[var(--brand)] hover:bg-gray-100"
          >
            <RiArrowRightLine />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-[var(--ink)]">{ticket.subject}</h1>
            <StatusBadge status={ticket.status} map={STATUS_MAP} />
          </div>
          {ticket.status !== "closed" && (
            <button
              onClick={() => closeMut.mutate(ticket.id)}
              disabled={closeMut.isPending}
              className="mr-auto px-3 py-1.5 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              بستن تیکت
            </button>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {ticket.messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-lg p-4 text-sm ${
                msg.authorType === "support"
                  ? "bg-[var(--brand)]/10 mr-8"
                  : "bg-gray-50 ml-8"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-500">
                  {msg.authorType === "support" ? "پشتیبانی" : "کاربر"}
                </span>
                <span className="text-xs text-gray-400">{msg.createdAt.slice(0, 10)}</span>
              </div>
              <p className="text-[var(--ink)] leading-relaxed">{msg.body}</p>
            </div>
          ))}
        </div>

        {ticket.status !== "closed" && (
          <form onSubmit={handleReply} className="space-y-3">
            <textarea
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              rows={4}
              placeholder="متن پاسخ را وارد کنید..."
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={replyMut.isPending || !replyBody.trim()}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-50"
              >
                <RiSendPlanLine />
                {replyMut.isPending ? "در حال ارسال..." : "ارسال پاسخ"}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  const columns = [
    { key: "subject", label: "موضوع", render: (r: Ticket) => r.subject },
    {
      key: "status",
      label: "وضعیت",
      render: (r: Ticket) => <StatusBadge status={r.status} map={STATUS_MAP} />,
    },
    {
      key: "contact",
      label: "ایمیل/کاربر",
      render: (r: Ticket) => r.guestEmail ?? r.userId ?? "-",
    },
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
        data={items as Record<string, unknown>[]}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
