"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Localized } from "@roohbakhsh/shared";
import { useInstructors } from "@/hooks/queries/use-instructors";
import LocalizedInput from "@/components/ui/LocalizedInput";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import TextEditor from "@/components/ui/TextEditor";
import GalleryImageField from "@/components/ui/GalleryImageField";
import { RiArrowRightLine, RiSaveLine } from "react-icons/ri";

export interface ArticleFormValues {
  title: Localized;
  slug: string;
  summary: Localized;
  bodyAr: string;
  bodyUr: string;
  thumbnailAr: string;
  thumbnailUr: string;
  metaTitle: Localized;
  metaDescription: Localized;
  metaKeywords: Localized;
  robots: "index" | "noindex";
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
  const [locale, setLocale] = useState<"ar" | "ur">("ar");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  const set = <K extends keyof ArticleFormValues>(key: K, val: ArticleFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const tabCls = (l: "ar" | "ur") =>
    `px-5 py-1.5 text-sm rounded-full transition-colors font-medium ${
      locale === l
        ? "bg-white text-[var(--ink)] shadow-sm"
        : "text-gray-500 hover:text-gray-700"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6 bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div className="flex items-center gap-x-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/articles")}
            className="p-2 rounded-[20px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RiArrowRightLine size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-400">اطلاعات مقاله را وارد کنید</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* تب‌های زبان */}
          <div className="flex gap-1 bg-gray-100 rounded-full p-1">
            <button type="button" onClick={() => setLocale("ar")} className={tabCls("ar")}>
              عربی
            </button>
            <button type="button" onClick={() => setLocale("ur")} className={tabCls("ur")}>
              اردو
            </button>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── ستون اصلی ── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">اطلاعات پایه</h2>
            <LocalizedInput label="عنوان" value={form.title} onChange={(v) => set("title", v)} required locale={locale} />
            <FormField label="نامک (Slug)" value={form.slug} onChange={(e) => set("slug", e.target.value)} required dir="ltr" />
            <LocalizedInput label="خلاصه" value={form.summary} onChange={(v) => set("summary", v)} multiline locale={locale} />
          </div>

          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">
              متن مقاله — {locale === "ar" ? "عربی" : "اردو"}
            </h2>
            {locale === "ar" ? (
              <TextEditor label="" value={form.bodyAr} onChange={(v) => set("bodyAr", v)} />
            ) : (
              <TextEditor label="" value={form.bodyUr} onChange={(v) => set("bodyUr", v)} />
            )}
          </div>

          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">سئو (SEO)</h2>
            <LocalizedInput label="عنوان متا" value={form.metaTitle} onChange={(v) => set("metaTitle", v)} locale={locale} />
            <LocalizedInput label="توضیحات متا" value={form.metaDescription} onChange={(v) => set("metaDescription", v)} multiline locale={locale} />
            <FormField
              label="کلیدواژه‌ها (با کاما جدا کنید)"
              value={locale === "ar" ? form.metaKeywords.ar : form.metaKeywords.ur}
              onChange={(e) => set("metaKeywords", { ...form.metaKeywords, [locale]: e.target.value })}
              placeholder={locale === "ar" ? "مثال: فقه,اسلام,دوره آنلاین" : "مثال: فقہ,اسلام,آن لائن کورس"}
              dir="rtl"
            />
          </div>
        </div>

        {/* ── ستون کناری ── */}
        <div className="space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">انتشار</h2>
            <SelectField
              label="وضعیت"
              value={form.status}
              onChange={(v) => set("status", v as ArticleFormValues["status"])}
              options={[
                { value: "draft", label: "پیش‌نویس" },
                { value: "published", label: "منتشرشده" },
              ]}
              required
            />
            <SelectField
              label="ایندکس موتور جستجو"
              value={form.robots}
              onChange={(v) => set("robots", v as ArticleFormValues["robots"])}
              options={[
                { value: "index", label: "ایندکس شود (index)" },
                { value: "noindex", label: "ایندکس نشود (noindex)" },
              ]}
            />
          </div>

          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">
              تصویر کاور — {locale === "ar" ? "عربی" : "اردو"}
            </h2>
            {locale === "ar" ? (
              <GalleryImageField
                label=""
                value={form.thumbnailAr}
                onChange={(url) => set("thumbnailAr", url)}
                category="articles"
              />
            ) : (
              <GalleryImageField
                label=""
                value={form.thumbnailUr}
                onChange={(url) => set("thumbnailUr", url)}
                category="articles"
              />
            )}
          </div>

          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">نویسنده</h2>
            <SelectField
              label=""
              value={form.instructorId}
              onChange={(v) => set("instructorId", v)}
              options={[
                { value: "", label: "بدون نویسنده" },
                ...(instructors?.map((i) => ({ value: i.id, label: i.name.ar })) ?? []),
              ]}
              placeholder="انتخاب کنید"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
