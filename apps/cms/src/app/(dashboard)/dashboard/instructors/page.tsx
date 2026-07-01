"use client";

import { useState, type FormEvent } from "react";
import type { InstructorDetail, Localized } from "@roohbakhsh/shared";
import {
  useInstructors,
  useCreateInstructor,
  useUpdateInstructor,
  useDeleteInstructor,
} from "@/hooks/queries/use-instructors";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import FormModal from "@/components/ui/FormModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import LocalizedInput from "@/components/ui/LocalizedInput";
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri";

const emptyForm = {
  name: { ar: "", ur: "" } as Localized,
  slug: "",
  avatarUrl: "",
  bio: { ar: "", ur: "" } as Localized,
};

export default function InstructorsPage() {
  const { data, isLoading } = useInstructors();
  const createMut = useCreateInstructor();
  const deleteMut = useDeleteInstructor();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InstructorDetail | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<InstructorDetail | null>(null);

  const updateMut = useUpdateInstructor(editing?.id ?? "");

  const items = data ?? [];

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEdit(item: InstructorDetail) {
    setEditing(item);
    setForm({
      name: { ar: item.name.ar, ur: item.name.ur },
      slug: item.slug,
      avatarUrl: item.avatarUrl ?? "",
      bio: { ar: item.bio?.ar ?? "", ur: item.bio?.ur ?? "" },
    });
    setFormOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      slug: form.slug,
      avatarUrl: form.avatarUrl || undefined,
      bio: form.bio,
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
    { key: "name", label: "نام (عربی)", render: (r: InstructorDetail) => r.name.ar },
    { key: "slug", label: "slug" },
    {
      key: "actions",
      label: "عملیات",
      render: (r: InstructorDetail) => (
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
        title="اساتید"
        description="مدیریت اساتید"
        onAdd={openCreate}
        addLabel="استاد جدید"
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
        title={editing ? "ویرایش استاد" : "استاد جدید"}
        onSubmit={handleSubmit}
        isPending={isPending}
      >
        <LocalizedInput
          label="نام"
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
          <label className="text-sm font-medium text-gray-600">آدرس تصویر</label>
          <input
            type="text"
            value={form.avatarUrl}
            onChange={(e) => setForm((f) => ({ ...f, avatarUrl: e.target.value }))}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--brand)]"
            dir="ltr"
          />
        </div>
        <LocalizedInput
          label="بیوگرافی"
          value={form.bio}
          onChange={(v) => setForm((f) => ({ ...f, bio: v }))}
          multiline
        />
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
        title="حذف استاد"
        description={`آیا از حذف "${deleteTarget?.name.ar}" مطمئن هستید؟`}
      />
    </div>
  );
}


