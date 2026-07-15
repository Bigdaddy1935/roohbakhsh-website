"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAllReviews, useReplyReview } from "@/hooks/queries/use-reviews";
import FormField from "@/components/ui/FormField";
import { RiArrowRightLine, RiSaveLine } from "react-icons/ri";

export default function ReplyReviewPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading } = useAllReviews({ page: 1, limit: 200 });
  const review = data?.items?.find((r) => r.id === id);
  const replyMut = useReplyReview();
  const [replyBody, setReplyBody] = useState(review?.instructorReply ?? "");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await replyMut.mutateAsync({ id, body: replyBody });
    router.push("/dashboard/reviews");
  }

  if (isLoading || !review) return <div className="text-sm text-gray-400">در حال بارگذاری...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-6 bg-white border border-gray-100 rounded-[20px] px-5 h-[105px]">
        <div className="flex items-center gap-x-3">
          <button type="button" onClick={() => router.push("/dashboard/reviews")} className="p-2 rounded-[20px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <RiArrowRightLine size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">پاسخ به نظر</h1>
            <p className="text-sm text-gray-400">{review.user?.fullName ?? review.userId}</p>
          </div>
        </div>
        <button type="submit" disabled={replyMut.isPending} className="flex items-center gap-x-2 px-5 py-2.5 bg-[var(--brand)] text-white text-sm font-bold rounded-[20px] hover:bg-[var(--brand)]/90 disabled:opacity-60 transition-colors">
          <RiSaveLine size={16} />
          {replyMut.isPending ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </div>

      <div className="max-w-2xl space-y-5">
        {review.comment && (
          <div className="bg-white rounded-[20px] p-6">
            <p className="text-sm text-gray-500 bg-gray-50 rounded-[12px] p-4">{review.comment}</p>
          </div>
        )}
        <div className="bg-white rounded-[20px] p-6 space-y-5">
          <h2 className="text-sm font-bold text-gray-600 border-b border-gray-100 pb-3">پاسخ مدیر</h2>
          <FormField as="textarea" label="متن پاسخ" value={replyBody} onChange={(e) => setReplyBody(e.target.value)} rows={6} required />
        </div>
      </div>
    </form>
  );
}
