"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiArrowRightSLine,
  RiPlayCircleLine,
  RiLockLine,
  RiSkipBackLine,
  RiSkipForwardLine,
  RiCheckLine,
  RiQuestionLine,
  RiListCheck2,
  RiPlayLargeLine,
  RiPauseLargeLine,
  RiVolumeMuteLine,
  RiVolumeUpLine,
  RiFullscreenLine,
  RiFullscreenExitLine,
  RiSettings3Line,
  RiLoader4Line,
  RiUserLine,
  RiHeartFill,
  RiHeartLine,
  RiCloseLine,
  RiReplyLine,
  RiSendPlaneLine,
} from "react-icons/ri";
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

function fmtTime(s: number) {
  if (!s || isNaN(s) || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function fmtDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

/* ══ Native HTML5 Video Player ══ */
function VideoPlayer({ url, onPlay }: { url: string; onPlay?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [speed, setSpeed] = useState(1);

  const revealControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (v.buffered.length > 0)
      setBuffered(v.buffered.end(v.buffered.length - 1) / v.duration);
  };

  const onLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration);
    v.volume = volume;
    setLoading(false);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); setShowControls(true); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setMuted(val === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = val;
    setCurrentTime(val);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await wrapRef.current?.requestFullscreen();
    else await document.exitFullscreen();
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div
      ref={wrapRef}
      onMouseMove={revealControls}
      onMouseLeave={() => { if (playing) setShowControls(false); }}
      className="relative w-full bg-black aspect-video select-none"
    >
      <video
        ref={videoRef}
        src={url}
        className="absolute inset-0 w-full h-full object-contain"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onPlay={() => { setPlaying(true); revealControls(); onPlay?.(); }}
        onPause={() => { setPlaying(false); setShowControls(true); }}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onEnded={() => { setPlaying(false); setShowControls(true); }}
        preload="metadata"
      />

      <div className="absolute inset-0 cursor-pointer" onClick={togglePlay} />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <RiLoader4Line size={52} className="text-white/70 animate-spin" />
        </div>
      )}

      {!playing && !loading && showControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="size-20 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
            <RiPlayLargeLine size={36} className="text-white ms-1" />
          </div>
        </div>
      )}

      <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`} />

      <div className={`absolute inset-x-0 bottom-0 px-5 pb-4 pt-10 pointer-events-none transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}>
        <div dir="ltr" className="relative h-1 mb-4 group/bar pointer-events-auto cursor-pointer">
          <div className="absolute inset-0 bg-white/20 rounded-full" />
          <div className="absolute inset-y-0 left-0 bg-white/40 rounded-full pointer-events-none" style={{ width: `${buffered * 100}%` }} />
          <div className="absolute inset-y-0 left-0 bg-[var(--brand)] rounded-full pointer-events-none" style={{ width: `${progress * 100}%` }} />
          <input type="range" min={0} max={duration || 1} step={0.5} value={currentTime} onChange={handleSeek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <div className="absolute top-1/2 -translate-y-1/2 size-3.5 rounded-full bg-white shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none" style={{ left: `calc(${progress * 100}% - 7px)` }} />
        </div>

        <div className="flex items-center justify-between gap-x-4 pointer-events-auto">
          <div className="flex items-center gap-x-4">
            <button onClick={togglePlay} className="text-white hover:text-[var(--brand)] transition-colors">
              {playing ? <RiPauseLargeLine size={24} /> : <RiPlayLargeLine size={24} />}
            </button>
            <div className="flex items-center gap-x-2 group/vol">
              <button onClick={toggleMute} className="text-white hover:text-[var(--brand)] transition-colors">
                {muted || volume === 0 ? <RiVolumeMuteLine size={22} /> : <RiVolumeUpLine size={22} />}
              </button>
              <input type="range" min={0} max={1} step={0.02} value={muted ? 0 : volume} onChange={handleVolumeChange} className="w-0 group-hover/vol:w-20 transition-all duration-300 accent-[var(--brand)] cursor-pointer overflow-hidden" />
            </div>
            <span className="text-white/80 text-sm font-mono tabular-nums">{fmtTime(currentTime)} / {fmtTime(duration)}</span>
          </div>
          <div className="flex items-center gap-x-3">
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowSettings((s) => !s); }} className={`transition-colors ${showSettings ? "text-[var(--brand)]" : "text-white/60 hover:text-white"}`}>
                <RiSettings3Line size={20} />
              </button>
              {showSettings && (
                <div className="absolute bottom-8 end-0 bg-[#1a1a2e]/95 backdrop-blur rounded-lg border border-white/10 shadow-2xl py-2 min-w-[140px] z-10" onClick={(e) => e.stopPropagation()}>
                  <p className="text-white/50 text-[11px] font-semibold px-3 pb-1.5 border-b border-white/10 mb-1">سرعة التشغيل</p>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button key={s} onClick={() => { if (videoRef.current) videoRef.current.playbackRate = s; setSpeed(s); setShowSettings(false); }} className={`w-full text-start px-3 py-1.5 text-sm transition-colors ${speed === s ? "text-[var(--brand)] font-semibold" : "text-white/80 hover:text-white hover:bg-white/5"}`}>
                      {s === 1 ? "عادي (1×)" : `${s}×`}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={toggleFullscreen} className="text-white hover:text-[var(--brand)] transition-colors">
              {fullscreen ? <RiFullscreenExitLine size={22} /> : <RiFullscreenLine size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
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
        className="w-full flex items-center justify-between gap-x-2 px-3 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-gray-100 rounded-lg transition-colors select-none"
      >
        <span className="text-start line-clamp-2">{section.title[locale]}</span>
        <RiArrowRightSLine size={16} className={`shrink-0 text-gray-400 transition-transform ${open ? "-rotate-90" : "rotate-90"}`} />
      </button>
      {open && (
        <div className="mt-1 flex flex-col gap-y-0.5">
          {section.lessons.map((lesson, idx) => {
            const active = lesson.id === activeLessonId;
            return (
              <div key={lesson.id} className="flex items-center gap-x-1.5">
                <Link
                  href={`/courses/${courseSlug}/lessons/${lesson.id}`}
                  className={`flex items-center gap-x-2.5 px-3 py-2 rounded-lg text-sm transition-colors flex-1 min-w-0 ${active ? "bg-[var(--brand)]/10 text-[var(--brand)] font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <span className="shrink-0 w-5 text-center text-xs font-bold text-gray-400">{idx + 1}</span>
                  {lesson.isFreePreview
                    ? <RiPlayCircleLine size={14} className={active ? "text-[var(--brand)] shrink-0" : "text-gray-400 shrink-0"} />
                    : <RiLockLine size={13} className="text-gray-300 shrink-0" />
                  }
                  <span className="line-clamp-2 flex-1 text-start">{lesson.title[locale]}</span>
                  <span className="shrink-0 text-xs text-gray-400">{fmtDuration(lesson.durationMinutes)}</span>
                </Link>
                <LessonFavoriteButton lessonId={lesson.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
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

function QASection({ lessonId, t }: { lessonId: string; t: (k: string) => string }) {
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6">
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-x-2.5">
          <RiQuestionLine size={20} className="text-[var(--brand)] shrink-0" />
          <h2 className="font-bold text-[var(--ink)]">{t("qa_title")}</h2>
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
        <div className="flex flex-col gap-y-3 mb-6 p-4 rounded-lg bg-gray-50 border border-gray-100">
          <div className="flex items-center justify-end">
            <button type="button" onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <RiCloseLine size={20} />
            </button>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder={t("review_placeholder")}
            className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[var(--brand)] transition-colors resize-y"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={createReview.isPending}
            className="self-end flex items-center gap-x-2 h-10 px-5 rounded-lg bg-[var(--brand)] text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-60 cursor-pointer"
          >
            {createReview.isPending && <RiLoader4Line size={16} className="animate-spin" />}
            {t("submit_review")}
          </button>
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
        <div className="flex flex-col items-center gap-y-3 py-8 text-center">
          <div className="size-16 rounded-xl bg-gray-100 flex items-center justify-center">
            <RiQuestionLine size={32} className="text-gray-300" />
          </div>
          <p className="font-semibold text-[var(--ink)]">{t("no_reviews_yet")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-lg border border-gray-100 p-4">
              <div className="flex items-start gap-x-3">
                {r.user.avatarUrl ? (
                  <Image
                    src={r.user.avatarUrl}
                    alt={r.user.fullName}
                    width={40} height={40}
                    style={{ width: 40, height: 40 }}
                    className="rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="size-10 rounded-full bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
                    <RiUserLine size={18} className="text-[var(--brand)]" />
                  </div>
                )}
                <div className="flex flex-col gap-y-1 min-w-0">
                  <div className="flex items-center gap-x-2.5">
                    <span className="text-sm font-semibold text-[var(--ink)]">{r.user.fullName}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${r.isStudent ? "bg-[var(--brand)]/10 text-[var(--brand)]" : "bg-gray-100 text-gray-400"}`}>
                      {r.isStudent ? t("student_label") : t("user_label")}
                    </span>
                  </div>
                  {r.comment && <p className="text-sm text-gray-500 leading-7">{r.comment}</p>}
                  <div className="flex items-center gap-x-2">
                    <span className="text-[11px] text-gray-300">{r.createdAt.slice(0, 10)}</span>
                    {!r.isApproved && (isAdmin || (me && r.userId === me.id)) && (
                      <span className="text-[11px] text-gray-400">· {t("review_pending_notice")}</span>
                    )}
                  </div>
                </div>
              </div>

              {r.instructorReply && (
                <div className="flex items-start gap-x-3 mt-4 ms-6 sm:ms-10 ps-3.5 border-s-2 border-[var(--brand)]/30">
                  <div className="size-8 rounded-full bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
                    <RiCheckLine size={16} className="text-[var(--brand)]" />
                  </div>
                  <div className="flex flex-col gap-y-1 min-w-0">
                    <span className="text-xs font-semibold text-[var(--brand)]">{t("reply_label")}</span>
                    <p className="text-sm text-gray-500 leading-7">{r.instructorReply}</p>
                    {r.repliedAt && <span className="text-[11px] text-gray-300">{r.repliedAt.slice(0, 10)}</span>}
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

export default function LessonPage({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const t = useTranslations("LessonPage");
  const locale = useLocale() as "ar" | "ur";

  const isAuthed = typeof window !== "undefined" && !!tokenStore.getAccess();

  const { data: course, isLoading: loadingCourse } = useCourse(courseId);
  const { data: sections, isLoading: loadingSections } = useCourseSections(courseId);
  const { data: progress } = useCourseProgress(courseId);
  const watchLesson = useWatchLesson();
  const { data: favorites } = useMyFavorites();
  const toggleFavorite = useToggleFavorite();

  if (loadingCourse || loadingSections) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RiLoader4Line size={36} className="text-[var(--brand)] animate-spin" />
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
        <div className="size-16 rounded-xl bg-gray-100 flex items-center justify-center">
          <RiLockLine size={32} className="text-gray-300" />
        </div>
        <p className="font-bold text-[var(--ink)]">{t("locked_title")}</p>
        <p className="text-sm text-gray-400 max-w-sm">{t("locked_desc")}</p>
        <Link
          href={`/courses/${courseId}`}
          className="flex items-center gap-x-1.5 h-10 px-5 rounded-xl bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
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

        <div className="bg-black shadow-2xl rounded-xl overflow-hidden">
          {videoUrl ? (
            <VideoPlayer url={videoUrl} onPlay={() => isAuthed && watchLesson.mutate({ lessonId: lesson.id, courseSlug: courseId })} />
          ) : (
            <div className="aspect-video flex items-center justify-center text-white/50 text-sm">
              {t("no_video")}
            </div>
          )}
        </div>
      </div>

      <div className="container pb-14">
        <div className="flex flex-col lg:flex-row gap-8">

          <main className="flex-1 flex flex-col gap-y-4 min-w-0">

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6">
              <div className="flex items-start gap-x-3 mb-4">
                <span className="shrink-0 size-9 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center font-bold text-sm">
                  {lessonIndex + 1}
                </span>
                <h1 className="text-lg md:text-xl font-bold text-[var(--ink)] leading-snug mt-1">
                  {lesson.title[locale]}
                </h1>
              </div>

              <div className="flex items-center gap-x-2 mb-5">
                <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                  {activeSection.title[locale]}
                </span>
                <span className="text-xs text-gray-400">{fmtDuration(lesson.durationMinutes)}</span>
              </div>

              <div className="flex items-center justify-between gap-x-3 pt-4 border-t border-gray-100">
                {prevLesson ? (
                  <Link
                    href={`/courses/${prevLesson.courseSlug}/lessons/${prevLesson.id}`}
                    className="flex items-center gap-x-1.5 h-9 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-[var(--ink)] text-sm font-semibold transition-colors"
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
                    className={`size-9 rounded-xl border flex items-center justify-center transition-colors disabled:opacity-60 cursor-pointer ${
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
                    className="size-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-rose-300 hover:text-rose-500 transition-colors disabled:opacity-60 cursor-pointer"
                    title={t("bookmark")}
                  >
                    {isLessonFavorite ? <RiHeartFill size={17} className="text-rose-500" /> : <RiHeartLine size={17} />}
                  </button>
                  <button className="size-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors" title={t("question")}>
                    <RiQuestionLine size={17} />
                  </button>
                </div>

                {nextLesson ? (
                  <Link
                    href={`/courses/${nextLesson.courseSlug}/lessons/${nextLesson.id}`}
                    className="flex items-center gap-x-1.5 h-9 px-4 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white text-sm font-semibold transition-colors"
                  >
                    {t("next")}
                    <RiSkipForwardLine size={16} />
                  </Link>
                ) : <div />}
              </div>
            </div>

            <QASection lessonId={lesson.id} t={t} />
          </main>

          <aside className="lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-y-4">

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
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

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100">
                {[
                  { icon: <RiPlayCircleLine size={22} className="text-[var(--brand)]" />, val: totalLessons.toString(), label: t("total_lessons") },
                  { icon: <RiSkipForwardLine size={22} className="text-[var(--brand)]" />, val: `${hoursTotal}h`, label: t("course_duration") },
                  { icon: <RiCheckLine size={22} className="text-[var(--brand)]" />, val: isAuthed ? `${progress?.progressPercent ?? 0}%` : "—", label: t("status_label") },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-y-2 py-6 px-4 text-center">
                    {s.icon}
                    <span className="font-bold text-[var(--ink)]">{s.val}</span>
                    <span className="text-xs text-gray-400 leading-4">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-400 text-center mb-3">{t("instructor_label")}</p>
              <div className="flex items-center gap-x-3 mb-3">
                {course.instructor.avatarUrl ? (
                  <Image
                    src={course.instructor.avatarUrl}
                    alt={course.instructor.name[locale]}
                    width={48} height={48}
                    style={{ width: 48, height: 48 }}
                    className="rounded-full object-cover border border-gray-100 shrink-0"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-[var(--brand)]/10 flex items-center justify-center border border-gray-100 shrink-0">
                    <RiUserLine size={20} className="text-[var(--brand)]" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-[var(--ink)] text-sm truncate">{course.instructor.name[locale]}</p>
                </div>
              </div>
              <Link
                href={`/courses/${courseId}`}
                className="flex items-center justify-center gap-x-1.5 w-full h-9 rounded-xl border border-[var(--brand)]/30 text-[var(--brand)] text-sm font-semibold hover:bg-[var(--brand)]/5 transition-colors"
              >
                {t("all_lessons")}
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
