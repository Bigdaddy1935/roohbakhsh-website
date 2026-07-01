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
      label: "Ú©Ø§Ø±Ø¨Ø±",
      render: (r: ReviewWithTarget) => r.user?.fullName ?? r.userId,
    },
    {
      key: "target",
      label: "Ø¯ÙˆØ±Ù‡/Ù…Ù‚Ø§Ù„Ù‡",
      render: (r: ReviewWithTarget) => r.target?.title?.ar ?? r.target?.type ?? "-",
    },
    {
      key: "rating",
      label: "Ø§Ù…ØªÛŒØ§Ø²",
      render: (r: ReviewWithTarget) => `${r.rating} / 5`,
    },
    {
      key: "comment",
      label: "Ù†Ø¸Ø±",
      render: (r: ReviewWithTarget) => (
        <span className="line-clamp-2 max-w-xs block">{r.comment ?? "-"}</span>
      ),
    },
    {
      key: "actions",
      label: "Ø¹Ù…Ù„ÛŒØ§Øª",
      render: (r: ReviewWithTarget) => (
        <button
          onClick={() => approveMut.mutate(r.id)}
          disabled={approveMut.isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
        >
          <RiCheckLine />
          ØªØ£ÛŒÛŒØ¯
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Ù†Ø¸Ø±Ø§Øª Ø¯Ø± Ø§Ù†ØªØ¸Ø§Ø± ØªØ£ÛŒÛŒØ¯" description="Ù†Ø¸Ø±Ø§Øª Ø«Ø¨Øªâ€ŒØ´Ø¯Ù‡ Ú©Ù‡ Ù†ÛŒØ§Ø² Ø¨Ù‡ ØªØ£ÛŒÛŒØ¯ Ø¯Ø§Ø±Ù†Ø¯" />

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

