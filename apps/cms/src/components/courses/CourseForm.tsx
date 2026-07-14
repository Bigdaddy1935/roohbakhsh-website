"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Localized } from "@roohbakhsh/shared";
import { useInstructors } from "@/hooks/queries/use-instructors";
import { useCategories } from "@/hooks/queries/use-categories";
import LocalizedInput from "@/components/ui/LocalizedInput";
import FormField from "@/components/ui/FormField";
import TextEditor from "@/components/ui/TextEditor";
import DateField from "@/components/ui/DateField";
import SwitchField from "@/components/ui/SwitchField";
import SelectField from "@/components/ui/SelectField";
import GalleryImageField from "@/components/ui/GalleryImageField";
import { RiArrowRightLine, RiSaveLine } from "react-icons/ri";

export interface CourseFormValues {
  title: Localized;
  slug: string;
  description: Localized;
  thumbnailAr: string;
  thumbnailUr: string;
  introVideoAr: string;
  introVideoUr: string;
  level: "beginner" | "intermediate" | "advanced";
  runStatus: "ongoing" | "upcoming" | "completed";
  accessType: "online_only" | "downloadable";
  instructorId: string;
  categoryId: string;
  priceAmountMinor: string;
  priceCurrency: "USD" | "EUR" | "IRR";
  discountPriceAmountMinor: string;
  discountExpiresAt: string;
  isPublished: boolean;
}

interface Props {
  title: string;
  initialValues: CourseFormValues;
  onSubmit: (values: CourseFormValues) => Promise<void>;
  isPending: boolean;
}

export default function CourseForm({ title, initialValues, onSubmit, isPending }: Props) {
  const router = useRouter();
  const { data: instructors } = useInstructors();
  const { data: categories } = useCategories();
  const [form, setForm] = useState<CourseFormValues>(initialValues);
  const [locale, setLocale] = useState<"ar" | "ur">("ar");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  const set = <K extends keyof CourseFormValues>(key: K, val: CourseFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const thumbnail = locale === "ar" ? form.thumbnailAr : form.thumbnailUr;
  const introVideo = locale === "ar" ? form.introVideoAr : form.introVideoUr;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6 bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div className="flex items-center gap-x-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/courses")}
            className="p-2 rounded-[20px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RiArrowRightLine size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-400">اطلاعات دوره را وارد کنید</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* تب زبان */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            {(["ar", "ur"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  locale === l
                    ? "bg-white text-[var(--brand)] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {l === "ar" ? "عربی" : "اردو"}
              </button>
            ))}
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
            <LocalizedInput label="عنوان" value={form.title} onChange={(v) => set("title", v)} locale={locale} required />
            <FormField label="نامک (Slug)" value={form.slug} onChange={(e) => set("slug", e.target.value)} required dir="ltr" />
            <TextEditor
              label=""
              value={locale === "ar" ? form.description.ar : form.description.ur}
              onChange={(v) =>
                set("description", {
                  ...form.description,
                  [locale]: v,
                })
              }
            />
          </div>

          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">
              رسانه — {locale === "ar" ? "عربی" : "اردو"}
            </h2>
            <GalleryImageField
              label=""
              value={thumbnail}
              onChange={(url) =>
                locale === "ar" ? set("thumbnailAr", url) : set("thumbnailUr", url)
              }
              category="courses"
            />
            <FormField
              label="ویدیوی معرفی"
              value={introVideo}
              onChange={(e) =>
                locale === "ar"
                  ? set("introVideoAr", e.target.value)
                  : set("introVideoUr", e.target.value)
              }
              dir="ltr"
            />
          </div>

          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">قیمت‌گذاری</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="قیمت (واحد کوچک)" type="number" value={form.priceAmountMinor} onChange={(e) => set("priceAmountMinor", e.target.value)} dir="ltr" />
              <SelectField
                label="ارز"
                value={form.priceCurrency}
                onChange={(v) => set("priceCurrency", v as CourseFormValues["priceCurrency"])}
                options={[
                  { value: "USD", label: "USD" },
                  { value: "EUR", label: "EUR" },
                  { value: "IRR", label: "IRR" },
                ]}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="قیمت تخفیف‌خورده (واحد کوچک)" type="number" value={form.discountPriceAmountMinor} onChange={(e) => set("discountPriceAmountMinor", e.target.value)} dir="ltr" />
              <DateField label="انقضای تخفیف" value={form.discountExpiresAt} onChange={(v) => set("discountExpiresAt", v)} />
            </div>
          </div>
        </div>

        {/* ── ستون کناری ── */}
        <div className="space-y-5">
          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">انتشار</h2>
            <SwitchField label="منتشر شود" checked={form.isPublished} onChange={(v) => set("isPublished", v)} />
          </div>

          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">دسته‌بندی</h2>
            <SelectField
              label="استاد"
              value={form.instructorId}
              onChange={(v) => set("instructorId", v)}
              options={instructors?.map((i) => ({ value: i.id, label: i.name.ar })) ?? []}
              required
              placeholder="انتخاب استاد"
            />
            <SelectField
              label="دسته‌بندی"
              value={form.categoryId}
              onChange={(v) => set("categoryId", v)}
              options={[
                { value: "", label: "بدون دسته" },
                ...(categories?.map((c) => ({ value: c.id, label: c.name.ar })) ?? []),
              ]}
            />
          </div>

          <div className="bg-white rounded-[20px] p-6 space-y-5">
            <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">تنظیمات</h2>
            <SelectField
              label="سطح"
              value={form.level}
              onChange={(v) => set("level", v as CourseFormValues["level"])}
              options={[
                { value: "beginner", label: "مبتدی" },
                { value: "intermediate", label: "متوسط" },
                { value: "advanced", label: "پیشرفته" },
              ]}
              required
            />
            <SelectField
              label="وضعیت برگزاری"
              value={form.runStatus}
              onChange={(v) => set("runStatus", v as CourseFormValues["runStatus"])}
              options={[
                { value: "ongoing", label: "در حال برگزاری" },
                { value: "upcoming", label: "به‌زودی" },
                { value: "completed", label: "پایان‌یافته" },
              ]}
              required
            />
            <SelectField
              label="نحوه دسترسی"
              value={form.accessType}
              onChange={(v) => set("accessType", v as CourseFormValues["accessType"])}
              options={[
                { value: "online_only", label: "فقط آنلاین" },
                { value: "downloadable", label: "قابل دانلود" },
              ]}
              required
            />
          </div>
        </div>
      </div>
    </form>
  );
}
