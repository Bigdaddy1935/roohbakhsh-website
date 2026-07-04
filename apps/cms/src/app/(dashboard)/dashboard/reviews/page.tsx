"use client";

import { useState, type FormEvent } from "react";
import type { ReviewWithTarget } from "@roohbakhsh/shared";
import {
  useReviewsPending,
  useAllReviews,
  useApproveReview,
  useRejectReview,
  useReplyReview,
} from "@/hooks/queries/use-reviews";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import FormModal from "@/components/ui/FormModal";
import FormField from "@/components/ui/FormField";
import { RiCheckLine, RiCloseLine, RiReplyLine } from "react-icons/ri";

type Tab = "pending" | "all";

export default function ReviewsPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [page, setPage] = useState(1);

  const pendingQuery = useReviewsPending({ page, limit: 15 });
  const allQuery = useAllReviews({ page, limit: 15 });
  const { data, isLoading } = tab === "pending" ? pendingQuery : allQuery;

  const approveMut = useApproveReview();
  const rejectMut = useRejectReview();
  const replyMut = useReplyReview();

  const [rejectTarget, setRejectTarget] = useState<ReviewWithTarget | null>(null);
  const [replyTarget, setReplyTarget] = useState<ReviewWithTarget | null>(null);
  const [replyBody, setReplyBody] = useState("");

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  function switchTab(next: Tab) {
    setTab(next);
    setPage(1);
  }

  function openReply(r: ReviewWithTarget) {
    setReplyTarget(r);
    setReplyBody(r.instructorReply ?? "");
  }

  async function handleReplySubmit(e: FormEvent) {
    e.preventDefault();
    if (!replyTarget) return;
    await replyMut.mutateAsync({ id: replyTarget.id, body: replyBody });
    setReplyTarget(null);
  }

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
      key: "reply",
      label: "پاسخ مدیر",
      render: (r: ReviewWithTarget) => (
        <span className="line-clamp-2 max-w-xs block text-gray-500">{r.instructorReply ?? "-"}</span>
      ),
    },
    {
      key: "actions",
      label: "عملیات",
      render: (r: ReviewWithTarget) => (
        <div className="flex gap-2">
          {tab === "pending" && (
            <>
              <button
                onClick={() => approveMut.mutate(r.id)}
                disabled={approveMut.isPending || rejectMut.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
              >
                <RiCheckLine />
                تأیید
              </button>
              <button
                onClick={() => setRejectTarget(r)}
                disabled={approveMut.isPending || rejectMut.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                <RiCloseLine />
                رد
              </button>
            </>
          )}
          <button
            onClick={() => openReply(r)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <RiReplyLine />
            {r.instructorReply ? "ویرایش پاسخ" : "پاسخ"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="نظرات" description="بررسی و پاسخ به نظرات دوره‌ها و مقالات" />

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => switchTab("pending")}
          className={`px-4 py-2 text-sm rounded-md transition-colors ${
            tab === "pending" ? "bg-[var(--brand)] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          در انتظار تأیید
        </button>
        <button
          onClick={() => switchTab("all")}
          className={`px-4 py-2 text-sm rounded-md transition-colors ${
            tab === "all" ? "bg-[var(--brand)] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          همه‌ی نظرات تأییدشده
        </button>
      </div>

      <DataTable
        columns={columns as Parameters<typeof DataTable>[0]["columns"]}
        data={items}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmModal
        isOpen={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={async () => { if (rejectTarget) { await rejectMut.mutateAsync(rejectTarget.id); setRejectTarget(null); } }}
        isPending={rejectMut.isPending}
        title="رد نظر"
        description="این نظر کاملاً حذف می‌شود. مطمئنید؟"
      />

      <FormModal
        isOpen={!!replyTarget}
        onClose={() => setReplyTarget(null)}
        title="پاسخ به نظر"
        onSubmit={handleReplySubmit}
        isPending={replyMut.isPending}
      >
        {replyTarget?.comment && (
          <p className="text-sm text-gray-500 bg-gray-50 rounded-md p-3">{replyTarget.comment}</p>
        )}
        <FormField
          as="textarea"
          label="پاسخ مدیر"
          value={replyBody}
          onChange={(e) => setReplyBody(e.target.value)}
          rows={4}
          required
        />
      </FormModal>
    </div>
  );
}
