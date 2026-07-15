"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import DateField from "@/components/ui/DateField";
import SwitchField from "@/components/ui/SwitchField";
import { RiArrowRightLine, RiSaveLine } from "react-icons/ri";

export interface CouponCreateValues {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  currency: "USD" | "EUR" | "IRR";
  maxUses: string;
  expiresAt: string;
  isActive: boolean;
}

interface Props {
  initialValues: CouponCreateValues;
  onSubmit: (values: CouponCreateValues) => Promise<void>;
  isPending: boolean;
}

export default function CouponCreateForm({ initialValues, onSubmit, isPending }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CouponCreateValues>(initialValues);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  const set = <K extends keyof CouponCreateValues>(key: K, val: CouponCreateValues[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6 bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div className="flex items-center gap-x-3">
          <button type="button" onClick={() => router.push("/dashboard/coupons")} className="p-2 rounded-[20px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <RiArrowRightLine size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">کوپن جدید</h1>
            <p className="text-sm text-gray-400">اطلاعات کوپن تخفیف را وارد کنید</p>
          </div>
        </div>
        <button type="submit" disabled={isPending} className="flex items-center gap-x-2 px-5 py-2.5 bg-[var(--brand)] text-white text-sm font-bold rounded-[20px] hover:bg-[var(--brand)]/90 disabled:opacity-60 transition-colors">
          <RiSaveLine size={16} />
          {isPending ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">اطلاعات کوپن</h2>
            <FormField label="کد کوپن" value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} required dir="ltr" />
            <SelectField label="نوع تخفیف" value={form.discountType} onChange={(v) => set("discountType", v as CouponCreateValues["discountType"])}
              options={[{ value: "percentage", label: "درصدی" }, { value: "fixed", label: "ثابت" }]} required />
            <FormField label="مقدار" type="number" value={form.discountValue} onChange={(e) => set("discountValue", e.target.value)} required dir="ltr" />
            <SelectField label="ارز" value={form.currency} onChange={(v) => set("currency", v as CouponCreateValues["currency"])}
              options={[{ value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "IRR", label: "IRR" }]} required />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">محدودیت‌ها</h2>
            <FormField label="حداکثر استفاده" type="number" value={form.maxUses} onChange={(e) => set("maxUses", e.target.value)} dir="ltr" />
            <DateField label="تاریخ انقضا" value={form.expiresAt} onChange={(v) => set("expiresAt", v)} />
            <SwitchField label="فعال باشد" checked={form.isActive} onChange={(v) => set("isActive", v)} />
          </div>
        </div>
      </div>
    </form>
  );
}
