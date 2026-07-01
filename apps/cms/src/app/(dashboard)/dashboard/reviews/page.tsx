"use client";

import { useState } from "react";
import type { ReviewWithTarget } from "@roohbakhsh/shared";
import {
  useReviewsPending,
  useApproveReview,
} from "@/hooks/queries/use-reviews";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import { RiCheckLine } from "react-icons/ri";

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useReviewsPending({ page, limit: 15 });
  const approveMut = useApproveReview();

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns = [
    {
      key: "user",
      label: "کاربر",
      render: (r: ReviewWithTarget) => r.user?.fullName ?? r.userId,
    },
    {
      key: "target",
      label: "دوره/مقاله",
      render: (r: ReviewWithTarget) => r.target?.title?.ar ?? r.target?.type ?? "-",
    },
    {
      key: "rating",
      label: "امتیاز",
      render: (r: ReviewWithTarget) => `${r.rating} / 5`,
    },
    {
      key: "comment",
      label: "نظر",
      render: (r: ReviewWithTarget) => (
        <span className="line-clamp-2 max-w-xs block">{r.comment ?? "-"}</span>
      ),
    },
    {
      key: "actions",
      label: "عملیات",
      render: (r: ReviewWithTarget) => (
        <button
          onClick={() => approveMut.mutate(r.id)}
          disabled={approveMut.isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
        >
          <RiCheckLine />
          تأیید
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="نظرات در انتظار تأیید" description="نظرات ثبت‌شده که نیاز به تأیید دارند" />

      <DataTable
        columns={columns as Parameters<typeof DataTable>[0]["columns"]}
        data={items}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

