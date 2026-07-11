"use client";

import { useState } from "react";
import type { PaymentRecord } from "@roohbakhsh/shared";
import { usePaymentLogs, usePaymentsPending, useApprovePayment, useRejectPayment } from "@/hooks/queries/use-payments";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import StatusBadge from "@/components/ui/StatusBadge";
import { RiCheckLine, RiCloseLine, RiImageLine } from "react-icons/ri";

const STATUS_MAP = {
  pending: { label: "در انتظار", color: "bg-yellow-50 text-yellow-700" },
  paid: { label: "پرداخت‌شده", color: "bg-green-50 text-green-700" },
  failed: { label: "ناموفق", color: "bg-red-50 text-red-700" },
};

function PendingManualPayments() {
  const { data, isLoading } = usePaymentsPending({ page: 1, limit: 50 });
  const approveMut = useApprovePayment();
  const rejectMut = useRejectPayment();
  const [rejectTarget, setRejectTarget] = useState<PaymentRecord | null>(null);

  const items = data?.items ?? [];

  if (!isLoading && items.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-[20px] p-6 mb-6">
      <h2 className="text-base font-bold text-[var(--ink)] mb-4">پرداخت‌های کارت‌به‌کارت منتظر تأیید</h2>

      {isLoading ? (
        <p className="text-sm text-gray-400">در حال بارگذاری...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((p) => (
            <div key={p.id} className="border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="block text-xs text-gray-400 mb-0.5">مبلغ</span>
                  <span className="font-bold text-[var(--ink)]">{p.amount.amountMinor.toLocaleString("fa-IR")} {p.amount.currency}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 mb-0.5">کد رهگیری</span>
                  <span className="font-mono text-xs">{p.trackingCode ?? "-"}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 mb-0.5">شماره کارت مبدأ</span>
                  <span className="font-mono text-xs" dir="ltr">{p.sourceCardNumber ?? "-"}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 mb-0.5">زمان تراکنش</span>
                  <span className="text-xs">{p.transferredAt ? p.transferredAt.slice(0, 16).replace("T", " ") : "-"}</span>
                </div>
              </div>

              {p.receiptImageUrl && (
                <a
                  href={p.receiptImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[var(--brand)] hover:underline shrink-0"
                >
                  <RiImageLine size={16} />
                  مشاهده رسید
                </a>
              )}

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => approveMut.mutate(p.id)}
                  disabled={approveMut.isPending || rejectMut.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
                >
                  <RiCheckLine size={16} />
                  تأیید
                </button>
                <button
                  onClick={() => setRejectTarget(p)}
                  disabled={approveMut.isPending || rejectMut.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  <RiCloseLine size={16} />
                  رد
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={async () => { if (rejectTarget) { await rejectMut.mutateAsync(rejectTarget.id); setRejectTarget(null); } }}
        isPending={rejectMut.isPending}
        title="رد پرداخت"
        description="کاربر باید دوباره اطلاعات پرداخت را ارسال کند. مطمئنید؟"
      />
    </div>
  );
}

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
      key: "method",
      label: "روش",
      render: (r: PaymentRecord) => (r.method === "card_to_card" ? "کارت‌به‌کارت" : "درگاه"),
    },
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
      <PageHeader title="پرداخت‌ها" description="بررسی و تأیید تراکنش‌های پرداخت" />

      <PendingManualPayments />

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
