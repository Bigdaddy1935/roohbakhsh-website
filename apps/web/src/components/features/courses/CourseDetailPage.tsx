"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiArrowLeftSLine,
  RiPlayCircleLine, RiLockLine,
  RiArrowDownSLine, RiArrowUpSLine,
  RiArrowRightSLine,
  RiUserLine, RiTimeLine, RiBookOpenLine,
  RiCalendarLine, RiStarFill,
  RiCheckboxCircleLine, RiWifiLine,
  RiShareLine, RiShoppingCartLine,
  RiGiftLine, RiMessageLine,
  RiAddLine, RiSubtractLine,
  RiLoader4Line, RiChat3Line, RiCloseLine,
  RiHeartFill, RiHeartLine,
  RiCheckLine, RiReplyLine, RiSendPlaneLine,
} from "react-icons/ri";
import { toast } from "sonner";
import { useCourse, useCourseSections } from "@/hooks/queries/use-courses";
import { useAddToCart } from "@/hooks/queries/use-cart";
import { useCourseProgress } from "@/hooks/queries/use-progress";
import {
  useCourseReviews, useCreateCourseReview,
  useApproveReview, useRejectReview, useReplyToReview, usePendingReviews,
} from "@/hooks/queries/use-reviews";
import { useMe } from "@/hooks/queries/use-auth";
import { useMyFavorites, useToggleFavorite } from "@/hooks/queries/use-favorites";
import { tokenStore } from "@/lib/api-client";
import { formatMoney, isFree, discountPercent } from "@/lib/format";
import type { SectionRecord, ReviewRecord } from "@roohbakhsh/shared";

function CourseFavoriteButton({ courseId, t }: { courseId: string; t: (k: string) => string }) {
  const tc = useTranslations("Common");
  const isAuthed = typeof window !== "undefined" && !!tokenStore.getAccess();
  const { data: favorites } = useMyFavorites();
  const toggleFavorite = useToggleFavorite();
  const isFavorite = !!favorites?.some((f) => f.type === "course" && f.id === courseId);

  return (
    <button
      type="button"
      onClick={() => {
        if (!isAuthed) {
          toast.error(tc("login_required_toast"));
          return;
        }
        toggleFavorite.mutate(
          { type: "course", id: courseId },
          { onSuccess: (status) => toast.success(status.isFavorite ? tc("favorite_added_toast") : tc("favorite_removed_toast")) },
        );
      }}
      disabled={toggleFavorite.isPending}
      className="size-12 shrink-0 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-rose-300 hover:text-rose-500 transition-colors disabled:opacity-60 cursor-pointer"
      title={t("toggle_favorite")}
    >
      {isFavorite ? <RiHeartFill size={20} className="text-rose-500" /> : <RiHeartLine size={20} />}
    </button>
  );
}

function LessonFavoriteButton({ lessonId, t }: { lessonId: string; t: (k: string) => string }) {
  const tc = useTranslations("Common");
  const isAuthed = typeof window !== "undefined" && !!tokenStore.getAccess();
  const { data: favorites } = useMyFavorites();
  const toggleFavorite = useToggleFavorite();
  const isFavorite = !!favorites?.some((f) => f.type === "lesson" && f.id === lessonId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthed) {
          toast.error(tc("login_required_toast"));
          return;
        }
        toggleFavorite.mutate(
          { type: "lesson", id: lessonId },
          { onSuccess: (status) => toast.success(status.isFavorite ? tc("favorite_added_toast") : tc("favorite_removed_toast")) },
        );
      }}
      disabled={toggleFavorite.isPending}
      className="shrink-0 text-gray-300 hover:text-rose-500 transition-colors disabled:opacity-60 cursor-pointer"
      title={t("toggle_favorite")}
    >
      {isFavorite ? <RiHeartFill size={16} className="text-rose-500" /> : <RiHeartLine size={16} />}
    </button>
  );
}

function fmtDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function Stars({ rating, size = 13 }: { rating: number | null; size?: number }) {
  const r = rating ?? 0;
  return (
    <span className="flex items-center gap-x-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <RiStarFill key={s} size={size}
          className={s <= Math.round(r) ? "text-amber-400" : "text-gray-200"} />
      ))}
    </span>
  );
}

function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-x-2.5 mb-5 md:mb-7">
      <span className="text-[var(--brand)] shrink-0">{icon}</span>
      <h2 className="font-bold text-base md:text-lg text-[var(--ink)]">{title}</h2>
    </div>
  );
}

function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-md ${className}`} />;
}

function StarsInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <span className="flex items-center gap-x-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className="cursor-pointer"
        >
          <RiStarFill size={22} className={s <= value ? "text-amber-400" : "text-gray-200"} />
        </button>
      ))}
    </span>
  );
}

function AdminReviewActions({ review, t }: { review: ReviewRecord; t: (k: string) => string }) {
  const approveReview = useApproveReview();
  const rejectReview = useRejectReview();
  const replyToReview = useReplyToReview();
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState(review.instructorReply ?? "");

  function handleReject() {
    if (!confirm(t("confirm_reject"))) return;
    rejectReview.mutate(review.id, { onSuccess: () => toast.success(t("review_rejected_toast")) });
  }

  function handleSubmitReply() {
    if (!reply.trim()) return;
    replyToReview.mutate(
      { reviewId: review.id, reply: reply.trim() },
      { onSuccess: () => { toast.success(t("reply_submitted_toast")); setReplyOpen(false); } },
    );
  }

  return (
    <div className="flex flex-col gap-y-2 mt-2">
      <div className="flex items-center gap-x-3">
        {!review.isApproved && (
          <>
            <button
              type="button"
              onClick={() => approveReview.mutate(review.id, { onSuccess: () => toast.success(t("review_approved_toast")) })}
              disabled={approveReview.isPending}
              title={t("approve_review")}
              className="text-gray-300 hover:text-emerald-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RiCheckLine size={16} />
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={rejectReview.isPending}
              title={t("reject_review")}
              className="text-gray-300 hover:text-rose-500 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RiCloseLine size={16} />
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setReplyOpen((o) => !o)}
          title={t("reply_label")}
          className="text-gray-300 hover:text-[var(--brand)] transition-colors cursor-pointer"
        >
          <RiReplyLine size={16} />
        </button>
      </div>

      {replyOpen && (
        <div className="flex items-end gap-x-2">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={t("reply_placeholder")}
            rows={3}
            className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[var(--brand)] transition-colors resize-y"
          />
          <button
            type="button"
            onClick={handleSubmitReply}
            disabled={replyToReview.isPending}
            title={t("submit_reply")}
            className="shrink-0 text-gray-400 hover:text-[var(--brand)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RiSendPlaneLine size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function ReviewsSection({ courseId, courseSlug, t }: { courseId: string; courseSlug: string; t: (k: string) => string }) {
  const { data, isLoading } = useCourseReviews(courseSlug, { limit: 10 });
  const { data: me } = useMe();
  const isAdmin = me?.role === "admin";
  const { data: pendingData } = usePendingReviews({ limit: 100 });
  const createReview = useCreateCourseReview();
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const approvedReviews = data?.items ?? [];
  const pendingForCourse = isAdmin
    ? (pendingData?.items ?? []).filter((p) => p.target.type === "course" && p.target.id === courseId)
    : [];
  const reviewMap = new Map<string, (typeof approvedReviews)[number]>();
  for (const r of approvedReviews) reviewMap.set(r.id, r);
  for (const r of pendingForCourse) reviewMap.set(r.id, r);
  const reviews = [...reviewMap.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const isAuthed = typeof window !== "undefined" && !!tokenStore.getAccess();

  function handleSubmit() {
    createReview.mutate(
      { courseSlug, rating, comment: comment.trim() || null },
      {
        onSuccess: () => {
          toast.success(t("review_submitted_toast"));
          setFormOpen(false);
          setComment("");
          setRating(5);
        },
        onError: () => {
          toast.error(t("review_submit_error_toast"));
        },
      },
    );
  }

  return (
    <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
      <div className="flex items-center justify-between mb-5 md:mb-7">
        <div className="flex items-center gap-x-2.5">
          <span className="text-[var(--brand)] shrink-0"><RiChat3Line size={28} /></span>
          <h2 className="font-bold text-base md:text-lg text-[var(--ink)]">{t("section_reviews")}</h2>
        </div>
        {!formOpen && isAuthed && (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="text-sm font-semibold text-[var(--brand)] hover:underline cursor-pointer"
          >
            {t("write_review")}
          </button>
        )}
      </div>

      {!isAuthed && (
        <div className="flex items-center gap-x-2.5 mb-6 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200">
          <RiLockLine size={18} className="text-rose-500 shrink-0" />
          <span className="text-sm font-semibold text-rose-500">{t("login_required_toast")}</span>
          <Link href="/signup" className="text-sm font-bold text-[var(--brand)] hover:underline shrink-0">
            {t("register_link_text")}
          </Link>
        </div>
      )}

      {formOpen && (
        <div className="mb-6 bg-white rounded-md border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="text-sm font-bold text-[var(--ink)]">{t("write_review").replace(/^\+\s*/, "")}</span>
            <button type="button" onClick={() => setFormOpen(false)} className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <RiCloseLine size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between px-5 pt-5">
            <span className="text-sm font-semibold text-[var(--ink)]">{t("rating")}</span>
            <StarsInput value={rating} onChange={setRating} />
          </div>
          <div className="flex flex-col gap-y-1 px-5 pt-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder={t("review_placeholder")}
              className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors resize-none"
            />
          </div>
          <div className="flex items-center justify-end gap-x-2.5 px-5 py-4">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="h-10 px-5 rounded-md border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createReview.isPending}
              className="flex items-center gap-x-2 h-10 px-6 rounded-md bg-[var(--brand)] text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60 cursor-pointer"
            >
              {createReview.isPending && <RiLoader4Line size={15} className="animate-spin" />}
              {t("submit_review")}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-start gap-x-3">
              <Sk className="size-10 rounded-full shrink-0" />
              <div className="flex flex-col gap-y-1.5 w-full">
                <Sk className="h-3.5 w-32" />
                <Sk className="h-3.5 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{t("no_reviews_yet")}</p>
      ) : (
        <div className="flex flex-col">
          {reviews.map((r, idx) => (
            <div key={r.id} className={`px-4 py-5 bg-white min-h-[150px] ${idx < reviews.length - 1 ? "border-b border-gray-200" : ""}`}>
              {/* Header row */}
              <div className="flex items-center gap-x-3">
                {r.user.avatarUrl ? (
                  <Image
                    src={r.user.avatarUrl}
                    alt={r.user.fullName}
                    width={38} height={38}
                    style={{ width: 38, height: 38 }}
                    className="rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className={`size-[38px] rounded-full flex items-center justify-center shrink-0 ${r.isStudent ? "bg-[var(--brand)]/10" : "bg-gray-100"}`}>
                    <RiUserLine size={20} className={r.isStudent ? "text-[var(--brand)]" : "text-gray-400"} />
                  </div>
                )}
                <div className="flex flex-col gap-y-2 min-w-0">
                  <span className="text-sm font-semibold text-[var(--ink)] truncate">{r.user.fullName}</span>
                  <span className={`self-start text-xs font-bold px-2 py-0.5 rounded-full ${r.isStudent ? "bg-[var(--brand)]/10 text-[var(--brand)]" : "bg-gray-100 text-gray-500"}`}>
                    {r.isStudent ? t("student_label") : t("user_label")}
                  </span>
                </div>
                <div className="flex items-center gap-x-2 ms-auto shrink-0 self-start">
                  <span className="text-sm font-medium text-gray-500">{r.createdAt.slice(0, 10)}</span>
                  {!r.isApproved && (isAdmin || (me && r.userId === me.id)) && (
                    <span className="text-xs text-gray-400">· {t("review_pending_notice")}</span>
                  )}
                  <Stars rating={r.rating} size={14} />
                </div>
              </div>
              {/* Comment */}
              {r.comment && <p className="text-sm font-medium text-gray-600 leading-7 mt-4 ps-[50px]">{r.comment}</p>}

              {r.instructorReply && (
                <div className="flex items-start gap-x-3 mt-6 ms-6 sm:ms-10 ps-3.5 border-s-2 border-sky-300">
                  <div className="size-8 rounded-full bg-sky-50 flex items-center justify-center shrink-0">
                    <RiCheckboxCircleLine size={16} className="text-sky-500" />
                  </div>
                  <div className="flex flex-col gap-y-2 min-w-0">
                    <div className="flex items-center gap-x-2">
                      <span className="text-xs font-semibold text-[var(--ink)]">{t("reply_label")}</span>
                      {r.repliedAt && <span className="text-xs text-gray-400">{r.repliedAt.slice(0, 10)}</span>}
                    </div>
                    <p className="text-sm text-gray-500 leading-7">{r.instructorReply}</p>
                  </div>
                </div>
              )}

              {isAdmin && <AdminReviewActions review={r} t={t} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <div className="container pt-8 sm:pt-10">
        <section className="lg:grid grid-cols-2 gap-x-8 xl:gap-x-14 mb-8 sm:mb-12 lg:mb-16">
          <div className="flex flex-col order-2 lg:order-1">
            <div className="flex items-center gap-x-2 mb-5 sm:mb-7">
              <Sk className="h-4 w-16" />
              <Sk className="h-4 w-16" />
              <Sk className="h-4 w-28" />
            </div>

            <Sk className="block lg:hidden w-full md:w-2/3 mx-auto aspect-video mb-5 sm:mb-6 rounded-xl" />

            <div className="flex flex-col gap-y-3">
              <Sk className="h-8 sm:h-9 w-4/5 mx-auto lg:mx-0" />
              <Sk className="h-4 w-full" />
              <Sk className="h-4 w-2/3 mx-auto lg:mx-0" />
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-auto">
              <Sk className="h-14 w-full mb-5 rounded-xl" />
              <div className="flex items-end justify-between gap-x-4">
                <Sk className="h-12 w-36 rounded-xl" />
                <Sk className="h-8 w-24" />
              </div>
            </div>
          </div>

          <div className="hidden lg:block order-1 lg:order-2">
            <Sk className="w-full aspect-video rounded-xl" />
          </div>
        </section>
      </div>

      <div className="container">
        <div className="flex flex-col lg:flex-row gap-7">
          <div className="flex flex-col gap-y-6 md:gap-y-8 lg:grow min-w-0">

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center gap-x-3 gap-y-1.5 bg-white py-3.5 md:px-4 rounded-xl border border-gray-50">
                  <Sk className="size-7 rounded-full shrink-0" />
                  <div className="flex flex-col items-center md:items-start gap-y-1.5 w-full">
                    <Sk className="h-4 w-12" />
                    <Sk className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <Sk className="h-5 w-40 mb-6" />
              <div className="flex flex-col gap-y-3">
                <Sk className="h-3.5 w-full" />
                <Sk className="h-3.5 w-full" />
                <Sk className="h-3.5 w-5/6" />
                <Sk className="h-3.5 w-2/3" />
              </div>
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <Sk className="h-5 w-40 mb-6" />
              <div className="space-y-4 sm:space-y-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Sk key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <Sk className="h-5 w-40 mb-6" />
              <Sk className="h-4 w-3/4 mb-5" />
              <div className="flex items-center gap-x-3">
                <Sk className="size-12 sm:size-14 rounded-xl shrink-0" />
                <div className="flex flex-col gap-y-1.5 w-1/2">
                  <Sk className="h-4 w-full" />
                  <Sk className="h-3 w-2/3" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <Sk className="h-5 w-40 mb-6" />
              <div className="flex flex-col gap-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-x-3">
                    <Sk className="size-10 rounded-full shrink-0" />
                    <div className="flex flex-col gap-y-1.5 w-full">
                      <Sk className="h-3.5 w-32" />
                      <Sk className="h-3.5 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:w-[340px] xl:w-[360px] flex flex-col gap-y-5 shrink-0">
            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <div className="flex items-center justify-between mb-4">
                <Sk className="h-4 w-20" />
                <Sk className="h-4 w-10" />
              </div>
              <Sk className="h-2 w-full rounded-full" />
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <Sk className="size-20 rounded-full mx-auto" />
              <Sk className="h-4 w-2/3 mx-auto mt-4" />
              <Sk className="h-10 w-full mt-6 rounded-xl" />
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <div className="flex items-center justify-between">
                <Sk className="h-4 w-16" />
                <div className="flex gap-x-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Sk key={i} className="size-9 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

function ChapterRow({
  section, courseSlug, t, locale,
}: {
  section: SectionRecord; courseSlug: string; t: (k: string) => string; locale: "ar" | "ur";
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <div
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between gap-x-3 px-4 py-3.5 cursor-pointer rounded-lg transition-colors select-none ${open ? "bg-[var(--ink)] text-white" : "bg-gray-100 text-[var(--ink)]"}`}
      >
        <span className="text-sm md:text-base">{section.title[locale]}</span>
        <div className="flex items-center gap-x-4 shrink-0">
          <div className={`hidden sm:flex items-center gap-x-2 text-sm ${open ? "text-white/60" : "text-gray-400"}`}>
            <span>{section.lessons.length} {t("lesson_count")}</span>
            <span className="size-1 rounded-full bg-current opacity-50" />
            <span>{fmtDuration(section.lessons.reduce((s, l) => s + l.durationMinutes, 0))}</span>
          </div>
          {open
            ? <RiArrowUpSLine size={18} />
            : <RiArrowDownSLine size={18} />
          }
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-y-2.5 sm:ps-4 mt-3">
          {section.lessons.map((lesson, idx) => {
            const rowCls = "flex items-center justify-between gap-x-4 md:gap-x-6 border border-gray-100 hover:border-[var(--brand)]/40 pe-3.5 ps-1.5 py-3 rounded-lg group transition-colors flex-1 min-w-0";
            const rowContent = (
              <>
                <div className="flex items-center gap-x-2.5 min-w-0">
                  <div className="flex items-center gap-x-0.5 select-none shrink-0">
                    <span className="w-8 md:w-9 text-sm md:text-base font-bold text-center">{idx + 1}</span>
                    <div className="w-px h-4 bg-gray-100" />
                  </div>
                  <span className="text-sm md:text-base line-clamp-2">{lesson.title[locale]}</span>
                </div>
                <div className="flex items-center gap-x-2 md:gap-x-3 text-gray-400 group-hover:text-[var(--ink)] shrink-0 transition-colors">
                  <span className="text-sm">{fmtDuration(lesson.durationMinutes)}</span>
                  {lesson.isFreePreview
                    ? <RiPlayCircleLine size={18} className="text-[var(--brand)]" />
                    : <RiLockLine size={16} />
                  }
                </div>
              </>
            );

            return (
              <div key={lesson.id} className="flex items-center gap-x-2">
                {lesson.isFreePreview ? (
                  <Link href={`/courses/${courseSlug}/lessons/${lesson.id}`} className={rowCls}>
                    {rowContent}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      toast.error(t("locked_lesson_toast"), {
                        icon: <RiLockLine size={18} className="text-rose-500" />,
                        classNames: { title: "text-rose-500" },
                      })
                    }
                    className={`${rowCls} text-start cursor-pointer`}
                  >
                    {rowContent}
                  </button>
                )}
                <LessonFavoriteButton lessonId={lesson.id} t={t} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CourseDetailContent({ courseSlug }: { courseSlug: string }) {
  const t = useTranslations("CourseDetail");
  const locale = useLocale() as "ar" | "ur";
  const [descExpanded, setDescExpanded] = useState(false);
  const [playingIntro, setPlayingIntro] = useState(false);

  const { data: course, isLoading: loadingCourse } = useCourse(courseSlug);
  const { data: sections, isLoading: loadingSections } = useCourseSections(courseSlug);
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();
  const { data: progress } = useCourseProgress(courseSlug);

  if (loadingCourse) {
    return <CourseDetailSkeleton />;
  }

  if (!course) {
    return <div className="container py-32 text-center text-gray-400">Course not found.</div>;
  }

  const allSections = sections ?? [];
  const totalLessons = allSections.reduce((s, sec) => s + sec.lessons.length, 0);
  const hoursTotal = Math.round(course.durationMinutes / 60 * 10) / 10;
  const free = isFree(course.effectivePrice);
  const thumb = course.thumbnailUrl?.[locale] ?? course.thumbnailUrl?.ar ?? "";
  const introVideo = course.introVideoUrl?.[locale] ?? course.introVideoUrl?.ar ?? null;
  const discPct = discountPercent(course.price, course.effectivePrice);

  const stats = [
    { icon: <RiCheckboxCircleLine size={28} className="text-[var(--brand)]" />, val: t("status_complete"), label: t("status_label") },
    { icon: <RiTimeLine size={28} className="text-[var(--brand)]" />, val: `${hoursTotal}`, label: t("hours") },
    { icon: <RiUserLine size={28} className="text-[var(--brand)]" />, val: course.participantCount.toLocaleString(locale === "ar" ? "ar-EG" : "ur"), label: t("students") },
    { icon: <RiStarFill size={28} className="text-amber-400" />, val: course.averageRating ? course.averageRating.toFixed(1) : "—", label: t("rating") },
    { icon: <RiCalendarLine size={28} className="text-[var(--brand)]" />, val: course.updatedAt.slice(0, 10), label: t("updated") },
    { icon: <RiWifiLine size={28} className="text-[var(--brand)]" />, val: t("watch_mode"), label: t("watch_label") },
  ];

  return (
    <div className="bg-[var(--bg)] min-h-screen">

      <div className="container pt-8 sm:pt-10">
        <section className="lg:grid grid-cols-2 gap-x-8 xl:gap-x-14 mb-8 sm:mb-12 lg:mb-16">

          <div className="flex flex-col cursor-default order-2 lg:order-1">
            <nav className="flex items-center gap-x-2 text-sm text-gray-400 mb-5 sm:mb-7 overflow-x-auto">
              <Link href="/" className="text-nowrap hover:text-[var(--brand)] transition-colors">{t("breadcrumb_home")}</Link>
              <RiArrowDownSLine size={14} className="-rotate-90 text-gray-300 shrink-0" />
              <Link href="/courses" className="text-nowrap hover:text-[var(--brand)] transition-colors">{t("breadcrumb_courses")}</Link>
              <RiArrowDownSLine size={14} className="-rotate-90 text-gray-300 shrink-0" />
              <span className="text-nowrap text-[var(--ink)] font-semibold truncate max-w-[160px]">{course.title[locale]}</span>
            </nav>

            {(thumb || introVideo) && (
              <div className="relative block lg:hidden w-full md:w-2/3 mx-auto rounded-xl overflow-hidden aspect-video mb-5 sm:mb-6 bg-gray-900">
                {playingIntro && introVideo ? (
                  <video src={introVideo} controls autoPlay className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    {thumb && (
                      <Image src={thumb} alt={course.title[locale]} fill className="object-cover" sizes="100vw" />
                    )}
                    {introVideo && (
                      <button
                        type="button"
                        onClick={() => setPlayingIntro(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors cursor-pointer"
                      >
                        <span className="size-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors">
                          <RiPlayCircleLine size={32} className="text-white" />
                        </span>
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="flex flex-col gap-y-3 md:text-center lg:text-start">
              <h1 className="text-2xl md:text-3xl xl:text-4xl font-extrabold text-[var(--ink)]">{course.title[locale]}</h1>
              <p className="text-sm md:text-base text-gray-500 leading-7 line-clamp-3">
                {course.description[locale].split("\n")[0]}
              </p>
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-auto">
              {discPct > 0 && (
                <div className="flex items-center justify-center gap-x-1.5 py-2 mb-2 text-sm md:text-base font-bold text-rose-500">
                  <RiGiftLine size={16} />
                  {discPct}٪ {t("discount_badge")}
                </div>
              )}
              <div className="flex gap-x-3 mb-5">
                <div className="flex-1 flex items-center justify-center gap-x-1.5 py-3 px-3 md:px-6 bg-white rounded-xl border border-gray-100 text-sm md:text-base text-gray-500 text-center">
                  <span>{hoursTotal} {t("hours")}</span>
                </div>
                <div className="flex-1 flex items-center justify-center gap-x-1.5 py-3 px-3 md:px-6 bg-white rounded-xl border border-gray-100 text-sm md:text-base text-gray-500 text-center">
                  <span>{totalLessons} {t("lessons")}</span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-x-4">
                <div className="flex items-center gap-x-2.5">
                  <button
                    onClick={() => addToCart(course.id)}
                    disabled={addingToCart}
                    className="flex items-center justify-center gap-x-2 h-12 px-6 rounded-xl bg-[var(--brand)] text-white font-bold text-sm md:text-base hover:opacity-90 active:scale-[0.98] transition-all shrink-0 disabled:opacity-60"
                  >
                    {addingToCart ? <RiLoader4Line size={18} className="animate-spin" /> : <RiShoppingCartLine size={18} />}
                    {t("add_to_cart")}
                  </button>
                  <CourseFavoriteButton courseId={course.id} t={t} />
                </div>
                {free ? (
                  <span className="text-2xl font-extrabold text-[var(--brand)]">
                    {locale === "ar" ? "مجاني" : "مفت"}
                  </span>
                ) : (
                  <div className="flex items-end flex-col sm:flex-row gap-x-2.5 gap-y-0.5">
                    {course.price && (
                      <span className="text-base md:text-2xl text-gray-300 line-through">
                        {formatMoney(course.price, locale)}
                      </span>
                    )}
                    <span className="text-lg md:text-2xl font-extrabold text-[var(--ink)]">
                      {formatMoney(course.effectivePrice, locale)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden lg:block order-1 lg:order-2">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900">
              {playingIntro && introVideo ? (
                <video src={introVideo} controls autoPlay className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  {thumb && (
                    <Image src={thumb} alt={course.title[locale]} fill className="object-cover opacity-90" sizes="50vw" priority />
                  )}
                  {introVideo ? (
                    <button
                      type="button"
                      onClick={() => setPlayingIntro(true)}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    >
                      <span className="size-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors">
                        <RiPlayCircleLine size={36} className="text-white" />
                      </span>
                    </button>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="size-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                        <RiPlayCircleLine size={36} className="text-white" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="container">
        <div className="flex flex-col lg:flex-row gap-7">

          <div className="flex flex-col gap-y-6 md:gap-y-8 lg:grow min-w-0">

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {stats.map(({ icon, val, label }, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center gap-x-3 gap-y-1.5 bg-white py-3.5 md:px-4 rounded-xl cursor-default border border-gray-50">
                  <span className="shrink-0">{icon}</span>
                  <div className="flex flex-col items-center md:items-start text-center md:text-start gap-y-0.5">
                    <span className="font-bold text-sm text-[var(--ink)] leading-tight">{val}</span>
                    {label && <span className="text-gray-400 text-xs">{label}</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <SectionHead icon={<RiBookOpenLine size={28} />} title={t("section_description")} />
              <div className={`text-sm md:text-base text-gray-600 leading-8 whitespace-pre-line overflow-hidden transition-all ${!descExpanded ? "max-h-56" : ""}`}>
                {course.description[locale]}
              </div>
              {!descExpanded && (
                <div className="absolute bottom-0 start-0 end-0 h-32 bg-gradient-to-t from-white from-20% to-white/0 rounded-b-xl flex items-end justify-center pb-2">
                  <button onClick={() => setDescExpanded(true)} className="size-10 flex items-center justify-center shadow-md bg-white border border-gray-100 rounded-xl hover:border-[var(--brand)] transition-colors">
                    <RiAddLine size={16} />
                  </button>
                </div>
              )}
              {descExpanded && (
                <div className="flex justify-center mt-4">
                  <button onClick={() => setDescExpanded(false)} className="size-10 flex items-center justify-center shadow-md bg-white border border-gray-100 rounded-xl hover:border-[var(--brand)] transition-colors">
                    <RiSubtractLine size={16} />
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <SectionHead icon={<RiBookOpenLine size={28} />} title={t("section_curriculum")} />
              {loadingSections ? (
                <div className="space-y-4 sm:space-y-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Sk key={i} className="h-12 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5">
                  {allSections.map((sec) => (
                    <ChapterRow key={sec.id} section={sec} courseSlug={courseSlug} t={t} locale={locale} />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <SectionHead icon={<RiMessageLine size={28} />} title={t("section_support")} />
              <p className="text-sm sm:text-base text-gray-600 leading-7 mb-1">{t("support_body")}</p>
              <div className="flex items-center gap-x-3 mt-5">
                <div className="size-12 sm:size-14 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
                  <RiMessageLine size={24} className="text-[var(--brand)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-semibold text-[var(--ink)]">{t("support_ticket")}</span>
                  <span className="text-xs sm:text-sm text-gray-400">{t("support_direct")}</span>
                </div>
              </div>
            </div>

            <ReviewsSection courseId={course.id} courseSlug={courseSlug} t={t} />

          </div>

          <aside className="lg:w-[340px] xl:w-[360px] flex flex-col gap-y-5 shrink-0 lg:sticky lg:top-24 lg:self-start">

            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <div className="flex items-center justify-between text-sm md:text-base mb-4">
                <span className="text-[var(--ink)] font-semibold">{t("progress_label")}</span>
                <span className="text-[var(--brand)] font-bold">{progress?.progressPercent ?? 0}٪</span>
              </div>
              <div className="h-2 bg-[var(--brand)]/10 rounded-full">
                <div
                  className="h-full bg-[var(--brand)] rounded-full transition-all"
                  style={{ width: `${progress?.progressPercent ?? 0}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              {course.instructor.avatarUrl ? (
                <Image
                  src={course.instructor.avatarUrl}
                  alt={course.instructor.name[locale]}
                  width={80} height={80}
                  style={{ width: 80, height: 80 }}
                  className="rounded-full object-cover border-2 border-[var(--brand)]/20 mx-auto"
                />
              ) : (
                <div className="size-20 rounded-full bg-[var(--brand)]/10 flex items-center justify-center mx-auto border-2 border-[var(--brand)]/20">
                  <RiUserLine size={32} className="text-[var(--brand)]" />
                </div>
              )}
              <div className="text-center space-y-1 mt-4">
                <h2 className="font-bold text-base sm:text-lg text-[var(--ink)]">{course.instructor.name[locale]}</h2>
              </div>
              <Link
                href={`/teacher/${course.instructor.slug}`}
                className="flex items-center justify-center gap-x-2 w-full mt-6 h-10 rounded-xl border border-[var(--brand)]/30 text-[var(--brand)] text-sm font-semibold hover:bg-[var(--brand)]/5 transition-colors"
              >
                <RiArrowLeftSLine size={16} />
                {locale === "ar" ? "عرض ملف المدرس" : "استاد کا پروفائل"}
              </Link>
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2.5">
                  <RiShareLine size={20} className="text-[var(--ink)]" />
                  <span className="text-sm md:text-base font-semibold text-[var(--ink)]">{t("share")}</span>
                </div>
                <div className="flex gap-x-2">
                  {["TG", "IG", "X"].map((s) => (
                    <button key={s} className="size-9 flex items-center justify-center bg-gray-400 hover:bg-[var(--brand)] rounded-lg transition-colors text-white text-xs font-bold">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

export default function CourseDetailPage({ courseId }: { courseId: string }) {
  return (
    <Suspense fallback={<CourseDetailSkeleton />}>
      <CourseDetailContent courseSlug={courseId} />
    </Suspense>
  );
}
