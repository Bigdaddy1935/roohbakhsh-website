"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@roohbakhsh/shared";
import { useCategories, useDeleteCategory } from "@/hooks/queries/use-categories";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";

export default function CategoriesPage() {
  const router = useRouter();
  const { data, isLoading } = useCategories();
  const deleteMut = useDeleteCategory();
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const items = data ?? [];

  const columns = [
    { key: "nameAr", label: "نام (عربی)", render: (r: Category) => r.name.ar },
    { key: "nameUr", label: "نام (اردو)", render: (r: Category) => r.name.ur },
    { key: "order", label: "ترتیب", render: (r: Category) => r.order ?? 0 },
    { key: "parentId", label: "والد", render: (r: Category) => r.parentId ? (items.find((c) => c.id === r.parentId)?.name.ar ?? "-") : "-" },
    {
      key: "actions", label: "عملیات",
      render: (r: Category) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/categories/${r.id}/edit`} className="p-2 rounded-md text-gray-500 hover:text-[var(--brand)] hover:bg-gray-100 transition-colors">
            <RiEditLine size={19} />
          </Link>
          <button onClick={() => setDeleteTarget(r)} className="p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
            <RiDeleteBinLine size={19} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="دسته‌بندی‌ها" description="مدیریت دسته‌بندی دوره‌ها" onAdd={() => router.push("/dashboard/categories/new")} addLabel="دسته جدید" />
      <DataTable columns={columns} data={items} isLoading={isLoading} page={1} totalPages={1} onPageChange={() => {}} />
      <ConfirmModal
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) { await deleteMut.mutateAsync(deleteTarget.id); setDeleteTarget(null); } }}
        isPending={deleteMut.isPending} title="حذف دسته‌بندی" description={`آیا از حذف "${deleteTarget?.name.ar}" مطمئن هستید؟`}
      />
    </div>
  );
}
