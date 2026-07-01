"use client";

import { useState } from "react";
import type { PaymentRecord } from "@roohbakhsh/shared";
import { usePaymentLogs } from "@/hooks/queries/use-payments";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

const STATUS_MAP = {
  pending: { label: "Ø¯Ø± Ø§Ù†ØªØ¸Ø§Ø±", color: "bg-yellow-50 text-yellow-700" },
  paid: { label: "Ù¾Ø±Ø¯Ø§Ø®Øªâ€ŒØ´Ø¯Ù‡", color: "bg-green-50 text-green-700" },
  failed: { label: "Ù†Ø§Ù…ÙˆÙÙ‚", color: "bg-red-50 text-red-700" },
};

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePaymentLogs({ page, limit: 15 });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    {
      key: "id",
      label: "Ø´Ù†Ø§Ø³Ù‡",
      render: (r: PaymentRecord) => (
        <span className="font-mono text-xs">{r.id.slice(0, 8)}</span>
      ),
    },
    {
      key: "orderId",
      label: "Ø³ÙØ§Ø±Ø´",
      render: (r: PaymentRecord) => (
        <span className="font-mono text-xs">{r.orderId.slice(0, 8)}</span>
      ),
    },
    { key: "userId", label: "Ú©Ø§Ø±Ø¨Ø±", render: (r: PaymentRecord) => r.userId },
    {
      key: "amount",
      label: "Ù…Ø¨Ù„Øº",
      render: (r: PaymentRecord) =>
        r.amount ? `${r.amount.amountMinor} ${r.amount.currency}` : "-",
    },
    {
      key: "status",
      label: "ÙˆØ¶Ø¹ÛŒØª",
      render: (r: PaymentRecord) => <StatusBadge status={r.status} map={STATUS_MAP} />,
    },
    {
      key: "createdAt",
      label: "ØªØ§Ø±ÛŒØ®",
      render: (r: PaymentRecord) => r.createdAt.slice(0, 10),
    },
  ];

  return (
    <div>
      <PageHeader title="Ù„Ø§Ú¯ Ù¾Ø±Ø¯Ø§Ø®Øªâ€ŒÙ‡Ø§" description="ØªØ§Ø±ÛŒØ®Ú†Ù‡ ØªØ±Ø§Ú©Ù†Ø´â€ŒÙ‡Ø§ÛŒ Ù¾Ø±Ø¯Ø§Ø®Øª" />

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

