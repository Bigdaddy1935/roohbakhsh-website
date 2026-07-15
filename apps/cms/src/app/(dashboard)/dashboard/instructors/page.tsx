"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { InstructorRecord } from "@roohbakhsh/shared";
import { useInstructors, useDeleteInstructor } from "@/hooks/queries/use-instructors";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri";
import Link from "next/link";

export default function InstructorsPage() {
  const router = useRouter();
  const { data, isLoading } = useInstructors();
  const deleteMut = useDeleteInstructor();
  const [deleteTarget, setDeleteTarget] = useState<InstructorRecord | null>(null);

  const items = data ?? [];

  const columns = [
    { key: "name", label: "نام (عربی)", render: (r: InstructorRecord) => r.name.ar },
    { key: "slug", label: "Slug" },
    {
      key: "staffType",
      label: "نوع",
      render: (r: InstructorRecord) =>
        r.staffType === "author" ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">نویسنده</span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700">استاد</span>
        ),
    },
    {
      key: "actions",
      label: "عملیات",
      render: (r: InstructorRecord) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/instructors/${r.id}/edit`} className="p-2 rounded-md text-gray-500 hover:text-[var(--brand)] hover:bg-gray-100 transition-colors">
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
      <PageHeader
        title="کارمندان"
        description="مدیریت اساتید و نویسندگان"
        onAdd={() => router.push("/dashboard/instructors/new")}
        addLabel="کارمند جدید"
      />
      <DataTable columns={columns} data={items} isLoading={isLoading} page={1} totalPages={1} onPageChange={() => {}} />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) { await deleteMut.mutateAsync(deleteTarget.id); setDeleteTarget(null); } }}
        isPending={deleteMut.isPending}
        title="حذف کارمند"
        description={`آیا از حذف "${deleteTarget?.name.ar}" مطمئن هستید؟`}
      />
    </div>
  );
}
