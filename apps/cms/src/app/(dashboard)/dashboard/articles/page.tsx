"use client";

import { useState, type FormEvent } from "react";
import type { ArticleRecord, Localized } from "@roohbakhsh/shared";
import {
  useArticlesAdmin,
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
} from "@/hooks/queries/use-articles";
import { useInstructors } from "@/hooks/queries/use-instructors";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import FormModal from "@/components/ui/FormModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import LocalizedInput from "@/components/ui/LocalizedInput";
import StatusBadge from "@/components/ui/StatusBadge";
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri";

const STATUS_MAP = {
  draft: { label: "پیش‌نویس", color: "bg-gray-100 text-gray-500" },
  published: { label: "منتشرشده", color: "bg-green-50 text-green-700" },
};

const emptyForm = {
  title: { ar: "", ur: "" } as Localized,
  slug: "",
  summary: { ar: "", ur: "" } as Localized,
  body: { ar: "", ur: "" } as Localized,
  instructorId: "",
  status: "draft" as "draft" | "published",
};

export default function ArticlesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useArticlesAdmin({ page, limit: 10 });
  const { data: instructors } = useInstructors();
  const createMut = useCreateArticle();
  const deleteMut = useDeleteArticle();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ArticleRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<ArticleRecord | null>(null);

  const updateMut = useUpdateArticle(editing?.id ?? "");

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(item: ArticleRecord) {
    setEditing(item);
    setForm({
      title: { ar: item.title.ar, ur: item.title.ur },
      slug: item.slug,
      summary: { ar: item.summary?.ar ?? "", ur: item.summary?.ur ?? "" },
      body: { ar: item.body?.ar ?? "", ur: item.body?.ur ?? "" },
      instructorId: item.instructorId ?? "",
      status: item.status as "draft" | "published",
    });
    setFormOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      body: form.body,
      instructorId: form.instructorId || "",
      status: form.status,
    };
    if (editing) {
      await updateMut.mutateAsync(payload);
    } else {
      await createMut.mutateAsync(payload);
    }
    setFormOpen(false);
  }

  const isPending = createMut.isPending || updateMut.isPending;

  const columns = [
    { key: "title", label: "عنوان (عربی)", render: (r: ArticleRecord) => r.title.ar },
    { key: "slug", label: "slug" },
    {
      key: "instructor",
      label: "نویسنده",
      render: (r: ArticleRecord) => {
        const inst = instructors?.find((i) => i.id === r.instructorId);
        return inst?.name.ar ?? "-";
      },
    },
    {
      key: "status",
      label: "وضعیت",
      render: (r: ArticleRecord) => <StatusBadge status={r.status ?? "draft"} map={STATUS_MAP} />,
    },
    {
      key: "actions",
      label: "عملیات",
      render: (r: ArticleRecord) => (
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
        title="مقالات"
        description="مدیریت مقالات وبلاگ"
        onAdd={openCreate}
        addLabel="مقاله جدید"
      />

      <DataTable
        columns={columns as Parameters<typeof DataTable>[0]["columns"]}
        data={items}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <FormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "ویرایش مقاله" : "مقاله جدید"}
        onSubmit={handleSubmit}
        isPending={isPending}
      >
        <LocalizedInput
          label="عنوان"
          value={form.title}
          onChange={(v) => setForm((f) => ({ ...f, title: v }))}
          required
        />
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            required
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
            dir="ltr"
          />
        </div>
        <LocalizedInput
          label="خلاصه"
          value={form.summary}
          onChange={(v) => setForm((f) => ({ ...f, summary: v }))}
          multiline
        />
        <LocalizedInput
          label="متن مقاله"
          value={form.body}
          onChange={(v) => setForm((f) => ({ ...f, body: v }))}
          multiline
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">نویسنده</label>
            <select
              value={form.instructorId}
              onChange={(e) => setForm((f) => ({ ...f, instructorId: e.target.value }))}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
            >
              <option value="">انتخاب کنید</option>
              {instructors?.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name.ar}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">وضعیت</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value as typeof form.status }))
              }
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
            >
              <option value="draft">پیش‌نویس</option>
              <option value="published">منتشرشده</option>
            </select>
          </div>
        </div>
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
        title="حذف مقاله"
        description={`آیا از حذف "${deleteTarget?.title.ar}" مطمئن هستید؟`}
      />
    </div>
  );
}

