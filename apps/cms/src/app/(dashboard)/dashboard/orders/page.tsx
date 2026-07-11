"use client";

import { useState } from "react";
import type { OrderRecord } from "@roohbakhsh/shared";
import { useOrdersAdmin } from "@/hooks/queries/use-orders";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { Modal } from "@heroui/react";
import { RiCloseLine, RiEyeLine } from "react-icons/ri";

const STATUS_MAP = {
  pending: { label: "در انتظار", color: "bg-yellow-50 text-yellow-700" },
  paid: { label: "پرداخت‌شده", color: "bg-green-50 text-green-700" },
  failed: { label: "ناموفق", color: "bg-red-50 text-red-700" },
  cancelled: { label: "لغوشده", color: "bg-gray-100 text-gray-500" },
  refunded: { label: "بازگشتی", color: "bg-blue-50 text-blue-700" },
};

function OrderDetailModal({ order, onClose }: { order: OrderRecord | null; onClose: () => void }) {
  return (
    <Modal isOpen={!!order} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container placement="center" className="max-w-lg w-full mx-4">
          <Modal.Dialog className="bg-white rounded-lg">
            <Modal.Header className="flex items-center justify-between">
              <Modal.Heading className="text-[var(--ink)] font-bold text-base">جزئیات سفارش</Modal.Heading>
              <Modal.CloseTrigger
                onClick={onClose}
                className="size-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <RiCloseLine size={18} />
              </Modal.CloseTrigger>
            </Modal.Header>

            {order && (
              <Modal.Body className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs text-gray-400 mb-1">آیتم‌های سفارش</span>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm border border-gray-100 rounded-md px-3 py-2">
                      <span className="text-[var(--ink)]">{item.titleSnapshot.ar}</span>
                      <span className="text-gray-500 font-mono text-xs">
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
                  <span>وضعیت: <StatusBadge status={order.status} map={STATUS_MAP} /></span>
                  <span>{order.createdAt.slice(0, 10)}</span>
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
  const [detailTarget, setDetailTarget] = useState<OrderRecord | null>(null);

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
    {
      key: "actions",
      label: "عملیات",
      render: (r: OrderRecord) => (
        <button
          onClick={() => setDetailTarget(r)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <RiEyeLine size={16} />
          جزئیات
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="سفارش‌ها" description="لیست سفارش‌های کاربران" />

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
