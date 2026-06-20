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
  RiCheckLine,
  RiAddLine, RiSubtractLine,
} from "react-icons/ri";
import { getCourseDetail, type Chapter } from "@/data/course-detail.mock";

function fmt(n: number) {
  return n.toLocaleString("ar-EG");
}

/* ── Stars ── */
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-x-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <RiStarFill key={s} size={size}
          className={s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"} />
      ))}
    </span>
  );
}

/* ── Section header ── */
function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-x-2.5 mb-5 md:mb-7">
      <span className="text-[var(--brand)] shrink-0">{icon}</span>
      <h2 className="font-bold text-base md:text-lg text-[var(--ink)]">{title}</h2>
    </div>
  );
}

/* ── Chapter accordion ── */
function ChapterRow({ chapter, courseId, t, locale }: {
  chapter: Chapter; courseId: string; t: (k: string) => string; locale: "ar" | "ur";
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <div
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between gap-x-3 px-4 py-3.5 cursor-pointer rounded-lg transition-colors select-none ${open ? "bg-[var(--ink)] text-white" : "bg-gray-100 text-[var(--ink)]"}`}
      >
        <span className="text-sm md:text-base">{chapter.title[locale]}</span>
        <div className="flex items-center gap-x-4 shrink-0">
          <div className={`hidden sm:flex items-center gap-x-2 text-sm ${open ? "text-white/60" : "text-gray-400"}`}>
            <span>{chapter.lessonCount} {t("lesson_count")}</span>
            <span className="size-1 rounded-full bg-current opacity-50" />
            <span>{chapter.duration}</span>
          </div>
          {open
            ? <RiArrowRightSLine size={18} className="-rotate-90" />
            : <RiArrowRightSLine size={18} className="rotate-90" />
          }
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-y-2.5 sm:ps-4 mt-3">
          {chapter.lessons.map((lesson, idx) => (
            <Link key={lesson.id}
              href={`/courses/${courseId}/lessons/${lesson.id}`}
              className="flex items-center justify-between gap-x-4 md:gap-x-6 border border-gray-100 hover:border-[var(--brand)]/40 pe-3.5 ps-1.5 py-3 rounded-lg group transition-colors"
            >
              <div className="flex items-center gap-x-2.5">
                <div className="flex items-center gap-x-0.5 select-none">
                  <span className="w-8 md:w-9 text-sm md:text-base font-bold text-center">{idx + 1}</span>
                  <div className="w-px h-4 bg-gray-100" />
                </div>
                <span className="text-sm md:text-base line-clamp-2">{lesson.title[locale]}</span>
              </div>
              <div className="flex items-center gap-x-2 md:gap-x-3 text-gray-400 group-hover:text-[var(--ink)] shrink-0 transition-colors">
                <span className="text-sm">{lesson.duration}</span>
                {lesson.free
                  ? <RiPlayCircleLine size={18} className="text-[var(--brand)]" />
                  : <RiLockLine size={16} />
                }
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════ MAIN ══════════ */
function CourseDetailContent({ courseId }: { courseId: string }) {
  const t = useTranslations("CourseDetail");
  const locale = useLocale() as "ar" | "ur";
  const [descExpanded, setDescExpanded] = useState(false);

  const course = getCourseDetail(courseId);
  if (!course) return (
    <div className="container py-32 text-center text-gray-400">Course not found.</div>
  );

  const totalLessons = course.chapters.reduce((s, c) => s + c.lessonCount, 0);

  const stats = [
    { icon: <RiCheckboxCircleLine size={40} className="text-[var(--brand)]" />, val: t("status_complete"), label: t("rating") },
    { icon: <RiTimeLine size={40} className="text-[var(--brand)]" />, val: `${course.hoursTotal}`, label: t("hours") },
    { icon: <RiUserLine size={40} className="text-[var(--brand)]" />, val: fmt(course.students), label: t("students") },
    { icon: <RiStarFill size={40} className="text-amber-400" />, val: course.rating.toString(), label: t("rating") },
    { icon: <RiCalendarLine size={40} className="text-[var(--brand)]" />, val: course.updatedAt[locale], label: t("updated") },
    { icon: <RiWifiLine size={40} className="text-[var(--brand)]" />, val: t("watch_mode"), label: "" },
  ];

  return (
    <div className="bg-[var(--bg)] min-h-screen">

      {/* ══ HERO ══ */}
      <div className="container pt-8 sm:pt-10">
        <section className="lg:grid grid-cols-2 gap-x-8 xl:gap-x-14 mb-8 sm:mb-12 lg:mb-16">

          {/* Left col: info */}
          <div className="flex flex-col cursor-default order-2 lg:order-1">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-x-2 text-sm text-gray-400 mb-5 sm:mb-7 overflow-x-auto">
              <Link href="/" className="text-nowrap hover:text-[var(--brand)] transition-colors">{t("breadcrumb_home")}</Link>
              <RiArrowDownSLine size={14} className="-rotate-90 text-gray-300 shrink-0" />
              <Link href="/courses" className="text-nowrap hover:text-[var(--brand)] transition-colors">{t("breadcrumb_courses")}</Link>
              <RiArrowDownSLine size={14} className="-rotate-90 text-gray-300 shrink-0" />
              <span className="text-nowrap text-[var(--ink)] font-semibold truncate max-w-[160px]">{course.title[locale]}</span>
            </nav>

            {/* Mobile image */}
            <Image
              src={course.image} alt={course.title[locale]}
              width={700} height={394}
              className="block lg:hidden w-full md:w-2/3 mx-auto rounded-xl aspect-video object-cover mb-5 sm:mb-6"
            />

            <div className="flex flex-col gap-y-3 md:text-center lg:text-start">
              <h1 className="text-2xl md:text-3xl xl:text-4xl font-extrabold text-[var(--ink)]">{course.title[locale]}</h1>
              <p className="text-sm md:text-base text-gray-500 leading-7 line-clamp-3">
                {course.description[locale].split("\n")[0]}
              </p>
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-auto">
              {/* Discount banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-y-2 py-3 px-5 md:px-6 mb-5 bg-white rounded-xl border border-gray-100">
                <span className="text-sm md:text-base font-bold text-rose-500 flex items-center gap-x-1.5">
                  <RiGiftLine size={16} />
                  {course.discountPct}٪ {t("discount_badge")}
                </span>
                <div className="flex items-center gap-x-4 text-sm md:text-base text-gray-500">
                  <span>{course.hoursTotal} {t("hours")}</span>
                  <span className="w-px h-4 bg-gray-200" />
                  <span>{totalLessons} {t("lessons")}</span>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex items-end justify-between gap-x-4">
                <Link href="/cart"
                  className="flex items-center justify-center gap-x-2 h-12 px-6 rounded-xl bg-[var(--brand)] text-white font-bold text-sm md:text-base hover:opacity-90 active:scale-[0.98] transition-all shrink-0">
                  <RiShoppingCartLine size={18} />
                  {t("add_to_cart")}
                </Link>
                <div className="flex items-end flex-col sm:flex-row gap-x-2.5 gap-y-0.5">
                  <span className="text-base md:text-2xl text-gray-300 line-through">
                    {fmt(course.originalPrice)}
                  </span>
                  <div className="flex items-center gap-x-1">
                    <span className="text-lg md:text-2xl font-extrabold text-[var(--ink)]">
                      {fmt(course.discountedPrice)}
                    </span>
                    <span className="text-xs md:text-sm text-gray-400">{t("currency")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right col: desktop image */}
          <div className="hidden lg:block order-1 lg:order-2">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900">
              <Image
                src={course.image} alt={course.title[locale]}
                fill className="object-cover opacity-90"
                sizes="50vw" priority
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <RiPlayCircleLine size={36} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ══ BODY ══ */}
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* ── Main Content ── */}
          <div className="flex flex-col gap-y-6 md:gap-y-8 lg:grow min-w-0">

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {stats.map(({ icon, val, label }, i) => (
                <div key={i}
                  className="flex flex-col md:flex-row items-center gap-x-4 gap-y-2 bg-white py-4 md:px-6 rounded-xl cursor-default border border-gray-50">
                  <span className="shrink-0">{icon}</span>
                  <div className="flex flex-col items-center md:items-start text-center md:text-start gap-y-0.5 text-sm md:text-base">
                    <span className="font-bold text-[var(--ink)]">{val}</span>
                    {label && <span className="text-gray-400 text-xs md:text-sm">{label}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="relative bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <SectionHead icon={<RiBookOpenLine size={28} />} title={t("section_description")} />
              <div className={`text-sm md:text-base text-gray-600 leading-8 whitespace-pre-line overflow-hidden transition-all ${!descExpanded ? "max-h-56" : ""}`}>
                {course.description[locale]}
              </div>
              {!descExpanded && (
                <div className="absolute bottom-0 start-0 end-0 h-32 bg-gradient-to-t from-white from-20% to-white/0 rounded-b-xl flex items-end justify-center pb-2">
                  <button
                    onClick={() => setDescExpanded(true)}
                    className="size-10 flex items-center justify-center shadow-md bg-white border border-gray-100 rounded-xl hover:border-[var(--brand)] transition-colors"
                  >
                    <RiAddLine size={16} />
                  </button>
                </div>
              )}
              {descExpanded && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setDescExpanded(false)}
                    className="size-10 flex items-center justify-center shadow-md bg-white border border-gray-100 rounded-xl hover:border-[var(--brand)] transition-colors"
                  >
                    <RiSubtractLine size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Curriculum */}
            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <SectionHead icon={<RiBookOpenLine size={28} />} title={t("section_curriculum")} />
              <div className="space-y-4 sm:space-y-5">
                {course.chapters.map((ch) => (
                  <ChapterRow key={ch.id} chapter={ch} courseId={courseId} t={t} locale={locale} />
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <SectionHead icon={<RiCheckboxCircleLine size={28} />} title={t("section_prerequisites")} />
              <div className="flex items-center gap-x-4 sm:gap-x-6 gap-y-3 flex-wrap text-sm sm:text-base">
                {course.prerequisites.map((p, i) => (
                  <div key={i} className="flex items-center gap-x-2">
                    <RiCheckLine size={16} className="text-[var(--brand)] shrink-0" />
                    <span>{p[locale]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support */}
            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <SectionHead icon={<RiMessageLine size={28} />} title={t("section_support")} />
              <div>
                <p className="text-sm sm:text-base text-gray-600 leading-7 mb-1">
                  {t("support_body")}
                </p>
              </div>
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

            {/* Reviews */}
            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <div className="flex items-center justify-between flex-wrap gap-y-3 gap-x-2 mb-5 md:mb-7">
                <div className="flex items-center gap-x-2.5 md:gap-x-3">
                  <span className="text-[var(--brand)]"><RiMessageLine size={28} /></span>
                  <h2 className="font-bold text-base md:text-lg text-[var(--ink)]">{t("section_reviews")}</h2>
                </div>
                <button className="flex items-center gap-x-1.5 h-9 px-4 rounded-xl bg-[var(--brand)] text-white text-sm font-bold hover:opacity-90 transition-opacity">
                  <RiAddLine size={15} />
                  {t("write_review")}
                </button>
              </div>

              <div className="space-y-5 sm:space-y-6">
                {course.reviews.map((rev) => (
                  <div key={rev.id} className="p-5 border border-gray-200 rounded-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-100">
                      <div className="flex items-center gap-x-2.5">
                        <div className="size-10 rounded-full bg-[var(--brand)]/10 flex items-center justify-center font-bold text-[var(--brand)] text-sm shrink-0">
                          {rev.author.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-x-2 text-sm">
                            <span className="font-semibold text-[var(--ink)]">{rev.author}</span>
                            <Stars rating={rev.rating} size={12} />
                          </div>
                          <span className="text-xs text-gray-400">{rev.date[locale]}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 leading-7 whitespace-pre-line">{rev.body[locale]}</p>

                    {/* Instructor reply */}
                    {rev.reply && (
                      <div className="p-4 bg-gray-50 rounded-xl mt-4 sm:mt-5">
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
                          <div className="flex items-center gap-x-2.5">
                            <div className="size-10 rounded-full bg-[var(--brand)] flex items-center justify-center shrink-0">
                              <RiUserLine size={16} className="text-white" />
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-x-2 text-sm">
                                <span className="font-semibold text-[var(--brand)]">{rev.reply.author}</span>
                                <span className="text-xs text-gray-400 bg-[var(--brand)]/10 px-1.5 py-0.5 rounded-md">{t("reply_label")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 leading-7 whitespace-pre-line">{rev.reply.body[locale]}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>{/* end main */}

          {/* ── Sidebar (visually left in RTL = comes second in DOM) ── */}
          <aside className="lg:w-[340px] xl:w-[360px] flex flex-col gap-y-5 shrink-0 lg:sticky lg:top-24 lg:self-start">

            {/* Progress */}
            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <div className="flex items-center justify-between text-sm md:text-base mb-4">
                <span className="text-[var(--ink)] font-semibold">{t("progress_label")}</span>
                <span className="text-[var(--brand)] font-bold">99٪</span>
              </div>
              <div className="h-2 bg-[var(--brand)]/10 rounded-full">
                <div className="h-full bg-[var(--brand)] rounded-full w-[99%]" />
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <div className="size-20 mx-auto rounded-full bg-[var(--brand)]/10 flex items-center justify-center border-2 border-[var(--brand)]/20">
                <RiUserLine size={32} className="text-[var(--brand)]" />
              </div>
              <div className="text-center space-y-1 mt-5">
                <h2 className="font-bold text-base sm:text-lg text-[var(--ink)]">
                  {course.instructor.name[locale]}
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  {course.instructor.title[locale]}
                </p>
              </div>
              <button className="flex items-center justify-center gap-x-2 w-full mt-6 h-10 rounded-xl border border-[var(--brand)]/30 text-[var(--brand)] text-sm font-semibold hover:bg-[var(--brand)]/5 transition-colors">
                <RiArrowLeftSLine size={16} />
                {t("share")}
              </button>
            </div>

            {/* Share */}
            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2.5">
                  <RiShareLine size={20} className="text-[var(--ink)]" />
                  <span className="text-sm md:text-base font-semibold text-[var(--ink)]">{t("share")}</span>
                </div>
                <div className="flex gap-x-2">
                  {["TG", "IG", "X"].map((s) => (
                    <button key={s}
                      className="size-9 flex items-center justify-center bg-gray-400 hover:bg-[var(--brand)] rounded-lg transition-colors text-white text-xs font-bold">
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
    <Suspense>
      <CourseDetailContent courseId={courseId} />
    </Suspense>
  );
}
