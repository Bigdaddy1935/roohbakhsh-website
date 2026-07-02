"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ArticleRecord } from "@roohbakhsh/shared";
import { useArticlesAdmin, useDeleteArticle } from "@/hooks/queries/use-articles";
import { useInstructors } from "@/hooks/queries/use-instructors";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import StatusBadge from "@/components/ui/StatusBadge";
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri";

const STATUS_MAP = {
  draft: { label: "پیش‌نویس", color: "bg-gray-100 text-gray-500" },
  published: { label: "منتشرشده", color: "bg-green-50 text-green-700" },
};

export default function ArticlesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useArticlesAdmin({ page, limit: 10 });
  const { data: instructors } = useInstructors();
  const deleteMut = useDeleteArticle();
  const [deleteTarget, setDeleteTarget] = useState<ArticleRecord | null>(null);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    { key: "title", label: "عنوان (عربی)", render: (r: ArticleRecord) => r.title.ar },
    { key: "slug", label: "Slug" },
    { key: "instructor", label: "نویسنده", render: (r: ArticleRecord) => instructors?.find((i) => i.id === r.instructorId)?.name.ar ?? "-" },
    { key: "status", label: "وضعیت", render: (r: ArticleRecord) => <StatusBadge status={r.status ?? "draft"} map={STATUS_MAP} /> },
    {
      key: "actions", label: "عملیات",
      render: (r: ArticleRecord) => (
        <div className="flex gap-2">
          <button onClick={() => router.push(`/dashboard/articles/${r.id}/edit`)} className="p-1.5 rounded-md text-gray-500 hover:text-[var(--brand)] hover:bg-gray-100 transition-colors"><RiEditLine size={16} /></button>
          <button onClick={() => setDeleteTarget(r)} className="p-1.5 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"><RiDeleteBinLine size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="مقالات"
        description="مدیریت مقالات وبلاگ"
        onAdd={() => router.push("/dashboard/articles/new")}
        addLabel="مقاله جدید"
      />
      <DataTable columns={columns} data={items} isLoading={isLoading} page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmModal
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) { await deleteMut.mutateAsync(deleteTarget.id); setDeleteTarget(null); } }}
        isPending={deleteMut.isPending} title="حذف مقاله" description={`آیا از حذف "${deleteTarget?.title.ar}" مطمئن هستید؟`}
      />
    </div>
  );
}
