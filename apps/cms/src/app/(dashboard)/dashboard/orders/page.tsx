"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminOrderRecord } from "@roohbakhsh/shared";
import { useOrdersAdmin } from "@/hooks/queries/use-orders";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { Modal } from "@heroui/react";
import { RiCloseLine, RiEyeLine, RiBankCardLine } from "react-icons/ri";

const STATUS_MAP = {
  pending: { label: "در انتظار", color: "bg-yellow-50 text-yellow-700" },
  paid: { label: "پرداخت‌شده", color: "bg-green-50 text-green-700" },
  failed: { label: "ناموفق", color: "bg-red-50 text-red-700" },
  cancelled: { label: "لغوشده", color: "bg-gray-100 text-gray-500" },
  refunded: { label: "بازگشتی", color: "bg-blue-50 text-blue-700" },
};

function OrderDetailModal({ order, onClose }: { order: AdminOrderRecord | null; onClose: () => void }) {
  return (
    <Modal isOpen={!!order} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container placement="center" className="max-w-lg w-full mx-4">
          <Modal.Dialog className="bg-white rounded-[20px]">
            <Modal.Header className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <div>
                <Modal.Heading className="text-[var(--ink)] font-bold text-base">جزئیات سفارش</Modal.Heading>
                {order?.user && (
                  <p className="text-xs text-gray-400 mt-0.5">{order.user.fullName} · {order.user.email}</p>
                )}
              </div>
              <Modal.CloseTrigger
                onClick={onClose}
                className="size-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <RiCloseLine size={18} />
              </Modal.CloseTrigger>
            </Modal.Header>

            {order && (
              <Modal.Body className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto px-6 py-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-gray-400 mb-1">دوره‌های سفارش</span>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm border border-gray-100 rounded-[12px] px-3 py-2.5">
                      <span className="text-[var(--ink)]">{item.titleSnapshot.ar}</span>
                      <span className="text-gray-500 text-xs">
                        {item.priceSnapshot ? `${item.priceSnapshot.amountMinor.toLocaleString("fa-IR")} ${item.priceSnapshot.currency}` : "رایگان"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 text-sm border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">جمع جزء</span>
                    <span className="font-bold text-[var(--ink)]">{order.subtotal.amountMinor.toLocaleString("fa-IR")} {order.subtotal.currency}</span>
                  </div>
                  {order.discountAmount.amountMinor > 0 && (
                    <div className="flex items-center justify-between text-[var(--brand)]">
                      <span>تخفیف {order.couponCode ? `(کد: ${order.couponCode})` : ""}</span>
                      <span className="font-bold">-{order.discountAmount.amountMinor.toLocaleString("fa-IR")} {order.discountAmount.currency}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-base pt-2 border-t border-gray-100">
                    <span className="font-bold text-[var(--ink)]">مبلغ نهایی</span>
                    <span className="font-extrabold text-[var(--brand)]">{order.total.amountMinor.toLocaleString("fa-IR")} {order.total.currency}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-3">
                  <StatusBadge status={order.status} map={STATUS_MAP} />
                  <span>{new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(order.createdAt))}</span>
                </div>
              </Modal.Body>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrdersAdmin({ page, limit: 15 });
  const [detailTarget, setDetailTarget] = useState<AdminOrderRecord | null>(null);
  const router = useRouter();

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    {
      key: "user",
      label: "کاربر",
      render: (r: AdminOrderRecord) => (
        <div>
          <p className="text-sm font-medium text-[var(--ink)]">{r.user?.fullName ?? "-"}</p>
          <p className="text-xs text-gray-400">{r.user?.email ?? ""}</p>
        </div>
      ),
    },
    {
      key: "courses",
      label: "دوره‌ها",
      render: (r: AdminOrderRecord) =>
        r.items.length > 0 ? (
          <div className="flex flex-col gap-0.5">
            {r.items.map((item) => (
              <span key={item.id} className="text-xs text-gray-600">{item.titleSnapshot.ar}</span>
            ))}
          </div>
        ) : <span className="text-xs text-gray-400">-</span>,
    },
    {
      key: "total",
      label: "مبلغ",
      render: (r: AdminOrderRecord) =>
        r.total ? `${r.total.amountMinor.toLocaleString("fa-IR")} ${r.total.currency}` : "-",
    },
    {
      key: "status",
      label: "وضعیت",
      render: (r: AdminOrderRecord) => <StatusBadge status={r.status} map={STATUS_MAP} />,
    },
    {
      key: "createdAt",
      label: "تاریخ",
      render: (r: AdminOrderRecord) => new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(r.createdAt)),
    },
    {
      key: "actions",
      label: "عملیات",
      render: (r: AdminOrderRecord) => (
        <button
          onClick={() => setDetailTarget(r)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <RiEyeLine size={15} />
          جزئیات
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--ink)]">سفارش‌ها</h1>
          <p className="text-sm text-gray-400 mt-0.5">لیست سفارش‌های کاربران</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/payments?tab=pending")}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100 hover:bg-yellow-100 transition-colors"
        >
          <RiBankCardLine size={16} />
          پرداخت‌های منتظر تأیید
        </button>
      </div>

      <DataTable
        columns={columns as Parameters<typeof DataTable>[0]["columns"]}
        data={items}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <OrderDetailModal order={detailTarget} onClose={() => setDetailTarget(null)} />
    </div>
  );
}
