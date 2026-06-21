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
  RiLoader4Line,
} from "react-icons/ri";
import { useCourse, useCourseSections } from "@/hooks/queries/use-courses";
import { useAddToCart } from "@/hooks/queries/use-cart";
import { formatMoney, isFree, discountPercent } from "@/lib/format";
import type { SectionRecord } from "@roohbakhsh/shared";

function fmtDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

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

function SectionHead({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-x-2.5 mb-5 md:mb-7">
      <span className="text-[var(--brand)] shrink-0">{icon}</span>
      <h2 className="font-bold text-base md:text-lg text-[var(--ink)]">{title}</h2>
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
          {section.lessons.map((lesson, idx) => (
            <Link key={lesson.id}
              href={`/courses/${courseSlug}/lessons/${lesson.id}`}
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
                <span className="text-sm">{fmtDuration(lesson.durationMinutes)}</span>
                {lesson.isFreePreview
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

function CourseDetailContent({ courseSlug }: { courseSlug: string }) {
  const t = useTranslations("CourseDetail");
  const locale = useLocale() as "ar" | "ur";
  const [descExpanded, setDescExpanded] = useState(false);

  const { data: course, isLoading: loadingCourse } = useCourse(courseSlug);
  const { data: sections, isLoading: loadingSections } = useCourseSections(courseSlug);
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();

  if (loadingCourse) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RiLoader4Line size={36} className="text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  if (!course) {
    return <div className="container py-32 text-center text-gray-400">Course not found.</div>;
  }

  const allSections = sections ?? [];
  const totalLessons = allSections.reduce((s, sec) => s + sec.lessons.length, 0);
  const hoursTotal = Math.round(course.durationMinutes / 60 * 10) / 10;
  const free = isFree(course.effectivePrice);
  const thumb = course.thumbnailUrl?.[locale] ?? course.thumbnailUrl?.ar ?? "";
  const discPct = discountPercent(course.price, course.effectivePrice);

  const stats = [
    { icon: <RiCheckboxCircleLine size={28} className="text-[var(--brand)]" />, val: t("status_complete"), label: t("status_label") },
    { icon: <RiTimeLine size={28} className="text-[var(--brand)]" />, val: `${hoursTotal}`, label: t("hours") },
    { icon: <RiUserLine size={28} className="text-[var(--brand)]" />, val: "—", label: t("students") },
    { icon: <RiStarFill size={28} className="text-amber-400" />, val: "—", label: t("rating") },
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

            {thumb && (
              <Image
                src={thumb} alt={course.title[locale]}
                width={700} height={394}
                className="block lg:hidden w-full md:w-2/3 mx-auto rounded-xl aspect-video object-cover mb-5 sm:mb-6"
              />
            )}

            <div className="flex flex-col gap-y-3 md:text-center lg:text-start">
              <h1 className="text-2xl md:text-3xl xl:text-4xl font-extrabold text-[var(--ink)]">{course.title[locale]}</h1>
              <p className="text-sm md:text-base text-gray-500 leading-7 line-clamp-3">
                {course.description[locale].split("\n")[0]}
              </p>
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-y-2 py-3 px-5 md:px-6 mb-5 bg-white rounded-xl border border-gray-100">
                {discPct > 0 ? (
                  <span className="text-sm md:text-base font-bold text-rose-500 flex items-center gap-x-1.5">
                    <RiGiftLine size={16} />
                    {discPct}٪ {t("discount_badge")}
                  </span>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-x-4 text-sm md:text-base text-gray-500">
                  <span>{hoursTotal} {t("hours")}</span>
                  <span className="w-px h-4 bg-gray-200" />
                  <span>{totalLessons} {t("lessons")}</span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-x-4">
                <button
                  onClick={() => addToCart(course.id)}
                  disabled={addingToCart}
                  className="flex items-center justify-center gap-x-2 h-12 px-6 rounded-xl bg-[var(--brand)] text-white font-bold text-sm md:text-base hover:opacity-90 active:scale-[0.98] transition-all shrink-0 disabled:opacity-60"
                >
                  {addingToCart ? <RiLoader4Line size={18} className="animate-spin" /> : <RiShoppingCartLine size={18} />}
                  {t("add_to_cart")}
                </button>
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
              {thumb && (
                <Image src={thumb} alt={course.title[locale]} fill className="object-cover opacity-90" sizes="50vw" priority />
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                  <RiPlayCircleLine size={36} className="text-white" />
                </div>
              </div>
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
                <div className="flex justify-center py-8">
                  <RiLoader4Line size={28} className="text-[var(--brand)] animate-spin" />
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

          </div>

          <aside className="lg:w-[340px] xl:w-[360px] flex flex-col gap-y-5 shrink-0 lg:sticky lg:top-24 lg:self-start">

            <div className="bg-white p-5 sm:p-7 rounded-xl border border-gray-50">
              <div className="flex items-center justify-between text-sm md:text-base mb-4">
                <span className="text-[var(--ink)] font-semibold">{t("progress_label")}</span>
                <span className="text-[var(--brand)] font-bold">0٪</span>
              </div>
              <div className="h-2 bg-[var(--brand)]/10 rounded-full">
                <div className="h-full bg-[var(--brand)] rounded-full w-0" />
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
    <Suspense>
      <CourseDetailContent courseSlug={courseId} />
    </Suspense>
  );
}
