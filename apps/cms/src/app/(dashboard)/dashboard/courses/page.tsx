"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CourseRecord } from "@roohbakhsh/shared";
import { useCourses, useDeleteCourse } from "@/hooks/queries/use-courses";
import { useInstructors } from "@/hooks/queries/use-instructors";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import StatusBadge from "@/components/ui/StatusBadge";
import Link from "next/link";
import { RiEditLine, RiDeleteBinLine, RiListCheck2 } from "react-icons/ri";

const LEVEL_MAP = {
  beginner: { label: "مبتدی", color: "bg-green-50 text-green-700" },
  intermediate: { label: "متوسط", color: "bg-yellow-50 text-yellow-700" },
  advanced: { label: "پیشرفته", color: "bg-red-50 text-red-700" },
};
const PUBLISHED_MAP = {
  true: { label: "منتشرشده", color: "bg-green-50 text-green-700" },
  false: { label: "پیش‌نویس", color: "bg-gray-100 text-gray-500" },
};

export default function CoursesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useCourses({ page, limit: 10 });
  const { data: instructors } = useInstructors();
  const deleteMut = useDeleteCourse();
  const [deleteTarget, setDeleteTarget] = useState<CourseRecord | null>(null);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    { key: "title", label: "عنوان (عربی)", render: (r: CourseRecord) => r.title.ar },
    { key: "slug", label: "Slug" },
    { key: "level", label: "سطح", render: (r: CourseRecord) => <StatusBadge status={r.level} map={LEVEL_MAP} /> },
    { key: "instructor", label: "استاد", render: (r: CourseRecord) => instructors?.find((i) => i.id === r.instructorId)?.name.ar ?? "-" },
    {
      key: "langs", label: "زبان‌ها",
      render: (r: CourseRecord) => {
        const hasAr = !!(r.title.ar && r.description.ar);
        const hasUr = !!(r.title.ur && r.description.ur);
        return (
          <div className="flex gap-1.5">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${hasAr ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"}`}>AR {hasAr ? "✓" : "—"}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${hasUr ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-500"}`}>UR {hasUr ? "✓" : "—"}</span>
          </div>
        );
      },
    },
    { key: "isPublished", label: "وضعیت", render: (r: CourseRecord) => <StatusBadge status={String(r.isPublished)} map={PUBLISHED_MAP} /> },
    {
      key: "actions", label: "عملیات",
      render: (r: CourseRecord) => (
        <div className="flex gap-2">
          <Link
            href={`/dashboard/courses/${r.slug}/content`}
            className="p-2 rounded-md text-gray-500 hover:text-[var(--brand)] hover:bg-gray-100 transition-colors"
            title="مدیریت سرفصل و درس‌ها"
          >
            <RiListCheck2 size={19} />
          </Link>
          <Link
            href={`/dashboard/courses/${r.slug}/edit`}
            className="p-2 rounded-md text-gray-500 hover:text-[var(--brand)] hover:bg-gray-100 transition-colors"
            title="ویرایش دوره"
          >
            <RiEditLine size={19} />
          </Link>
          <button
            onClick={() => setDeleteTarget(r)}
            className="p-2 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="حذف دوره"
          >
            <RiDeleteBinLine size={19} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="دوره‌ها"
        description="مدیریت دوره‌های آموزشی"
        onAdd={() => router.push("/dashboard/courses/new")}
        addLabel="دوره جدید"
      />
      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

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
        title="حذف دوره"
        description={`آیا از حذف "${deleteTarget?.title.ar}" مطمئن هستید؟`}
      />
    </div>
  );
}
