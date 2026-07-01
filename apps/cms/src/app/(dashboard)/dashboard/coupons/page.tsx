"use client";

import { useState, type FormEvent } from "react";
import type { CouponRecord } from "@roohbakhsh/shared";
import {
  useCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
} from "@/hooks/queries/use-coupons";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import FormModal from "@/components/ui/FormModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import StatusBadge from "@/components/ui/StatusBadge";
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri";

const ACTIVE_MAP = {
  true: { label: "فعال", color: "bg-green-50 text-green-700" },
  false: { label: "غیرفعال", color: "bg-gray-100 text-gray-500" },
};

const TYPE_MAP = {
  percentage: { label: "درصدی", color: "bg-blue-50 text-blue-700" },
  fixed: { label: "ثابت", color: "bg-yellow-50 text-yellow-700" },
};

const emptyCreateForm = {
  code: "",
  discountType: "percentage" as "percentage" | "fixed",
  discountValue: "",
  currency: "USD" as "USD" | "EUR" | "IRR",
  maxUses: "",
  expiresAt: "",
  isActive: true,
};

const emptyEditForm = {
  maxUses: "",
  expiresAt: "",
  isActive: true,
};

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useCoupons({ page, limit: 15 });
  const createMut = useCreateCoupon();
  const deleteMut = useDeleteCoupon();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CouponRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CouponRecord | null>(null);

  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [editForm, setEditForm] = useState(emptyEditForm);

  const updateMut = useUpdateCoupon(editTarget?.id ?? "");

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    await createMut.mutateAsync({
      code: createForm.code,
      discountType: createForm.discountType,
      discountValue: Number(createForm.discountValue),
      currency: createForm.currency,
      maxUses: createForm.maxUses ? Number(createForm.maxUses) : undefined,
      expiresAt: createForm.expiresAt || undefined,
      isActive: createForm.isActive,
    });
    setCreateOpen(false);
    setCreateForm(emptyCreateForm);
  }

  async function handleEdit(e: FormEvent) {
    e.preventDefault();
    await updateMut.mutateAsync({
      maxUses: editForm.maxUses ? Number(editForm.maxUses) : null,
      expiresAt: editForm.expiresAt || null,
      isActive: editForm.isActive,
    });
    setEditTarget(null);
  }

  function openEdit(item: CouponRecord) {
    setEditTarget(item);
    setEditForm({
      maxUses: item.maxUses != null ? String(item.maxUses) : "",
      expiresAt: item.expiresAt ?? "",
      isActive: item.isActive,
    });
  }

  const columns = [
    { key: "code", label: "کد" },
    {
      key: "discountType",
      label: "نوع تخفیف",
      render: (r: CouponRecord) => <StatusBadge status={r.discountType} map={TYPE_MAP} />,
    },
    {
      key: "discountValue",
      label: "مقدار",
      render: (r: CouponRecord) =>
        r.discountType === "percentage" ? `${r.discountValue}٪` : String(r.discountValue),
    },
    {
      key: "usage",
      label: "استفاده‌شده/max",
      render: (r: CouponRecord) =>
        `${r.usedCount} / ${r.maxUses ?? "∞"}`,
    },
    {
      key: "expiresAt",
      label: "انقضا",
      render: (r: CouponRecord) => r.expiresAt?.slice(0, 10) ?? "-",
    },
    {
      key: "isActive",
      label: "فعال",
      render: (r: CouponRecord) => <StatusBadge status={String(r.isActive)} map={ACTIVE_MAP} />,
    },
    {
      key: "actions",
      label: "عملیات",
      render: (r: CouponRecord) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEdit(r)}
            className="p-1.5 rounded-md text-gray-500 hover:text-[var(--brand)] hover:bg-gray-100"
          >
            <RiEditLine />
          </button>
          <button
            onClick={() => setDeleteTarget(r)}
            className="p-1.5 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50"
          >
            <RiDeleteBinLine />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="کوپن‌های تخفیف"
        description="مدیریت کدهای تخفیف"
        onAdd={() => setCreateOpen(true)}
        addLabel="کوپن جدید"
      />

      <DataTable
        columns={columns as Parameters<typeof DataTable>[0]["columns"]}
        data={items}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Create Modal */}
      <FormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="کوپن جدید"
        onSubmit={handleCreate}
        isPending={createMut.isPending}
      >
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">کد <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={createForm.code}
            onChange={(e) => setCreateForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
            required
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
            dir="ltr"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">نوع تخفیف</label>
            <select
              value={createForm.discountType}
              onChange={(e) =>
                setCreateForm((f) => ({
                  ...f,
                  discountType: e.target.value as typeof f.discountType,
                }))
              }
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
            >
              <option value="percentage">درصدی</option>
              <option value="fixed">ثابت</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">مقدار <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={createForm.discountValue}
              onChange={(e) => setCreateForm((f) => ({ ...f, discountValue: e.target.value }))}
              required
              min={1}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
              dir="ltr"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">ارز</label>
            <select
              value={createForm.currency}
              onChange={(e) =>
                setCreateForm((f) => ({
                  ...f,
                  currency: e.target.value as typeof f.currency,
                }))
              }
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="IRR">IRR</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">حداکثر استفاده</label>
            <input
              type="number"
              value={createForm.maxUses}
              onChange={(e) => setCreateForm((f) => ({ ...f, maxUses: e.target.value }))}
              placeholder="نامحدود"
              min={1}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
              dir="ltr"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">تاریخ انقضا</label>
          <input
            type="date"
            value={createForm.expiresAt}
            onChange={(e) => setCreateForm((f) => ({ ...f, expiresAt: e.target.value }))}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
            dir="ltr"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={createForm.isActive}
            onChange={(e) => setCreateForm((f) => ({ ...f, isActive: e.target.checked }))}
            className="rounded"
          />
          فعال باشد
        </label>
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={`ویرایش کوپن: ${editTarget?.code ?? ""}`}
        onSubmit={handleEdit}
        isPending={updateMut.isPending}
      >
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">حداکثر استفاده</label>
          <input
            type="number"
            value={editForm.maxUses}
            onChange={(e) => setEditForm((f) => ({ ...f, maxUses: e.target.value }))}
            placeholder="نامحدود"
            min={1}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
            dir="ltr"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">تاریخ انقضا</label>
          <input
            type="date"
            value={editForm.expiresAt}
            onChange={(e) => setEditForm((f) => ({ ...f, expiresAt: e.target.value }))}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
            dir="ltr"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={editForm.isActive}
            onChange={(e) => setEditForm((f) => ({ ...f, isActive: e.target.checked }))}
            className="rounded"
          />
          فعال باشد
        </label>
      </FormModal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteMut.mutateAsync(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        isPending={deleteMut.isPending}
        title="حذف کوپن"
        description={`آیا از حذف کوپن "${deleteTarget?.code}" مطمئن هستید؟`}
      />
    </div>
  );
}

