"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/ui/FormField";
import DateField from "@/components/ui/DateField";
import SwitchField from "@/components/ui/SwitchField";
import { RiArrowRightLine, RiSaveLine } from "react-icons/ri";

export interface CouponEditValues {
  maxUses: string;
  expiresAt: string;
  isActive: boolean;
}

interface Props {
  couponCode: string;
  initialValues: CouponEditValues;
  onSubmit: (values: CouponEditValues) => Promise<void>;
  isPending: boolean;
}

export default function CouponEditForm({ couponCode, initialValues, onSubmit, isPending }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CouponEditValues>(initialValues);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  const set = <K extends keyof CouponEditValues>(key: K, val: CouponEditValues[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6 bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div className="flex items-center gap-x-3">
          <button type="button" onClick={() => router.push("/dashboard/coupons")} className="p-2 rounded-[20px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <RiArrowRightLine size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">ویرایش کوپن: {couponCode}</h1>
            <p className="text-sm text-gray-400">تنظیمات کوپن را ویرایش کنید</p>
          </div>
        </div>
        <button type="submit" disabled={isPending} className="flex items-center gap-x-2 px-5 py-2.5 bg-[var(--brand)] text-white text-sm font-bold rounded-[20px] hover:bg-[var(--brand)]/90 disabled:opacity-60 transition-colors">
          <RiSaveLine size={16} />
          {isPending ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>

      <div className="max-w-lg">
        <div className="bg-white rounded-[20px] p-6 space-y-5">
          <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">محدودیت‌ها</h2>
          <FormField label="حداکثر استفاده" type="number" value={form.maxUses} onChange={(e) => set("maxUses", e.target.value)} dir="ltr" />
          <DateField label="تاریخ انقضا" value={form.expiresAt} onChange={(v) => set("expiresAt", v)} />
          <SwitchField label="فعال باشد" checked={form.isActive} onChange={(v) => set("isActive", v)} />
        </div>
      </div>
    </form>
  );
}
