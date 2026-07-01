"use client";

import { useState } from "react";
import type { OrderRecord } from "@roohbakhsh/shared";
import { useOrdersAdmin } from "@/hooks/queries/use-orders";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

const STATUS_MAP = {
  pending: { label: "Ø¯Ø± Ø§Ù†ØªØ¸Ø§Ø±", color: "bg-yellow-50 text-yellow-700" },
  paid: { label: "Ù¾Ø±Ø¯Ø§Ø®Øªâ€ŒØ´Ø¯Ù‡", color: "bg-green-50 text-green-700" },
  failed: { label: "Ù†Ø§Ù…ÙˆÙÙ‚", color: "bg-red-50 text-red-700" },
  cancelled: { label: "Ù„ØºÙˆØ´Ø¯Ù‡", color: "bg-gray-100 text-gray-500" },
  refunded: { label: "Ø¨Ø§Ø²Ú¯Ø´ØªÛŒ", color: "bg-blue-50 text-blue-700" },
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrdersAdmin({ page, limit: 15 });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    {
      key: "id",
      label: "Ø´Ù†Ø§Ø³Ù‡",
      render: (r: OrderRecord) => (
        <span className="font-mono text-xs">{r.id.slice(0, 8)}</span>
      ),
    },
    { key: "userId", label: "Ú©Ø§Ø±Ø¨Ø± (userId)", render: (r: OrderRecord) => r.userId },
    {
      key: "total",
      label: "Ù…Ø¨Ù„Øº",
      render: (r: OrderRecord) =>
        r.total ? `${r.total.amountMinor} ${r.total.currency}` : "-",
    },
    {
      key: "status",
      label: "ÙˆØ¶Ø¹ÛŒØª",
      render: (r: OrderRecord) => <StatusBadge status={r.status} map={STATUS_MAP} />,
    },
    {
      key: "createdAt",
      label: "ØªØ§Ø±ÛŒØ®",
      render: (r: OrderRecord) => r.createdAt.slice(0, 10),
    },
  ];

  return (
    <div>
      <PageHeader title="Ø³ÙØ§Ø±Ø´â€ŒÙ‡Ø§" description="Ù„ÛŒØ³Øª Ø³ÙØ§Ø±Ø´â€ŒÙ‡Ø§ÛŒ Ú©Ø§Ø±Ø¨Ø±Ø§Ù†" />

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

