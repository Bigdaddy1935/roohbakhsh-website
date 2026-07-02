"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiArrowRightSLine,
  RiArrowLeftSLine,
  RiPlayCircleLine,
  RiLockLine,
  RiSkipBackLine,
  RiSkipForwardLine,
  RiCheckLine,
  RiQuestionLine,
  RiListCheck2,
  RiTimeLine,
  RiBarChartLine,
  RiLoader4Line,
  RiUserLine,
  RiHeartFill,
  RiHeartLine,
  RiCloseLine,
  RiReplyLine,
  RiSendPlaneLine,
} from "react-icons/ri";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { toast } from "sonner";
import { useCourse, useCourseSections } from "@/hooks/queries/use-courses";
import { useCourseProgress, useWatchLesson } from "@/hooks/queries/use-progress";
import { useMyFavorites, useToggleFavorite } from "@/hooks/queries/use-favorites";
import {
  useLessonReviews, useCreateLessonReview,
  useApproveReview, useRejectReview, useReplyToReview, usePendingReviews,
} from "@/hooks/queries/use-reviews";
import { useMe } from "@/hooks/queries/use-auth";
import { tokenStore } from "@/lib/api-client";
import type { SectionRecord, Lesson, ReviewRecord } from "@roohbakhsh/shared";

