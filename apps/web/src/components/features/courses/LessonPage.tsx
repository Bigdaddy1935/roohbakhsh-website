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
  RiBookmarkLine,
  RiListCheck2,
  RiPlayLargeLine,
  RiPauseLargeLine,
  RiVolumeMuteLine,
  RiVolumeUpLine,
  RiFullscreenLine,
  RiFullscreenExitLine,
  RiSettings3Line,
  RiLoader4Line,
} from "react-icons/ri";
import { getCourseDetail, getLessonContext, type Chapter } from "@/data/course-detail.mock";

/* ── Format seconds → m:ss ── */
function fmtTime(s: number) {
  if (!s || isNaN(s) || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/* ══ Native HTML5 Video Player ══ */
function VideoPlayer({ url }: { url: string }) {
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

  /* show/hide controls */
  const revealControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 3000);
  }, []);

  /* fullscreen listener */
  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  /* video event handlers */
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

  const onWaiting = () => setLoading(true);
  const onCanPlay = () => setLoading(false);

  /* controls actions */
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
      {/* Video element */}
      <video
        ref={videoRef}
        src={url}
        className="absolute inset-0 w-full h-full object-contain"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onPlay={() => { setPlaying(true); revealControls(); }}
        onPause={() => { setPlaying(false); setShowControls(true); }}
        onWaiting={onWaiting}
        onCanPlay={onCanPlay}
        onEnded={() => { setPlaying(false); setShowControls(true); }}
        preload="metadata"
      />

      {/* Click overlay to toggle play */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlay}
      />

      {/* Buffering spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <RiLoader4Line size={52} className="text-white/70 animate-spin" />
        </div>
      )}

      {/* Big center play button */}
      {!playing && !loading && showControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="size-20 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
            <RiPlayLargeLine size={36} className="text-white ms-1" />
          </div>
        </div>
      )}

      {/* Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      />

      {/* Controls */}
      <div
        className={`absolute inset-x-0 bottom-0 px-5 pb-4 pt-10 pointer-events-none transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {/* Progress — dir=ltr so bar fills left→right even in RTL pages */}
        <div dir="ltr" className="relative h-1 mb-4 group/bar pointer-events-auto cursor-pointer">
          <div className="absolute inset-0 bg-white/20 rounded-full" />
          <div
            className="absolute inset-y-0 left-0 bg-white/40 rounded-full pointer-events-none"
            style={{ width: `${buffered * 100}%` }}
          />
          <div
            className="absolute inset-y-0 left-0 bg-[var(--brand)] rounded-full pointer-events-none"
            style={{ width: `${progress * 100}%` }}
          />
          <input
            type="range" min={0} max={duration || 1} step={0.5}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 size-3.5 rounded-full bg-white shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none"
            style={{ left: `calc(${progress * 100}% - 7px)` }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-x-4 pointer-events-auto">
          <div className="flex items-center gap-x-4">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-[var(--brand)] transition-colors">
              {playing ? <RiPauseLargeLine size={24} /> : <RiPlayLargeLine size={24} />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-x-2 group/vol">
              <button onClick={toggleMute} className="text-white hover:text-[var(--brand)] transition-colors">
                {muted || volume === 0 ? <RiVolumeMuteLine size={22} /> : <RiVolumeUpLine size={22} />}
              </button>
              <input
                type="range" min={0} max={1} step={0.02}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/vol:w-20 transition-all duration-300 accent-[var(--brand)] cursor-pointer overflow-hidden"
              />
            </div>

            {/* Time */}
            <span className="text-white/80 text-sm font-mono tabular-nums">
              {fmtTime(currentTime)} / {fmtTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-x-3">
            {/* Settings */}
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowSettings((s) => !s); }}
                className={`transition-colors ${showSettings ? "text-[var(--brand)]" : "text-white/60 hover:text-white"}`}
              >
                <RiSettings3Line size={20} />
              </button>
              {showSettings && (
                <div
                  className="absolute bottom-8 end-0 bg-[#1a1a2e]/95 backdrop-blur rounded-lg border border-white/10 shadow-2xl py-2 min-w-[140px] z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-white/50 text-[11px] font-semibold px-3 pb-1.5 border-b border-white/10 mb-1">سرعة التشغيل</p>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        if (videoRef.current) videoRef.current.playbackRate = s;
                        setSpeed(s);
                        setShowSettings(false);
                      }}
                      className={`w-full text-start px-3 py-1.5 text-sm transition-colors ${speed === s ? "text-[var(--brand)] font-semibold" : "text-white/80 hover:text-white hover:bg-white/5"}`}
                    >
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

/* ══ Sidebar chapter accordion ══ */
function SidebarChapter({
  chapter,
  courseId,
  activeLessonId,
  locale,
  defaultOpen,
}: {
  chapter: typeof import("@/data/course-detail.mock").COURSE_DETAILS[string]["chapters"][0];
  courseId: string;
  activeLessonId: string;
  locale: "ar" | "ur";
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-x-2 px-3 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-gray-100 rounded-lg transition-colors select-none"
      >
        <span className="text-start line-clamp-2">{chapter.title[locale]}</span>
        <RiArrowRightSLine
          size={16}
          className={`shrink-0 text-gray-400 transition-transform ${open ? "-rotate-90" : "rotate-90"}`}
        />
      </button>

      {open && (
        <div className="mt-1 flex flex-col gap-y-0.5">
          {chapter.lessons.map((lesson, idx) => {
            const active = lesson.id === activeLessonId;
            return (
              <Link
                key={lesson.id}
                href={`/courses/${courseId}/lessons/${lesson.id}`}
                className={`flex items-center gap-x-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-[var(--brand)]/10 text-[var(--brand)] font-semibold" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <span className="shrink-0 w-5 text-center text-xs font-bold text-gray-400">
                  {idx + 1}
                </span>
                {lesson.free
                  ? <RiPlayCircleLine size={14} className={active ? "text-[var(--brand)] shrink-0" : "text-gray-400 shrink-0"} />
                  : <RiLockLine size={13} className="text-gray-300 shrink-0" />
                }
                <span className="line-clamp-2 flex-1 text-start">{lesson.title[locale]}</span>
                <span className="shrink-0 text-xs text-gray-400">{lesson.duration}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══ MAIN ══ */
export default function LessonPage({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const t = useTranslations("LessonPage");
  const locale = useLocale() as "ar" | "ur";

  const course = getCourseDetail(courseId);
  const ctx = getLessonContext(courseId, lessonId);

  if (!course || !ctx) {
    return <div className="container py-32 text-center text-gray-400">{t("not_found")}</div>;
  }

  const { lesson, chapter, chapterIndex, lessonIndex, prevLesson, nextLesson } = ctx;
  const totalLessons = course.chapters.reduce((s, c) => s + c.lessonCount, 0);

  const videoUrl = lesson.videoUrl ?? "https://dl.poshtybanman.ir/Mahdyar/Daqdaqe-Daq/%D9%82%D8%B3%D9%85%D8%AA%206.mp4";

  return (
    <div className="min-h-screen bg-[var(--bg)]">

      {/* ══ Breadcrumb + Player ══ */}
      <div className="container pt-10 pb-5 px-4">
        {/* Breadcrumb */}
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

        {/* Player */}
        <div className="bg-black shadow-2xl rounded-xl overflow-hidden">
          <VideoPlayer url={videoUrl} />
        </div>
      </div>

      {/* ══ Content below player ══ */}
      <div className="container pb-14">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Main content (RIGHT in RTL) ── */}
          <main className="flex-1 flex flex-col gap-y-4 min-w-0">

            {/* Lesson title card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6">
              <div className="flex items-start gap-x-3 mb-4">
                <span className="shrink-0 size-9 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center font-bold text-sm">
                  {lessonIndex + 1}
                </span>
                <h1 className="text-lg md:text-xl font-bold text-[var(--ink)] leading-snug mt-1">
                  {lesson.title[locale]}
                </h1>
              </div>

              {/* Chapter + duration badge row */}
              <div className="flex items-center gap-x-2 mb-5">
                <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                  {chapter.title[locale]}
                </span>
                <span className="text-xs text-gray-400">{lesson.duration}</span>
              </div>

              {/* Nav row */}
              <div className="flex items-center justify-between gap-x-3 pt-4 border-t border-gray-100">
                {prevLesson ? (
                  <Link
                    href={`/courses/${prevLesson.courseId}/lessons/${prevLesson.id}`}
                    className="flex items-center gap-x-1.5 h-9 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-[var(--ink)] text-sm font-semibold transition-colors"
                  >
                    <RiSkipBackLine size={16} />
                    {t("prev")}
                  </Link>
                ) : <div />}

                <div className="flex items-center gap-x-2">
                  <button
                    className="size-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
                    title={t("mark_done")}
                  >
                    <RiCheckLine size={17} />
                  </button>
                  <button
                    className="size-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
                    title={t("bookmark")}
                  >
                    <RiBookmarkLine size={17} />
                  </button>
                  <button
                    className="size-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
                    title={t("question")}
                  >
                    <RiQuestionLine size={17} />
                  </button>
                </div>

                {nextLesson ? (
                  <Link
                    href={`/courses/${nextLesson.courseId}/lessons/${nextLesson.id}`}
                    className="flex items-center gap-x-1.5 h-9 px-4 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white text-sm font-semibold transition-colors"
                  >
                    {t("next")}
                    <RiSkipForwardLine size={16} />
                  </Link>
                ) : <div />}
              </div>
            </div>

            {/* Q&A */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6">
              <div className="flex items-center gap-x-2.5 mb-5 pb-4 border-b border-gray-100">
                <RiQuestionLine size={20} className="text-[var(--brand)] shrink-0" />
                <h2 className="font-bold text-[var(--ink)]">{t("qa_title")}</h2>
              </div>
              <div className="flex flex-col items-center gap-y-3 py-8 text-center">
                <div className="size-16 rounded-xl bg-gray-100 flex items-center justify-center">
                  <RiQuestionLine size={32} className="text-gray-300" />
                </div>
                <p className="font-semibold text-[var(--ink)]">{t("qa_disabled_title")}</p>
                <p className="text-sm text-gray-400 max-w-sm">{t("qa_disabled_desc")}</p>
              </div>
            </div>
          </main>

          {/* ── Sidebar (LEFT in RTL = second in DOM) ── */}
          <aside className="lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-y-4">

            {/* Lesson list */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-x-2.5 px-4 py-4 border-b border-gray-100">
                <RiListCheck2 size={20} className="text-[var(--brand)] shrink-0" />
                <h2 className="font-bold text-[var(--ink)]">{t("lesson_list")}</h2>
              </div>
              <div className="p-3 max-h-[480px] overflow-y-auto flex flex-col gap-y-1 scrollbar-thin">
                {course.chapters.map((ch, ci) => (
                  <SidebarChapter
                    key={ch.id}
                    chapter={ch}
                    courseId={courseId}
                    activeLessonId={lessonId}
                    locale={locale}
                    defaultOpen={ci === chapterIndex}
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100">
                {[
                  { icon: <RiPlayCircleLine size={22} className="text-[var(--brand)]" />, val: totalLessons.toString(), label: t("total_lessons") },
                  { icon: <RiSkipForwardLine size={22} className="text-[var(--brand)]" />, val: `${course.hoursTotal}`, label: t("course_duration") },
                  { icon: <RiCheckLine size={22} className="text-[var(--brand)]" />, val: t("status_val"), label: t("status_label") },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center gap-y-2 py-6 px-4 text-center">
                    {s.icon}
                    <span className="font-bold text-[var(--ink)]">{s.val}</span>
                    <span className="text-xs text-gray-400 leading-4">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs text-gray-400 text-center mb-3">{t("instructor_label")}</p>
              <div className="flex items-center gap-x-3 mb-3">
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name[locale]}
                  width={48} height={48}
                  style={{ width: 48, height: 48 }}
                  className="rounded-full object-cover border border-gray-100 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-[var(--ink)] text-sm truncate">{course.instructor.name[locale]}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{course.instructor.title[locale]}</p>
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
