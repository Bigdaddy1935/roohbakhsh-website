"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { AdminPaymentRecord } from "@roohbakhsh/shared";
import { usePaymentLogs, usePaymentsPending, useApprovePayment, useRejectPayment } from "@/hooks/queries/use-payments";
import DataTable from "@/components/ui/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import StatusBadge from "@/components/ui/StatusBadge";
import { RiCheckLine, RiCloseLine, RiImageLine } from "react-icons/ri";

const STATUS_MAP = {
  pending: { label: "در انتظار", color: "bg-yellow-50 text-yellow-700" },
  paid: { label: "پرداخت‌شده", color: "bg-green-50 text-green-700" },
  failed: { label: "ناموفق", color: "bg-red-50 text-red-700" },
};

function PendingTab() {
  const { data, isLoading } = usePaymentsPending({ page: 1, limit: 50 });
  const approveMut = useApprovePayment();
  const rejectMut = useRejectPayment();
  const [rejectTarget, setRejectTarget] = useState<AdminPaymentRecord | null>(null);

  const items = data?.items ?? [];

  if (isLoading) return <p className="text-sm text-gray-400 py-10 text-center">در حال بارگذاری...</p>;

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <p className="text-sm text-gray-400">پرداخت کارت‌به‌کارت منتظر تأیید وجود ندارد</p>
      </div>
    );

  return (
    <>
      <div className="flex flex-col gap-3">
        {items.map((p) => (
          <div key={p.id} className="bg-white border border-gray-100 rounded-[20px] p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-[var(--ink)] text-sm">{p.user?.fullName ?? "-"}</p>
                <p className="text-xs text-gray-400">{p.user?.email ?? ""}</p>
              </div>
              <span className="font-bold text-[var(--brand)] text-sm whitespace-nowrap">{p.amount.amountMinor.toLocaleString("fa-IR")} {p.amount.currency}</span>
            </div>
            {p.courses.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {p.courses.map((c) => (
                  <span key={c.id} className="px-2.5 py-1 text-xs rounded-full bg-gray-50 border border-gray-100 text-gray-600">{c.title}</span>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
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
                <span className="text-xs">{p.transferredAt ? new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(p.transferredAt)) : "-"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
              {p.receiptImageUrl && (
                <a href={p.receiptImageUrl} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[var(--brand)] hover:underline">
                  <RiImageLine size={16} />
                  مشاهده رسید
                </a>
              )}
              <div className="flex gap-2 mr-auto">
                <button onClick={() => approveMut.mutate(p.id)} disabled={approveMut.isPending || rejectMut.isPending}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-full bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50">
                  <RiCheckLine size={15} /> تأیید
                </button>
                <button onClick={() => setRejectTarget(p)} disabled={approveMut.isPending || rejectMut.isPending}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-full bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50">
                  <RiCloseLine size={15} /> رد
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={async () => { if (rejectTarget) { await rejectMut.mutateAsync(rejectTarget.id); setRejectTarget(null); } }}
        isPending={rejectMut.isPending}
        title="رد پرداخت"
        description="کاربر باید دوباره اطلاعات پرداخت را ارسال کند. مطمئنید؟"
      />
    </>
  );
}

function LogsTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = usePaymentLogs({ page, limit: 15 });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    {
      key: "user",
      label: "کاربر",
      render: (r: AdminPaymentRecord) => (
        <div>
          <p className="text-sm font-medium text-[var(--ink)]">{r.user?.fullName ?? "-"}</p>
          <p className="text-xs text-gray-400">{r.user?.email ?? ""}</p>
        </div>
      ),
    },
    {
      key: "courses",
      label: "دوره‌ها",
      render: (r: AdminPaymentRecord) =>
        r.courses.length > 0 ? (
          <div className="flex flex-col gap-0.5">
            {r.courses.map((c) => (
              <span key={c.id} className="text-xs text-gray-600">{c.title}</span>
            ))}
          </div>
        ) : <span className="text-xs text-gray-400">-</span>,
    },
    {
      key: "method",
      label: "روش",
      render: (r: AdminPaymentRecord) => (r.method === "card_to_card" ? "کارت‌به‌کارت" : "درگاه"),
    },
    {
      key: "amount",
      label: "مبلغ",
      render: (r: AdminPaymentRecord) =>
        r.amount ? `${r.amount.amountMinor.toLocaleString("fa-IR")} ${r.amount.currency}` : "-",
    },
    {
      key: "status",
      label: "وضعیت",
      render: (r: AdminPaymentRecord) => <StatusBadge status={r.status} map={STATUS_MAP} />,
    },
    {
      key: "createdAt",
      label: "تاریخ",
      render: (r: AdminPaymentRecord) => new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(r.createdAt)),
    },
  ];

  return (
    <DataTable
      columns={columns as Parameters<typeof DataTable>[0]["columns"]}
      data={items}
      isLoading={isLoading}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  );
}

type Tab = "logs" | "pending";

function PaymentsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // تب از روی query param مشتق می‌شود تا URL منبع حقیقت باشد
  // (لینک نوتیفیکیشن به ?tab=pending حتی بدون remount درست کار کند).
  const tab: Tab = searchParams.get("tab") === "pending" ? "pending" : "logs";
  const setTab = (next: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "pending") params.set("tab", "pending");
    else params.delete("tab");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const { data: pendingData } = usePaymentsPending({ page: 1, limit: 50 });
  const pendingCount = pendingData?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--ink)]">پرداخت‌ها</h1>
          <p className="text-sm text-gray-400 mt-0.5">بررسی و تأیید تراکنش‌های پرداخت</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setTab("logs")}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors ${tab === "logs" ? "bg-white text-[var(--ink)] font-bold shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            همه تراکنش‌ها
          </button>
          <button
            onClick={() => setTab("pending")}
            className={`relative px-4 py-1.5 text-sm rounded-full transition-colors ${tab === "pending" ? "bg-white text-[var(--ink)] font-bold shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            منتظر تأیید
            {pendingCount > 0 && (
              <span className="absolute -top-1 -left-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full bg-[var(--cta)] text-white font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div>
        {tab === "logs" ? <LogsTab /> : <PendingTab />}
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense>
      <PaymentsPageInner />
    </Suspense>
  );
}