function LessonFavoriteButton({ lessonId }: { lessonId: string }) {
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
    >
      {isFavorite ? <RiHeartFill size={14} className="text-rose-500" /> : <RiHeartLine size={14} />}
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

function LessonSkeletonBox({ className }: { className: string }) {
  return <div className={`bg-gray-100 animate-pulse rounded-md ${className}`} />;
}

function SidebarChapter({
  section, courseSlug, activeLessonId, locale, defaultOpen,
}: {
  section: SectionRecord; courseSlug: string; activeLessonId: string; locale: "ar" | "ur"; defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-x-2 px-3 py-2.5 text-sm font-semibold rounded-md transition-colors select-none ${open ? "bg-black/75 text-white hover:bg-black/80" : "text-[var(--ink)] hover:bg-gray-100"}`}
      >
        <span className="text-start line-clamp-2">{section.title[locale]}</span>
        <RiArrowRightSLine size={16} className={`shrink-0 text-gray-400 transition-transform ${open ? "-rotate-90" : "rotate-90"}`} />
      </button>
      {open && (
        <div className="mt-2 flex flex-col gap-y-0.5">
          {section.lessons.map((lesson, idx) => {
            const active = lesson.id === activeLessonId;
            const locked = !lesson.isFreePreview;
            const itemClass = `flex items-center gap-x-2.5 px-3 py-2 rounded-md text-sm transition-colors flex-1 min-w-0 ${active ? "bg-[var(--brand)]/10 text-[var(--brand)] font-semibold" : locked ? "text-gray-400 cursor-default" : "text-gray-600 hover:bg-gray-100"}`;
            return (
              <div key={lesson.id} className="flex items-center gap-x-1.5">
                {locked ? (
                  <div className={itemClass}>
                    <span className="shrink-0 w-5 text-center text-xs font-bold text-gray-300">{idx + 1}</span>
                    <RiLockLine size={13} className="text-gray-300 shrink-0" />
                    <span className="line-clamp-2 flex-1 text-start">{lesson.title[locale]}</span>
                    <span className="shrink-0 text-xs text-gray-300">{fmtDuration(lesson.durationMinutes)}</span>
                  </div>
                ) : (
                  <Link href={`/courses/${courseSlug}/lessons/${lesson.id}`} className={itemClass}>
                    <span className="shrink-0 w-5 text-center text-xs font-bold text-gray-400">{idx + 1}</span>
                    <RiPlayCircleLine size={14} className={active ? "text-[var(--brand)] shrink-0" : "text-gray-400 shrink-0"} />
                    <span className="line-clamp-2 flex-1 text-start">{lesson.title[locale]}</span>
                    <span className="shrink-0 text-xs text-gray-400">{fmtDuration(lesson.durationMinutes)}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AdminReviewActions({ review, courseSlug, t }: { review: ReviewRecord; courseSlug: string; t: (k: string) => string }) {
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
      { courseSlug, reviewId: review.id, reply: reply.trim() },
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

function QASection({ lessonId, courseSlug, t }: { lessonId: string; courseSlug: string; t: (k: string) => string }) {
  const locale = useLocale() as "ar" | "ur";
  const { data, isLoading } = useLessonReviews(lessonId, { limit: 10 });
  const { data: me } = useMe();
  const isAdmin = me?.role === "admin";
  const { data: pendingData } = usePendingReviews({ limit: 100 });
  const createReview = useCreateLessonReview();
  const [formOpen, setFormOpen] = useState(false);
  const [comment, setComment] = useState("");

  const approvedReviews = data?.items ?? [];
  const pendingForLesson = isAdmin
    ? (pendingData?.items ?? []).filter((p) => p.target.type === "lesson" && p.target.id === lessonId)
    : [];
  const reviewMap = new Map<string, (typeof approvedReviews)[number]>();
  for (const r of approvedReviews) reviewMap.set(r.id, r);
  for (const r of pendingForLesson) reviewMap.set(r.id, r);
  const reviews = [...reviewMap.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const isAuthed = typeof window !== "undefined" && !!tokenStore.getAccess();

  function handleSubmit() {
    if (!comment.trim()) return;
    createReview.mutate(
      { lessonId, comment: comment.trim() },
      {
        onSuccess: () => {
          toast.success(t("review_submitted_toast"));
          setFormOpen(false);
          setComment("");
        },
        onError: () => {
          toast.error(t("review_submit_error_toast"));
        },
      },
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 md:p-6">
      {isAuthed && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-x-2.5">
            <RiQuestionLine size={20} className="text-[var(--brand)] shrink-0" />
            <h2 className="font-bold text-[var(--ink)]">{t("qa_title")}</h2>
          </div>
          {!formOpen && (
            <button
              type="button"
              onClick={() => setFormOpen(true)}
              className="text-sm font-semibold text-[var(--brand)] hover:underline cursor-pointer"
            >
              {t("write_review")}
            </button>
          )}
        </div>
      )}

      {!isAuthed && (
        <div className="flex items-center justify-between gap-x-2.5 mb-6 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200">
          <div className="flex items-center gap-x-2.5">
            <RiLockLine size={18} className="text-rose-500 shrink-0" />
            <span className="text-sm font-semibold text-rose-500">{t("login_required_toast")}</span>
          </div>
          <Link href="/signup" className="text-sm font-bold text-[var(--brand)] hover:underline shrink-0">
            {t("register_link_text")}
          </Link>
        </div>
      )}

      {formOpen && (
        <div className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder={t("review_placeholder")}
            className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors resize-none mb-3"
          />
          <div className="flex items-center justify-end gap-x-2.5">
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
              <div className="size-10 rounded-full bg-gray-100 animate-pulse shrink-0" />
              <div className="flex flex-col gap-y-1.5 w-full">
                <div className="h-3.5 w-32 bg-gray-100 rounded-md animate-pulse" />
                <div className="h-3.5 w-full bg-gray-100 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-y-4 py-10 text-center">
          <div className="size-20 rounded-full bg-[var(--brand)]/8 flex items-center justify-center">
            <RiQuestionLine size={36} className="text-[var(--brand)]/50" />
          </div>
          <div className="space-y-1.5">
            <p className="font-bold text-[var(--ink)]">{t("no_reviews_yet")}</p>
            <p className="text-sm text-gray-400">{locale === "ar" ? "كن أول من يطرح سؤالاً" : "پہلا سوال آپ پوچھیں"}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {reviews.map((r, idx) => (
            <div key={r.id} className={`px-4 py-5 bg-white min-h-[120px] ${idx < reviews.length - 1 ? "border-b border-gray-100" : ""}`}>
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
                </div>
              </div>
              {r.comment && <p className="text-sm font-medium text-gray-600 leading-7 mt-4 ps-[50px]">{r.comment}</p>}

              {r.instructorReply && (
                <div className="flex items-start gap-x-3 mt-6 ms-6 sm:ms-10 ps-3.5 border-s-2 border-sky-300">
                  <div className="size-8 rounded-full bg-sky-50 flex items-center justify-center shrink-0">
                    <RiReplyLine size={16} className="text-sky-500" />
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

              {isAdmin && <AdminReviewActions review={r} courseSlug={courseSlug} t={t} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LessonPage({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const t = useTranslations("LessonPage");
  const locale = useLocale() as "ar" | "ur";

  const isAuthed = typeof window !== "undefined" && !!tokenStore.getAccess();
  const qaRef = useRef<HTMLDivElement>(null);

  const { data: course, isLoading: loadingCourse } = useCourse(courseId);
  const { data: sections, isLoading: loadingSections } = useCourseSections(courseId);
  const { data: progress } = useCourseProgress(courseId);
  const watchLesson = useWatchLesson();
  const { data: favorites } = useMyFavorites();
  const toggleFavorite = useToggleFavorite();

  if (loadingCourse || loadingSections) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        {/* breadcrumb + player */}
        <div className="container pt-10 pb-5 px-4">
          <div className="flex items-center gap-x-2 mb-7">
            <LessonSkeletonBox className="h-4 w-16" /><LessonSkeletonBox className="h-4 w-4" /><LessonSkeletonBox className="h-4 w-24" /><LessonSkeletonBox className="h-4 w-4" /><LessonSkeletonBox className="h-4 w-32" />
          </div>
          <LessonSkeletonBox className="w-full aspect-video rounded-lg" />
        </div>

        <div className="container pb-14 pt-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* main */}
            <main className="flex-1 flex flex-col gap-y-3 min-w-0">
              {/* lesson info card */}
              <div className="bg-white rounded-lg border border-gray-100 p-5 md:p-6">
                <div className="flex items-start gap-x-3 mb-4">
                  <LessonSkeletonBox className="size-9 rounded-lg shrink-0" />
                  <LessonSkeletonBox className="h-6 flex-1 mt-1" />
                </div>
                <div className="flex gap-x-2 mb-5">
                  <LessonSkeletonBox className="h-6 w-24 rounded-full" />
                  <LessonSkeletonBox className="h-6 w-12 rounded-full" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <LessonSkeletonBox className="h-9 w-24 rounded-lg" />
                  <div className="flex gap-x-2">
                    <LessonSkeletonBox className="size-9 rounded-lg" />
                    <LessonSkeletonBox className="size-9 rounded-lg" />
                    <LessonSkeletonBox className="size-9 rounded-lg" />
                  </div>
                  <LessonSkeletonBox className="h-9 w-24 rounded-lg" />
                </div>
              </div>
              {/* QA section */}
              <div className="bg-white rounded-lg border border-gray-100 p-5">
                <LessonSkeletonBox className="h-5 w-36 mb-5" />
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-x-3 py-5 border-b border-gray-100 last:border-0">
                    <LessonSkeletonBox className="size-[38px] rounded-full shrink-0" />
                    <div className="flex flex-col gap-y-2 flex-1">
                      <LessonSkeletonBox className="h-4 w-28" />
                      <LessonSkeletonBox className="h-4 w-16 rounded-full" />
                    </div>
                    <LessonSkeletonBox className="h-4 w-20 ms-auto" />
                  </div>
                ))}
              </div>
            </main>

            {/* aside */}
            <aside className="lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-y-4">
              {/* lesson list */}
              <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-x-2.5 px-4 py-4 border-b border-gray-100">
                  <LessonSkeletonBox className="size-5 rounded" />
                  <LessonSkeletonBox className="h-5 w-28" />
                </div>
                <div className="p-3 flex flex-col gap-y-1.5">
                  <LessonSkeletonBox className="h-9 w-full rounded-md" />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <LessonSkeletonBox key={i} className="h-8 w-full rounded-md" />
                  ))}
                </div>
              </div>
              {/* stats */}
              <div className="bg-white rounded-lg border border-gray-100">
                <div className="grid grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`flex flex-col items-center gap-y-2 py-5 px-3${i < 2 ? " border-e border-gray-100" : ""}`}>
                      <LessonSkeletonBox className="size-9 rounded-lg" />
                      <LessonSkeletonBox className="h-4 w-10" />
                      <LessonSkeletonBox className="h-3 w-14" />
                    </div>
                  ))}
                </div>
              </div>
              {/* instructor */}
              <div className="bg-white rounded-lg border border-gray-100 p-5 flex flex-col items-center gap-y-3">
                <LessonSkeletonBox className="size-20 rounded-full" />
                <LessonSkeletonBox className="h-5 w-36" />
                <LessonSkeletonBox className="h-10 w-full rounded-lg mt-2" />
              </div>
            </aside>

          </div>
        </div>
      </div>
    );
  }

  if (!course || !sections) {
    return <div className="container py-32 text-center text-gray-400">{t("not_found")}</div>;
  }

  // Find lesson and its section
  let lesson: Lesson | null = null;
  let activeSection: SectionRecord | null = null;
  let sectionIndex = 0;
  let lessonIndex = 0;
  let prevLesson: { id: string; courseSlug: string } | null = null;
  let nextLesson: { id: string; courseSlug: string } | null = null;

  const allLessons: { lesson: Lesson; sectionIdx: number; lessonIdx: number }[] = [];
  sections.forEach((sec, si) => {
    sec.lessons.forEach((les, li) => {
      allLessons.push({ lesson: les, sectionIdx: si, lessonIdx: li });
    });
  });

  const flatIdx = allLessons.findIndex((x) => x.lesson.id === lessonId);
  const found = flatIdx !== -1 ? allLessons[flatIdx] : undefined;
  if (found) {
    lesson = found.lesson;
    activeSection = sections[found.sectionIdx] ?? null;
    sectionIndex = found.sectionIdx;
    lessonIndex = found.lessonIdx;
    const prev = flatIdx > 0 ? allLessons[flatIdx - 1] : undefined;
    const next = flatIdx < allLessons.length - 1 ? allLessons[flatIdx + 1] : undefined;
    if (prev) prevLesson = { id: prev.lesson.id, courseSlug: courseId };
    if (next) nextLesson = { id: next.lesson.id, courseSlug: courseId };
  }

  if (!lesson || !activeSection) {
    return <div className="container py-32 text-center text-gray-400">{t("not_found")}</div>;
  }

  if (!lesson.isFreePreview) {
    return (
      <div className="container py-32 flex flex-col items-center text-center gap-y-4">
        <div className="size-16 rounded-lg bg-gray-100 flex items-center justify-center">
          <RiLockLine size={32} className="text-gray-300" />
        </div>
        <p className="font-bold text-[var(--ink)]">{t("locked_title")}</p>
        <p className="text-sm text-gray-400 max-w-sm">{t("locked_desc")}</p>
        <Link
          href={`/courses/${courseId}`}
          className="flex items-center gap-x-1.5 h-10 px-5 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {t("back_to_course")}
        </Link>
      </div>
    );
  }

  const totalLessons = allLessons.length;
  const hoursTotal = Math.round(course.durationMinutes / 60 * 10) / 10;
  const videoUrl = lesson.videoUrl[locale] ?? lesson.videoUrl.ar ?? lesson.videoUrl.ur;

  const isLessonFavorite = !!favorites?.some((f) => f.type === "lesson" && f.id === lesson.id);
  const isLessonWatched = !!progress?.watchedLessonIds?.includes(lesson.id);

  function handleMarkDone() {
    if (!isAuthed) {
      toast.error(t("login_required_toast"));
      return;
    }
    if (!lesson) return;
    watchLesson.mutate(
      { lessonId: lesson.id, courseSlug: courseId },
      { onSuccess: () => toast.success(t("mark_done_toast")) },
    );
  }

  function handleToggleFavorite() {
    if (!isAuthed) {
      toast.error(t("login_required_toast"));
      return;
    }
    if (!lesson) return;
    toggleFavorite.mutate({ type: "lesson", id: lesson.id });
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">

      <div className="container pt-10 pb-5 px-4">
        <nav className="flex items-center gap-x-2 text-sm text-gray-400 mb-7 overflow-x-hidden">
          <Link href="/" className="text-nowrap hover:text-[var(--brand)] transition-colors">{t("breadcrumb_home")}</Link>
          <RiArrowRightSLine size={14} className="rotate-180 text-gray-300 shrink-0" />
          <Link href="/courses" className="text-nowrap hover:text-[var(--brand)] transition-colors">{t("breadcrumb_courses")}</Link>
          <RiArrowRightSLine size={14} className="rotate-180 text-gray-300 shrink-0" />
          <Link href={`/courses/${courseId}`} className="text-nowrap hover:text-[var(--brand)] transition-colors max-w-[160px] truncate">
            {course.title[locale]}
          </Link>
          <RiArrowRightSLine size={14} className="rotate-180 text-gray-300 shrink-0" />
          <span className="text-[var(--ink)] font-semibold truncate max-w-[160px]">{lesson.title[locale]}</span>
        </nav>

        <div className="bg-black rounded-lg overflow-hidden">
          {videoUrl ? (
            <VideoPlayer
              url={videoUrl}
              poster={course.thumbnailUrl?.[locale] ?? course.thumbnailUrl?.ar ?? undefined}
              onPlay={() => isAuthed && watchLesson.mutate({ lessonId: lesson.id, courseSlug: courseId })}
            />
          ) : (
            <div className="aspect-video flex items-center justify-center text-white/50 text-sm">
              {t("no_video")}
            </div>
          )}
        </div>
      </div>

      <div className="container pb-14 pt-8">
        <div className="flex flex-col lg:flex-row gap-8">

          <main className="flex-1 flex flex-col gap-y-3 min-w-0">

            <div className="bg-white rounded-lg border border-gray-100 p-5 md:p-6">
              {/* title row */}
              <div className="flex items-start gap-x-3 mb-3">
                <span className="shrink-0 size-9 rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center font-bold text-sm">
                  {lessonIndex + 1}
                </span>
                <h1 className="text-lg md:text-xl font-bold text-[var(--ink)] leading-snug mt-1">
                  {lesson.title[locale]}
                </h1>
              </div>
              {/* meta tags */}
              <div className="flex items-center gap-x-2 ps-12 mb-5">
                <span className="text-xs font-semibold bg-[var(--brand)]/8 text-[var(--brand)] px-3 py-1 rounded-full">
                  {activeSection.title[locale]}
                </span>
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{fmtDuration(lesson.durationMinutes)}</span>
              </div>
              {/* actions */}
              <div className="flex items-center justify-between gap-x-3 pt-4 border-t border-gray-100">
                {prevLesson ? (
                  <Link
                    href={`/courses/${prevLesson.courseSlug}/lessons/${prevLesson.id}`}
                    className="flex items-center gap-x-1.5 h-9 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-[var(--ink)] text-sm font-semibold transition-colors"
                  >
                    <RiSkipBackLine size={16} />
                    {t("prev")}
                  </Link>
                ) : <div />}

                <div className="flex items-center gap-x-2">
                  <button
                    type="button"
                    onClick={handleMarkDone}
                    disabled={watchLesson.isPending}
                    className={`size-9 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-60 cursor-pointer ${
                      isLessonWatched
                        ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                        : "border-gray-200 text-gray-500 hover:border-[var(--brand)] hover:text-[var(--brand)]"
                    }`}
                    title={t("mark_done")}
                  >
                    <RiCheckLine size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    disabled={toggleFavorite.isPending}
                    className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-rose-300 hover:text-rose-500 transition-colors disabled:opacity-60 cursor-pointer"
                    title={t("bookmark")}
                  >
                    {isLessonFavorite ? <RiHeartFill size={17} className="text-rose-500" /> : <RiHeartLine size={17} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => qaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="size-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors cursor-pointer"
                    title={t("question")}
                  >
                    <RiQuestionLine size={17} />
                  </button>
                </div>

                {nextLesson ? (
                  <Link
                    href={`/courses/${nextLesson.courseSlug}/lessons/${nextLesson.id}`}
                    className="flex items-center gap-x-1.5 h-9 px-4 rounded-lg bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white text-sm font-semibold transition-colors"
                  >
                    {t("next")}
                    <RiSkipForwardLine size={16} />
                  </Link>
                ) : <div />}
              </div>
            </div>

            <div ref={qaRef}>
              <QASection lessonId={lesson.id} courseSlug={courseId} t={t} />
            </div>
          </main>

          <aside className="lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-y-4">

            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-x-2.5 px-4 py-4 border-b border-gray-100">
                <RiListCheck2 size={20} className="text-[var(--brand)] shrink-0" />
                <h2 className="font-bold text-[var(--ink)]">{t("lesson_list")}</h2>
              </div>
              <div className="p-3 max-h-[480px] overflow-y-auto flex flex-col gap-y-1 scrollbar-thin">
                {sections.map((sec, ci) => (
                  <SidebarChapter
                    key={sec.id}
                    section={sec}
                    courseSlug={courseId}
                    activeLessonId={lessonId}
                    locale={locale}
                    defaultOpen={ci === sectionIndex}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100">
              <div className="grid grid-cols-3">
                {[
                  { icon: <RiListCheck2 size={20} className="text-[var(--brand)]" />, val: totalLessons.toString(), label: t("total_lessons") },
                  { icon: <RiTimeLine size={20} className="text-[var(--brand)]" />, val: `${hoursTotal}h`, label: t("course_duration") },
                  { icon: <RiBarChartLine size={20} className="text-[var(--brand)]" />, val: isAuthed ? `${progress?.progressPercent ?? 0}%` : "—", label: t("status_label") },
                ].map((s, i) => (
                  <div key={i} className={`flex flex-col items-center gap-y-2 py-5 px-3 text-center${i < 2 ? " border-e border-gray-100" : ""}`}>
                    <div className="size-9 rounded-lg bg-[var(--brand)]/8 flex items-center justify-center">
                      {s.icon}
                    </div>
                    <span className="font-bold text-sm text-[var(--ink)]">{s.val}</span>
                    <span className="text-xs text-gray-400 leading-4">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-100 p-5">
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
              <div className="text-center mt-4">
                <h2 className="font-bold text-base text-[var(--ink)]">{course.instructor.name[locale]}</h2>
              </div>
              <Link
                href={`/teacher/${course.instructor.slug}`}
                className="flex items-center justify-center gap-x-2 w-full mt-6 h-10 rounded-lg border border-[var(--brand)]/30 text-[var(--brand)] text-sm font-semibold hover:bg-[var(--brand)]/5 transition-colors"
              >
                {t("all_lessons")}
                <RiArrowLeftSLine size={16} />
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
