"use client";

import { useState, type FormEvent } from "react";
import type { Category, Localized } from "@roohbakhsh/shared";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/queries/use-categories";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import FormModal from "@/components/ui/FormModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import LocalizedInput from "@/components/ui/LocalizedInput";
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri";

const emptyForm = {
  name: { ar: "", ur: "" } as Localized,
  slug: "",
  parentId: "",
  order: 0,
};

export default function CategoriesPage() {
  const { data, isLoading } = useCategories();
  const createMut = useCreateCategory();
  const deleteMut = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const updateMut = useUpdateCategory(editing?.id ?? "");

  const items = data ?? [];

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(item: Category) {
    setEditing(item);
    setForm({
      name: { ar: item.name.ar, ur: item.name.ur },
      slug: item.slug,
      parentId: item.parentId ?? "",
      order: item.order ?? 0,
    });
    setFormOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug,
      parentId: form.parentId || undefined,
      order: form.order,
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
    { key: "name", label: "Ù†Ø§Ù… (Ø¹Ø±Ø¨ÛŒ)", render: (r: Category) => r.name.ar },
    { key: "slug", label: "slug" },
    {
      key: "parentId",
      label: "ÙˆØ§Ù„Ø¯",
      render: (r: Category) => {
        if (!r.parentId) return "-";
        const parent = items.find((c) => c.id === r.parentId);
        return parent?.name.ar ?? r.parentId;
      },
    },
    {
      key: "courseCount",
      label: "ØªØ¹Ø¯Ø§Ø¯ Ø¯ÙˆØ±Ù‡",
      render: (r: Category) => (r as Category & { courseCount?: number }).courseCount ?? "-",
    },
    {
      key: "actions",
      label: "Ø¹Ù…Ù„ÛŒØ§Øª",
      render: (r: Category) => (
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
        title="Ø¯Ø³ØªÙ‡â€ŒØ¨Ù†Ø¯ÛŒâ€ŒÙ‡Ø§"
        description="Ù…Ø¯ÛŒØ±ÛŒØª Ø¯Ø³ØªÙ‡â€ŒØ¨Ù†Ø¯ÛŒ Ø¯ÙˆØ±Ù‡â€ŒÙ‡Ø§"
        onAdd={openCreate}
        addLabel="Ø¯Ø³ØªÙ‡ Ø¬Ø¯ÛŒØ¯"
      />

      <DataTable
        columns={columns as Parameters<typeof DataTable>[0]["columns"]}
        data={items}
        isLoading={isLoading}
        page={1}
        totalPages={1}
        onPageChange={() => {}}
      />

      <FormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? "ÙˆÛŒØ±Ø§ÛŒØ´ Ø¯Ø³ØªÙ‡â€ŒØ¨Ù†Ø¯ÛŒ" : "Ø¯Ø³ØªÙ‡â€ŒØ¨Ù†Ø¯ÛŒ Ø¬Ø¯ÛŒØ¯"}
        onSubmit={handleSubmit}
        isPending={isPending}
      >
        <LocalizedInput
          label="Ù†Ø§Ù…"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
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
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Ø¯Ø³ØªÙ‡ ÙˆØ§Ù„Ø¯</label>
          <select
            value={form.parentId}
            onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
          >
            <option value="">Ø¨Ø¯ÙˆÙ† ÙˆØ§Ù„Ø¯</option>
            {items
              .filter((c) => c.id !== editing?.id)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.ar}
                </option>
              ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">ØªØ±ØªÛŒØ¨</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
            dir="ltr"
          />
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
        title="Ø­Ø°Ù Ø¯Ø³ØªÙ‡â€ŒØ¨Ù†Ø¯ÛŒ"
        description={`Ø¢ÛŒØ§ Ø§Ø² Ø­Ø°Ù "${deleteTarget?.name.ar}" Ù…Ø·Ù…Ø¦Ù† Ù‡Ø³ØªÛŒØ¯ØŸ`}
      />
    </div>
  );
}

