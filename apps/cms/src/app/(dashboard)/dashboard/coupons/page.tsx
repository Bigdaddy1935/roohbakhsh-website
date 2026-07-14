"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@heroui/react";
import type { CouponRecord } from "@roohbakhsh/shared";
import { useCoupons, useDeleteCoupon, useUpdateCoupon } from "@/hooks/queries/use-coupons";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import StatusBadge from "@/components/ui/StatusBadge";
import FormField from "@/components/ui/FormField";
import DateField from "@/components/ui/DateField";
import SwitchField from "@/components/ui/SwitchField";
import { RiEditLine, RiDeleteBinLine, RiSaveLine, RiCloseLine } from "react-icons/ri";
import { toast } from "sonner";

const ACTIVE_MAP = {
  true: { label: "فعال", color: "bg-green-50 text-green-700" },
  false: { label: "غیرفعال", color: "bg-gray-100 text-gray-500" },
};
const TYPE_MAP = {
  percentage: { label: "درصدی", color: "bg-blue-50 text-blue-700" },
  fixed: { label: "ثابت", color: "bg-yellow-50 text-yellow-700" },
};

function EditModal({ coupon, onClose }: { coupon: CouponRecord; onClose: () => void }) {
  const updateMut = useUpdateCoupon(coupon.id);
  const [maxUses, setMaxUses] = useState(coupon.maxUses != null ? String(coupon.maxUses) : "");
  const [expiresAt, setExpiresAt] = useState(coupon.expiresAt ?? "");
  const [isActive, setIsActive] = useState(coupon.isActive);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateMut.mutateAsync({ maxUses: maxUses ? Number(maxUses) : null, expiresAt: expiresAt || null, isActive });
      toast.success("کوپن با موفقیت ویرایش شد.");
      onClose();
    } catch {
      toast.error("خطا در ویرایش کوپن.");
    }
  }

  return (
    <Modal isOpen onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container placement="center" className="max-w-md w-full mx-4">
          <Modal.Dialog className="bg-white rounded-[20px]">
            <form onSubmit={handleSubmit}>
              <Modal.Header className="flex items-center justify-between pb-4">
                <div>
                  <Modal.Heading className="text-base font-bold text-[var(--ink)]">ویرایش کوپن: {coupon.code}</Modal.Heading>
                  <p className="text-xs text-gray-400 mt-0.5">تنظیمات کوپن را ویرایش کنید</p>
                </div>
                <Modal.CloseTrigger onClick={onClose} className="size-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
                  <RiCloseLine size={18} />
                </Modal.CloseTrigger>
              </Modal.Header>
              <Modal.Body className="space-y-4">
                <FormField label="حداکثر استفاده" type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} dir="ltr" />
                <DateField label="تاریخ انقضا" value={expiresAt} onChange={setExpiresAt} />
                <SwitchField label="فعال باشد" checked={isActive} onChange={setIsActive} />
              </Modal.Body>
              <Modal.Footer className="flex gap-2 justify-end pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">انصراف</button>
                <button type="submit" disabled={updateMut.isPending} className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90 disabled:opacity-50 transition-colors">
                  <RiSaveLine size={15} />
                  {updateMut.isPending ? "در حال ذخیره..." : "ذخیره"}
                </button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default function CouponsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useCoupons({ page, limit: 15 });
  const deleteMut = useDeleteCoupon();
  const [deleteTarget, setDeleteTarget] = useState<CouponRecord | null>(null);
  const [editTarget, setEditTarget] = useState<CouponRecord | null>(null);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    { key: "code", label: "کد" },
    { key: "discountType", label: "نوع", render: (r: CouponRecord) => <StatusBadge status={r.discountType} map={TYPE_MAP} /> },
    { key: "discountValue", label: "مقدار", render: (r: CouponRecord) => r.discountType === "percentage" ? `${r.discountValue}٪` : String(r.discountValue) },
    { key: "usage", label: "استفاده/max", render: (r: CouponRecord) => `${r.usedCount} / ${r.maxUses ?? "∞"}` },
    { key: "expiresAt", label: "انقضا", render: (r: CouponRecord) => r.expiresAt?.slice(0, 10) ?? "-" },
    { key: "isActive", label: "وضعیت", render: (r: CouponRecord) => <StatusBadge status={String(r.isActive)} map={ACTIVE_MAP} /> },
    {
      key: "actions", label: "عملیات",
      render: (r: CouponRecord) => (
        <div className="flex gap-2">
          <button onClick={() => setEditTarget(r)} className="p-2 rounded-md text-gray-500 hover:text-[var(--brand)] hover:bg-gray-100 transition-colors">
            <RiEditLine size={19} />
          </button>
          <button onClick={() => setDeleteTarget(r)} className="p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
            <RiDeleteBinLine size={19} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="کوپن‌های تخفیف" description="مدیریت کدهای تخفیف" onAdd={() => router.push("/dashboard/coupons/new")} addLabel="کوپن جدید" />
      <DataTable columns={columns} data={items} isLoading={isLoading} page={page} totalPages={totalPages} onPageChange={setPage} />
      {editTarget && <EditModal coupon={editTarget} onClose={() => setEditTarget(null)} />}
      <ConfirmModal
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) { await deleteMut.mutateAsync(deleteTarget.id); setDeleteTarget(null); } }}
        isPending={deleteMut.isPending} title="حذف کوپن" description={`آیا از حذف کوپن "${deleteTarget?.code}" مطمئن هستید؟`}
      />
    </div>
  );
}
