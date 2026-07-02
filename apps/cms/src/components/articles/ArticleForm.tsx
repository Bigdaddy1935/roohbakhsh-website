"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import type { Localized } from "@roohbakhsh/shared";
import { useInstructors } from "@/hooks/queries/use-instructors";
import LocalizedInput from "@/components/ui/LocalizedInput";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import TextEditor from "@/components/ui/TextEditor";
import { RiArrowRightLine } from "react-icons/ri";

export interface ArticleFormValues {
  title: Localized;
  slug: string;
  summary: Localized;
  bodyAr: string;
  bodyUr: string;
  instructorId: string;
  status: "draft" | "published";
}

interface ArticleFormProps {
  title: string;
  initialValues: ArticleFormValues;
  onSubmit: (values: ArticleFormValues) => Promise<void>;
  isPending: boolean;
}

export default function ArticleForm({ title, initialValues, onSubmit, isPending }: ArticleFormProps) {
  const router = useRouter();
  const { data: instructors } = useInstructors();
  const [form, setForm] = useState<ArticleFormValues>(initialValues);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  return (
    <div>
      <Script src="/tinymce/tinymce/tinymce.min.js" strategy="afterInteractive" />

      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => router.push("/dashboard/articles")}
          className="p-2 rounded-md text-gray-500 hover:text-[var(--brand)] hover:bg-gray-100 transition-colors"
        >
          <RiArrowRightLine size={18} />
        </button>
        <h1 className="text-xl font-extrabold text-[var(--ink)]">{title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-5xl">
        <LocalizedInput label="عنوان" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} required />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required dir="ltr" />
          <SelectField
            label="نویسنده"
            value={form.instructorId}
            onChange={(v) => setForm((f) => ({ ...f, instructorId: v }))}
            options={[
              { value: "", label: "انتخاب کنید" },
              ...(instructors?.map((i) => ({ value: i.id, label: i.name.ar })) ?? []),
            ]}
            placeholder="انتخاب کنید"
          />
        </div>

        <LocalizedInput label="خلاصه" value={form.summary} onChange={(v) => setForm((f) => ({ ...f, summary: v }))} multiline />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="وضعیت"
            value={form.status}
            onChange={(v) => setForm((f) => ({ ...f, status: v as ArticleFormValues["status"] }))}
            options={[
              { value: "draft", label: "پیش‌نویس" },
              { value: "published", label: "منتشرشده" },
            ]}
            required
          />
        </div>

        <TextEditor
          label="متن مقاله — عربی"
          value={form.bodyAr}
          onChange={(v) => setForm((f) => ({ ...f, bodyAr: v }))}
        />
        <TextEditor
          label="متن مقاله — اردو"
          value={form.bodyUr}
          onChange={(v) => setForm((f) => ({ ...f, bodyUr: v }))}
        />

        <div className="flex gap-3 pt-4 pb-8">
          <button
            type="button"
            onClick={() => router.push("/dashboard/articles")}
            disabled={isPending}
            className="w-40 py-2.5 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="w-40 py-2.5 text-sm rounded-md bg-[var(--brand)] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isPending ? "در حال ذخیره..." : "ذخیره"}
          </button>
        </div>
      </form>
    </div>
  );
}
