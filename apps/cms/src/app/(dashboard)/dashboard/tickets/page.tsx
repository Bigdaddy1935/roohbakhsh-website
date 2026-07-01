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
import { RiArrowRightLine, RiSendPlaneLine } from "react-icons/ri";

const STATUS_MAP = {
  open: { label: "Ø¨Ø§Ø²", color: "bg-blue-50 text-blue-700" },
  answered: { label: "Ù¾Ø§Ø³Ø®â€ŒØ¯Ø§Ø¯Ù‡â€ŒØ´Ø¯Ù‡", color: "bg-yellow-50 text-yellow-700" },
  closed: { label: "Ø¨Ø³ØªÙ‡", color: "bg-gray-100 text-gray-500" },
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
              Ø¨Ø³ØªÙ† ØªÛŒÚ©Øª
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
                  {msg.authorType === "support" ? "Ù¾Ø´ØªÛŒØ¨Ø§Ù†ÛŒ" : "Ú©Ø§Ø±Ø¨Ø±"}
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
              placeholder="Ù…ØªÙ† Ù¾Ø§Ø³Ø® Ø±Ø§ ÙˆØ§Ø±Ø¯ Ú©Ù†ÛŒØ¯..."
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={replyMut.isPending || !replyBody.trim()}
                className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-50"
              >
                <RiSendPlaneLine />
                {replyMut.isPending ? "Ø¯Ø± Ø­Ø§Ù„ Ø§Ø±Ø³Ø§Ù„..." : "Ø§Ø±Ø³Ø§Ù„ Ù¾Ø§Ø³Ø®"}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  const columns = [
    { key: "subject", label: "Ù…ÙˆØ¶ÙˆØ¹", render: (r: Ticket) => r.subject },
    {
      key: "status",
      label: "ÙˆØ¶Ø¹ÛŒØª",
      render: (r: Ticket) => <StatusBadge status={r.status} map={STATUS_MAP} />,
    },
    {
      key: "contact",
      label: "Ø§ÛŒÙ…ÛŒÙ„/Ú©Ø§Ø±Ø¨Ø±",
      render: (r: Ticket) => r.guestEmail ?? r.userId ?? "-",
    },
    {
      key: "createdAt",
      label: "ØªØ§Ø±ÛŒØ®",
      render: (r: Ticket) => r.createdAt.slice(0, 10),
    },
    {
      key: "actions",
      label: "Ù…Ø´Ø§Ù‡Ø¯Ù‡",
      render: (r: Ticket) => (
        <button
          onClick={() => setSelectedId(r.id)}
          className="px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Ù…Ø´Ø§Ù‡Ø¯Ù‡
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="ØªÛŒÚ©Øªâ€ŒÙ‡Ø§" description="Ù…Ø¯ÛŒØ±ÛŒØª ØªÛŒÚ©Øªâ€ŒÙ‡Ø§ÛŒ Ù¾Ø´ØªÛŒØ¨Ø§Ù†ÛŒ" />

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


