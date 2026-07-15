"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { NotificationItem } from "@roohbakhsh/shared";
import { useNotificationsHistory, useDeleteNotification } from "@/hooks/queries/use-notifications";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { RiDeleteBinLine } from "react-icons/ri";

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotificationsHistory({ page, limit: 10 });
  const deleteMut = useDeleteNotification();
  const [deleteTarget, setDeleteTarget] = useState<NotificationItem | null>(null);

  return (
    <div>
      <PageHeader
        title="اعلان‌ها"
        description="ارسال اعلان برای همه‌ی کاربران"
        onAdd={() => router.push("/dashboard/notifications/new")}
        addLabel="اعلان جدید"
      />
      <DataTable
        columns={[
          { key: "title", label: "عنوان", render: (r: NotificationItem) => r.title.ar },
          { key: "body", label: "متن", render: (r: NotificationItem) => <span className="line-clamp-2 max-w-md block">{r.body.ar}</span> },
          { key: "link", label: "لینک", render: (r: NotificationItem) => r.link ?? "-" },
          { key: "createdAt", label: "تاریخ", render: (r: NotificationItem) => r.createdAt.slice(0, 10) },
          {
            key: "actions", label: "عملیات",
            render: (r: NotificationItem) => (
              <button
                onClick={() => setDeleteTarget(r)}
                className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="حذف اعلان"
              >
                <RiDeleteBinLine size={17} />
              </button>
            ),
          },
        ]}
        data={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteMut.mutateAsync(deleteTarget.id);
            toast.success("اعلان حذف شد.");
            setDeleteTarget(null);
          }
        }}
        isPending={deleteMut.isPending}
        title="حذف اعلان"
        description={`آیا از حذف اعلان "${deleteTarget?.title.ar}" مطمئن هستید؟`}
      />
    </div>
  );
}
