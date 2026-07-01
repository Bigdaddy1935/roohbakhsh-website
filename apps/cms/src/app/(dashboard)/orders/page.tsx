"use client";

import { useState } from "react";
import type { OrderRecord } from "@roohbakhsh/shared";
import { useOrdersAdmin } from "@/hooks/queries/use-orders";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

const STATUS_MAP = {
  pending: { label: "در انتظار", color: "bg-yellow-50 text-yellow-700" },
  paid: { label: "پرداخت‌شده", color: "bg-green-50 text-green-700" },
  failed: { label: "ناموفق", color: "bg-red-50 text-red-700" },
  cancelled: { label: "لغوشده", color: "bg-gray-100 text-gray-500" },
  refunded: { label: "بازگشتی", color: "bg-blue-50 text-blue-700" },
};

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrdersAdmin({ page, limit: 15 });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    {
      key: "id",
      label: "شناسه",
      render: (r: OrderRecord) => (
        <span className="font-mono text-xs">{r.id.slice(0, 8)}</span>
      ),
    },
    { key: "userId", label: "کاربر (userId)", render: (r: OrderRecord) => r.userId },
    {
      key: "total",
      label: "مبلغ",
      render: (r: OrderRecord) =>
        r.total ? `${r.total.amountMinor} ${r.total.currency}` : "-",
    },
    {
      key: "status",
      label: "وضعیت",
      render: (r: OrderRecord) => <StatusBadge status={r.status} map={STATUS_MAP} />,
    },
    {
      key: "createdAt",
      label: "تاریخ",
      render: (r: OrderRecord) => r.createdAt.slice(0, 10),
    },
  ];

  return (
    <div>
      <PageHeader title="سفارش‌ها" description="لیست سفارش‌های کاربران" />

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
