"use client";

import { useState, type FormEvent } from "react";
import type { CourseRecord, Localized } from "@roohbakhsh/shared";
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from "@/hooks/queries/use-courses";
import { useInstructors } from "@/hooks/queries/use-instructors";
import { useCategories } from "@/hooks/queries/use-categories";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import FormModal from "@/components/ui/FormModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import LocalizedInput from "@/components/ui/LocalizedInput";
import FormField from "@/components/ui/FormField";
import SelectField from "@/components/ui/SelectField";
import StatusBadge from "@/components/ui/StatusBadge";
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri";

const LEVEL_MAP = {
  beginner: { label: "مبتدی", color: "bg-green-50 text-green-700" },
  intermediate: { label: "متوسط", color: "bg-yellow-50 text-yellow-700" },
  advanced: { label: "پیشرفته", color: "bg-red-50 text-red-700" },
};
const PUBLISHED_MAP = {
  true: { label: "منتشرشده", color: "bg-green-50 text-green-700" },
  false: { label: "پیش‌نویس", color: "bg-gray-100 text-gray-500" },
};

const emptyForm = {
  title: { ar: "", ur: "" } as Localized,
  slug: "",
  description: { ar: "", ur: "" } as Localized,
  level: "beginner" as "beginner" | "intermediate" | "advanced",
  instructorId: "",
  categoryId: "",
  priceAmountMinor: "",
  priceCurrency: "USD" as "USD" | "EUR" | "IRR",
  isPublished: false,
};

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useCourses({ page, limit: 10 });
  const { data: instructors } = useInstructors();
  const { data: categories } = useCategories();
  const createMut = useCreateCourse();
  const deleteMut = useDeleteCourse();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CourseRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<CourseRecord | null>(null);

  const updateMut = useUpdateCourse(editing?.id ?? "");
  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  function openCreate() { setEditing(null); setForm(emptyForm); setFormOpen(true); }

  function openEdit(item: CourseRecord) {
    setEditing(item);
    setForm({
      title: { ar: item.title.ar, ur: item.title.ur },
      slug: item.slug,
      description: { ar: item.description.ar, ur: item.description.ur },
      level: item.level,
      instructorId: item.instructorId ?? "",
      categoryId: item.categoryId ?? "",
      priceAmountMinor: item.price?.amountMinor != null ? String(item.price.amountMinor) : "",
      priceCurrency: (item.price?.currency ?? "USD") as "USD" | "EUR" | "IRR",
      isPublished: item.isPublished,
    });
    setFormOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      title: form.title, slug: form.slug, description: form.description, level: form.level,
      instructorId: form.instructorId, categoryId: form.categoryId || undefined,
      price: form.priceAmountMinor ? { amountMinor: Number(form.priceAmountMinor), currency: form.priceCurrency } : undefined,
      isPublished: form.isPublished,
    };
    if (editing) await updateMut.mutateAsync(payload);
    else await createMut.mutateAsync(payload);
    setFormOpen(false);
  }

  const isPending = createMut.isPending || updateMut.isPending;

  const columns = [
    { key: "title", label: "عنوان (عربی)", render: (r: CourseRecord) => r.title.ar },
    { key: "slug", label: "Slug" },
    { key: "level", label: "سطح", render: (r: CourseRecord) => <StatusBadge status={r.level} map={LEVEL_MAP} /> },
    { key: "instructor", label: "استاد", render: (r: CourseRecord) => instructors?.find((i) => i.id === r.instructorId)?.name.ar ?? "-" },
    { key: "isPublished", label: "وضعیت", render: (r: CourseRecord) => <StatusBadge status={String(r.isPublished)} map={PUBLISHED_MAP} /> },
    {
      key: "actions", label: "عملیات",
      render: (r: CourseRecord) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(r)} className="p-1.5 rounded-md text-gray-500 hover:text-[var(--brand)] hover:bg-gray-100 transition-colors"><RiEditLine size={16} /></button>
          <button onClick={() => setDeleteTarget(r)} className="p-1.5 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"><RiDeleteBinLine size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="دوره‌ها" description="مدیریت دوره‌های آموزشی" onAdd={openCreate} addLabel="دوره جدید" />
      <DataTable columns={columns} data={items} isLoading={isLoading} page={page} totalPages={totalPages} onPageChange={setPage} />

      <FormModal isOpen={formOpen} onClose={() => setFormOpen(false)} title={editing ? "ویرایش دوره" : "دوره جدید"} onSubmit={handleSubmit} isPending={isPending}>
        <LocalizedInput label="عنوان" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} required />
        <FormField label="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required dir="ltr" />
        <LocalizedInput label="توضیحات" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} multiline />
        <SelectField
          label="سطح"
          value={form.level}
          onChange={(v) => setForm((f) => ({ ...f, level: v as typeof form.level }))}
          options={[
            { value: "beginner", label: "مبتدی" },
            { value: "intermediate", label: "متوسط" },
            { value: "advanced", label: "پیشرفته" },
          ]}
          required
        />
        <SelectField
          label="استاد"
          value={form.instructorId}
          onChange={(v) => setForm((f) => ({ ...f, instructorId: v }))}
          options={instructors?.map((i) => ({ value: i.id, label: i.name.ar })) ?? []}
          required
          placeholder="انتخاب استاد"
        />
        <SelectField
          label="دسته‌بندی"
          value={form.categoryId}
          onChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
          options={[
            { value: "", label: "بدون دسته" },
            ...(categories?.map((c) => ({ value: c.id, label: c.name.ar })) ?? []),
          ]}
          placeholder="بدون دسته"
        />
        <FormField label="قیمت (واحد کوچک)" type="number" value={form.priceAmountMinor} onChange={(e) => setForm((f) => ({ ...f, priceAmountMinor: e.target.value }))} dir="ltr" />
        <SelectField
          label="ارز"
          value={form.priceCurrency}
          onChange={(v) => setForm((f) => ({ ...f, priceCurrency: v as typeof form.priceCurrency }))}
          options={[
            { value: "USD", label: "USD" },
            { value: "EUR", label: "EUR" },
            { value: "IRR", label: "IRR" },
          ]}
          required
        />
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
            className="w-4 h-4 accent-[var(--brand)] rounded"
          />
          منتشر شود
        </label>
      </FormModal>

      <ConfirmModal
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) { await deleteMut.mutateAsync(deleteTarget.id); setDeleteTarget(null); } }}
        isPending={deleteMut.isPending} title="حذف دوره" description={`آیا از حذف "${deleteTarget?.title.ar}" مطمئن هستید؟`}
      />
    </div>
  );
}
