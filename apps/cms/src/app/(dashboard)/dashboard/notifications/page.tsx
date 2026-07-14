"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NotificationItem } from "@roohbakhsh/shared";
import { useNotificationsHistory } from "@/hooks/queries/use-notifications";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotificationsHistory({ page, limit: 10 });

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
        ]}
        data={data?.items ?? []}
        isLoading={isLoading}
        page={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
