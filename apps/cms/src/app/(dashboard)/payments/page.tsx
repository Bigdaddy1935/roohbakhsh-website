"use client";

import { useState } from "react";
import type { PaymentRecord } from "@roohbakhsh/shared";
import { usePaymentLogs } from "@/hooks/queries/use-payments";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

const STATUS_MAP = {
  pending: { label: "در انتظار", color: "bg-yellow-50 text-yellow-700" },
  paid: { label: "پرداخت‌شده", color: "bg-green-50 text-green-700" },
  failed: { label: "ناموفق", color: "bg-red-50 text-red-700" },
};

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePaymentLogs({ page, limit: 15 });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    {
      key: "id",
      label: "شناسه",
      render: (r: PaymentRecord) => (
        <span className="font-mono text-xs">{r.id.slice(0, 8)}</span>
      ),
    },
    {
      key: "orderId",
      label: "سفارش",
      render: (r: PaymentRecord) => (
        <span className="font-mono text-xs">{r.orderId.slice(0, 8)}</span>
      ),
    },
    { key: "userId", label: "کاربر", render: (r: PaymentRecord) => r.userId },
    {
      key: "amount",
      label: "مبلغ",
      render: (r: PaymentRecord) =>
        r.amount ? `${r.amount.amountMinor} ${r.amount.currency}` : "-",
    },
    {
      key: "status",
      label: "وضعیت",
      render: (r: PaymentRecord) => <StatusBadge status={r.status} map={STATUS_MAP} />,
    },
    {
      key: "createdAt",
      label: "تاریخ",
      render: (r: PaymentRecord) => r.createdAt.slice(0, 10),
    },
  ];

  return (
    <div>
      <PageHeader title="لاگ پرداخت‌ها" description="تاریخچه تراکنش‌های پرداخت" />

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
