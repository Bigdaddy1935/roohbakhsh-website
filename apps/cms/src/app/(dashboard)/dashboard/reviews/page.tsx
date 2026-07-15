"use client";

import { useState } from "react";
import { Tabs, Modal } from "@heroui/react";
import type { ReviewWithTarget } from "@roohbakhsh/shared";
import { useReviewsPending, useAllReviews, useApproveReview, useRejectReview, useReplyReview } from "@/hooks/queries/use-reviews";
import DataTable from "@/components/ui/DataTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { RiCheckLine, RiCloseLine, RiReplyLine, RiSaveLine } from "react-icons/ri";
import { toast } from "sonner";

function ReplyModal({ review, onClose }: { review: ReviewWithTarget; onClose: () => void }) {
  const replyMut = useReplyReview();
  const [body, setBody] = useState(review.instructorReply ?? "");

  return (
    <Modal isOpen onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container placement="center" className="max-w-lg w-full mx-4">
          <Modal.Dialog className="bg-white rounded-[20px]">
            <Modal.Header className="flex items-center justify-between pb-4">
              <Modal.Heading className="text-[var(--ink)] font-bold text-base">
                {review.instructorReply ? "ویرایش پاسخ" : "پاسخ به نظر"}
              </Modal.Heading>
              <Modal.CloseTrigger onClick={onClose} className="size-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
                <RiCloseLine size={18} />
              </Modal.CloseTrigger>
            </Modal.Header>
            <Modal.Body className="space-y-4">
              {review.comment && (
                <p className="text-sm text-gray-500 bg-gray-50 rounded-[12px] p-4">{review.comment}</p>
              )}
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                placeholder="متن پاسخ..."
                className="w-full border border-gray-200 rounded-[12px] px-3 py-2.5 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--brand)] bg-white transition-colors resize-none"
              />
            </Modal.Body>
            <Modal.Footer className="flex gap-2 justify-end">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                انصراف
              </button>
              <button
                type="button"
                disabled={replyMut.isPending}
                onClick={async () => {
                  await replyMut.mutateAsync({ id: review.id, body });
                  toast.success("پاسخ ذخیره شد.");
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90 disabled:opacity-50 transition-colors"
              >
                <RiSaveLine size={15} />
                {replyMut.isPending ? "در حال ذخیره..." : "ذخیره"}
              </button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

type Tab = "pending" | "all";

export default function ReviewsPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [page, setPage] = useState(1);

  const pendingQuery = useReviewsPending({ page, limit: 15 });
  const allQuery = useAllReviews({ page, limit: 15 });
  const { data, isLoading } = tab === "pending" ? pendingQuery : allQuery;

  const approveMut = useApproveReview();
  const rejectMut = useRejectReview();
  const [rejectTarget, setRejectTarget] = useState<ReviewWithTarget | null>(null);
  const [replyTarget, setReplyTarget] = useState<ReviewWithTarget | null>(null);

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  function switchTab(next: Tab) { setTab(next); setPage(1); }

  const columns = [
    { key: "user", label: "کاربر", render: (r: ReviewWithTarget) => r.user?.fullName ?? r.userId },
    { key: "target", label: "دوره/مقاله", minWidth: "150px", render: (r: ReviewWithTarget) => r.target?.title?.ar ?? r.target?.type ?? "-" },
    { key: "rating", label: "امتیاز", render: (r: ReviewWithTarget) => `${r.rating} / 5` },
    { key: "comment", label: "نظر", minWidth: "200px", render: (r: ReviewWithTarget) => <span className="max-w-[220px] truncate block">{r.comment ?? "-"}</span> },
    { key: "reply", label: "پاسخ مدیر", minWidth: "200px", render: (r: ReviewWithTarget) => <span className="max-w-[220px] truncate block text-gray-500">{r.instructorReply ?? "-"}</span> },
    {
      key: "actions", label: "عملیات",
      render: (r: ReviewWithTarget) => (
        <div className="flex gap-2">
          {tab === "pending" && (
            <>
              <button onClick={() => approveMut.mutate(r.id)} disabled={approveMut.isPending || rejectMut.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50">
                <RiCheckLine /> تأیید
              </button>
              <button onClick={() => setRejectTarget(r)} disabled={approveMut.isPending || rejectMut.isPending}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50">
                <RiCloseLine /> رد
              </button>
            </>
          )}
          <button onClick={() => setReplyTarget(r)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
            <RiReplyLine /> {r.instructorReply ? "ویرایش پاسخ" : "پاسخ"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div>
          <h1 className="text-xl font-extrabold text-[var(--ink)]">نظرات</h1>
          <p className="text-sm text-gray-400 mt-1">بررسی و پاسخ به نظرات دوره‌ها و مقالات</p>
        </div>
        <Tabs selectedKey={tab} onSelectionChange={(key) => switchTab(key as Tab)}>
          <Tabs.ListContainer>
            <Tabs.List aria-label="فیلتر نظرات">
              <Tabs.Tab id="pending">در انتظار<Tabs.Indicator /></Tabs.Tab>
              <Tabs.Tab id="all"><Tabs.Separator />تأییدشده<Tabs.Indicator /></Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </div>

      <DataTable columns={columns as Parameters<typeof DataTable>[0]["columns"]} data={items} isLoading={isLoading} page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmModal
        isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)}
        onConfirm={async () => { if (rejectTarget) { await rejectMut.mutateAsync(rejectTarget.id); setRejectTarget(null); } }}
        isPending={rejectMut.isPending} title="رد نظر" description="این نظر کاملاً حذف می‌شود. مطمئنید؟"
      />

      {replyTarget && <ReplyModal review={replyTarget} onClose={() => setReplyTarget(null)} />}
    </div>
  );
}
