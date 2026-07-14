"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Localized, StaffType } from "@roohbakhsh/shared";
import LocalizedInput from "@/components/ui/LocalizedInput";
import FormField from "@/components/ui/FormField";
import ImageUploadField from "@/components/ui/ImageUploadField";
import { RiArrowRightLine, RiSaveLine } from "react-icons/ri";

export interface InstructorFormValues {
  name: Localized;
  slug: string;
  avatarUrl: string;
  bio: Localized;
  staffType: StaffType;
}

interface Props {
  title: string;
  initialValues: InstructorFormValues;
  onSubmit: (values: InstructorFormValues) => Promise<void>;
  isPending: boolean;
}

export default function InstructorForm({ title, initialValues, onSubmit, isPending }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<InstructorFormValues>(initialValues);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  const set = <K extends keyof InstructorFormValues>(key: K, val: InstructorFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6 bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div className="flex items-center gap-x-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/instructors")}
            className="p-2 rounded-[20px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RiArrowRightLine size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-400">اطلاعات استاد را وارد کنید</p>
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
        {/* ── ستون اصلی ── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">اطلاعات پایه</h2>
            <LocalizedInput label="نام" value={form.name} onChange={(v) => set("name", v)} required />
            <FormField label="نامک (Slug)" value={form.slug} onChange={(e) => set("slug", e.target.value)} required dir="ltr" />
            <LocalizedInput label="بیوگرافی" value={form.bio} onChange={(v) => set("bio", v)} multiline />
          </div>
        </div>

        {/* ── ستون کناری ── */}
        <div className="space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">نوع کارمند</h2>
            <div className="flex gap-3">
              {(["instructor", "author"] as StaffType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => set("staffType", type)}
                  className={`flex-1 py-2.5 rounded-[12px] text-sm font-medium border transition-colors ${
                    form.staffType === type
                      ? type === "author"
                        ? "bg-purple-50 text-purple-700 border-purple-300"
                        : "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {type === "instructor" ? "استاد" : "نویسنده"}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">تصویر</h2>
            <ImageUploadField label="تصویر پروفایل" value={form.avatarUrl} onChange={(url) => set("avatarUrl", url)} />
          </div>
        </div>
      </div>
    </form>
  );
}
