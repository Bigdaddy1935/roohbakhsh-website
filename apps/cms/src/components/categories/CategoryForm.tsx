"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Localized } from "@roohbakhsh/shared";
import { useCategories } from "@/hooks/queries/use-categories";
import LocalizedInput from "@/components/ui/LocalizedInput";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import { RiArrowRightLine, RiSaveLine } from "react-icons/ri";

export interface CategoryFormValues {
  name: Localized;
  slug: string;
  parentId: string;
  order: number;
}

interface Props {
  title: string;
  initialValues: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  isPending: boolean;
  editingId?: string;
}

export default function CategoryForm({ title, initialValues, onSubmit, isPending, editingId }: Props) {
  const router = useRouter();
  const { data: categories } = useCategories();
  const [form, setForm] = useState<CategoryFormValues>(initialValues);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  const set = <K extends keyof CategoryFormValues>(key: K, val: CategoryFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const parentOptions = [
    { value: "", label: "بدون والد" },
    ...(categories ?? [])
      .filter((c) => c.id !== editingId)
      .map((c) => ({ value: c.id, label: c.name.ar })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6 bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div className="flex items-center gap-x-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/categories")}
            className="p-2 rounded-[20px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RiArrowRightLine size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-400">اطلاعات دسته‌بندی را وارد کنید</p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-x-2 px-5 py-2.5 bg-[var(--brand)] text-white text-sm font-bold rounded-[20px] hover:bg-[var(--brand)]/90 disabled:opacity-60 transition-colors"
        >
          <RiSaveLine size={16} />
          {isPending ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">اطلاعات پایه</h2>
            <LocalizedInput label="نام" value={form.name} onChange={(v) => set("name", v)} required />
            <FormField label="نامک (Slug)" value={form.slug} onChange={(e) => set("slug", e.target.value)} required dir="ltr" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">تنظیمات</h2>
            <SelectField label="دسته والد" value={form.parentId} onChange={(v) => set("parentId", v)} options={parentOptions} placeholder="بدون والد" />
            <FormField label="ترتیب" type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))} dir="ltr" />
          </div>
        </div>
      </div>
    </form>
  );
}
