"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  RiArrowLeftSLine,
  RiArrowDownSLine,
  RiUserLine, RiCalendarLine, RiStarFill,
  RiBookOpenLine, RiShareLine,
  RiTelegramLine, RiInstagramLine, RiTwitterXLine,
  RiLoader4Line, RiChat3Line, RiCloseLine,
  RiHeartFill, RiHeartLine, RiLockLine,
  RiCheckLine,
} from "react-icons/ri";
import { toast } from "sonner";
import { useArticle } from "@/hooks/queries/use-articles";
import {
  useArticleReviews, useCreateArticleReview,
  useApproveReview, useRejectReview, usePendingReviews,
} from "@/hooks/queries/use-reviews";
import { useMe } from "@/hooks/queries/use-auth";
import { useMyFavorites, useToggleFavorite } from "@/hooks/queries/use-favorites";
import { tokenStore } from "@/lib/api-client";
import type { ReviewRecord } from "@roohbakhsh/shared";

function ArticleFavoriteButton({ articleId, t }: { articleId: string; t: (k: string) => string }) {
  const tc = useTranslations("Common");
  const isAuthed = typeof window !== "undefined" && !!tokenStore.getAccess();
  const { data: favorites } = useMyFavorites();
  const toggleFavorite = useToggleFavorite();
  const isFavorite = !!favorites?.some((f) => f.type === "article" && f.id === articleId);

  return (
    <button
      type="button"
      onClick={() => {
        if (!isAuthed) {
          toast.error(tc("login_required_toast"));
          return;
        }
        toggleFavorite.mutate(
          { type: "article", id: articleId },
          { onSuccess: (status) => toast.success(status.isFavorite ? tc("favorite_added_toast") : tc("favorite_removed_toast")) },
        );
      }}
      disabled={toggleFavorite.isPending}
      className={`w-full h-11 rounded-md border flex items-center justify-center gap-x-2 text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer ${isFavorite ? "border-rose-300 bg-rose-50 text-rose-500" : "border-gray-200 text-gray-500 hover:border-rose-300 hover:text-rose-500"}`}
      title={t("toggle_favorite")}
    >
      {isFavorite ? <RiHeartFill size={18} /> : <RiHeartLine size={18} />}
      {isFavorite ? t("remove_favorite") : t("add_favorite")}
    </button>
  );
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

function StarsInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <span className="flex items-center gap-x-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)} className="cursor-pointer">
          <RiStarFill size={22} className={s <= value ? "text-amber-400" : "text-gray-200"} />
        </button>
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

function AdminReviewActions({ review, t }: { review: ReviewRecord; t: (k: string) => string }) {
  const approveReview = useApproveReview();
  const rejectReview = useRejectReview();

  function handleReject() {
    if (!confirm(t("confirm_reject"))) return;
    rejectReview.mutate(review.id, { onSuccess: () => toast.success(t("review_rejected_toast")) });
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
      </div>
    </div>
  );
}

function ReviewsSection({ articleId, articleSlug, t }: { articleId: string; articleSlug: string; t: (k: string) => string }) {
  const { data, isLoading } = useArticleReviews(articleSlug, { limit: 10 });
  const { data: me } = useMe();
  const isAdmin = me?.role === "admin";
  const { data: pendingData } = usePendingReviews({ limit: 100 });
  const createReview = useCreateArticleReview();
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const approvedReviews = data?.items ?? [];
  const pendingForArticle = isAdmin
    ? (pendingData?.items ?? []).filter((p) => p.target.type === "article" && p.target.id === articleId)
    : [];
  const reviewMap = new Map<string, (typeof approvedReviews)[number]>();
  for (const r of approvedReviews) reviewMap.set(r.id, r);
  for (const r of pendingForArticle) reviewMap.set(r.id, r);
  const reviews = [...reviewMap.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const isAuthed = typeof window !== "undefined" && !!tokenStore.getAccess();

  function handleSubmit() {
    createReview.mutate(
      { articleSlug, rating, comment: comment.trim() || null },
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
        <div className="flex items-center justify-between gap-x-2.5 mb-6 px-4 py-3 rounded-lg bg-rose-50 border border-rose-200">
          <div className="flex items-center gap-x-2">
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
          <div className="flex items-center justify-between mb-3">
            <StarsInput value={rating} onChange={setRating} />
            <button type="button" onClick={() => setFormOpen(false)} className="size-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <RiCloseLine size={18} />
            </button>
          </div>
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
              {t("cancel") ?? "إلغاء"}
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
            <div key={r.id} className={`px-4 py-5 bg-white min-h-[150px] ${idx < reviews.length - 1 ? "border-b border-gray-100" : ""}`}>
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
                  <Stars rating={r.rating} size={14} />
                  <span className="text-sm font-medium text-gray-500">{r.createdAt.slice(0, 10)}</span>
                  {!r.isApproved && (isAdmin || (me && r.userId === me.id)) && (
                    <span className="text-xs text-gray-400">· {t("review_pending_notice")}</span>
                  )}
                </div>
              </div>
              {/* Comment */}
              {r.comment && <p className="text-sm font-medium text-gray-600 leading-7 mt-4 ps-[50px]">{r.comment}</p>}

              {r.instructorReply && (
                <div className="flex items-start gap-x-3 mt-6 ms-6 sm:ms-10 ps-3.5 border-s-2 border-sky-300">
                  <div className="size-8 rounded-full bg-sky-50 flex items-center justify-center shrink-0">
                    <RiChat3Line size={16} className="text-sky-500" />
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

function ArticleDetailSkeleton() {
  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <div className="container pt-8 sm:pt-10 pb-16">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-x-2 mb-12">
          <Sk className="h-4 w-12" />
          <Sk className="h-4 w-4" />
          <Sk className="h-4 w-12" />
          <Sk className="h-4 w-4" />
          <Sk className="h-4 w-28" />
        </div>

        <div className="flex flex-col lg:flex-row gap-7">
          {/* Left sidebar skeleton — desktop only */}
          <div className="hidden lg:flex flex-col gap-y-4 w-[300px] shrink-0 order-last">
            <div className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col gap-y-3">
              <Sk className="h-11 w-full rounded-md" />
              <Sk className="h-11 w-full rounded-md" />
            </div>
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <Sk className="h-4 w-20 mb-3" />
              <div className="flex gap-x-2">
                <Sk className="flex-1 h-9 rounded-md" />
                <Sk className="flex-1 h-9 rounded-md" />
                <Sk className="flex-1 h-9 rounded-md" />
              </div>
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="flex flex-col gap-y-6 lg:grow min-w-0">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-5 sm:p-7">
                {/* Title */}
                <Sk className="h-7 w-3/4 mb-2" />
                <Sk className="h-7 w-1/2 mb-5" />
                {/* Meta row */}
                <div className="flex items-center gap-x-3 pt-4 mt-1 border-t border-gray-100">
                  <Sk className="size-7 rounded-full shrink-0" />
                  <Sk className="h-3.5 w-28" />
                  <div className="w-px h-4 bg-gray-100 shrink-0" />
                  <Sk className="h-3.5 w-8" />
                  <Sk className="ms-auto h-3.5 w-20" />
                </div>
              </div>
              {/* Thumbnail */}
              <div className="px-5 sm:px-7 pb-5">
                <Sk className="w-full aspect-video rounded-xl" />
              </div>
              {/* Body lines */}
              <div className="p-5 sm:p-7 flex flex-col gap-y-3">
                <Sk className="h-3.5 w-full" />
                <Sk className="h-3.5 w-full" />
                <Sk className="h-3.5 w-5/6" />
                <Sk className="h-3.5 w-2/3" />
                <Sk className="h-3.5 w-full" />
                <Sk className="h-3.5 w-4/5" />
              </div>
              {/* Mobile action buttons skeleton */}
              <div className="flex lg:hidden flex-col gap-y-2.5 p-5 sm:p-7 pt-0">
                <Sk className="h-11 w-full rounded-md" />
                <Sk className="h-11 w-full rounded-md" />
                <div className="bg-gray-50 rounded-lg border border-gray-100 p-3 mt-1">
                  <Sk className="h-3.5 w-16 mb-2.5" />
                  <div className="flex gap-x-2">
                    <Sk className="flex-1 h-9 rounded-md" />
                    <Sk className="flex-1 h-9 rounded-md" />
                    <Sk className="flex-1 h-9 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleDetailContent({ articleSlug }: { articleSlug: string }) {
  const t = useTranslations("ArticleDetail");
  const locale = useLocale() as "ar" | "ur";
  const [descExpanded, setDescExpanded] = useState(false);

  const { data: article, isLoading } = useArticle(articleSlug);

  if (isLoading) {
    return <ArticleDetailSkeleton />;
  }

  if (!article) {
    return <div className="container py-32 text-center text-gray-400">{t("not_found")}</div>;
  }

  const thumb = article.thumbnailUrl?.[locale] ?? article.thumbnailUrl?.ar ?? "";
  const publishedDate = (article.publishedAt ?? article.createdAt).slice(0, 10);

  const stats = [
    { icon: <RiUserLine size={28} className="text-[var(--brand)]" />, val: article.instructor.name[locale], label: t("author") },
    { icon: <RiStarFill size={28} className="text-amber-400" />, val: article.averageRating ? article.averageRating.toFixed(1) : "—", label: t("rating") },
    { icon: <RiCalendarLine size={28} className="text-[var(--brand)]" />, val: publishedDate, label: t("published_at") },
  ];

  return (
    <div className="bg-[var(--bg)] min-h-screen">

      <div className="container pt-8 sm:pt-10 pb-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-x-2 text-sm text-gray-400 mb-12 overflow-x-auto">
          <Link href="/" className="text-nowrap hover:text-[var(--brand)] transition-colors">{t("breadcrumb_home")}</Link>
          <RiArrowDownSLine size={14} className="-rotate-90 text-gray-300 shrink-0" />
          <Link href="/articles" className="text-nowrap hover:text-[var(--brand)] transition-colors">{t("breadcrumb_articles")}</Link>
          <RiArrowDownSLine size={14} className="-rotate-90 text-gray-300 shrink-0" />
          <span className="text-nowrap text-[var(--ink)] font-semibold truncate max-w-[160px]">{article.title[locale]}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-7">

          {/* Left sidebar */}
          <aside className="hidden lg:flex flex-col gap-y-4 w-[300px] shrink-0 sticky top-24 self-start order-last">
            {/* Actions card */}
            <div className="bg-white rounded-lg border border-gray-100 p-4 flex flex-col gap-y-3">
              <Link href={`/teacher/${article.instructor.slug}`}
                className="flex items-center justify-center gap-x-2 h-11 w-full rounded-md bg-[var(--brand)] text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all">
                <RiUserLine size={17} />
                {t("view_profile")}
              </Link>
              <ArticleFavoriteButton articleId={article.id} t={t} />
            </div>

            {/* Share card */}
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-x-2 mb-3">
                <RiShareLine size={16} className="text-[var(--ink)]" />
                <span className="text-sm font-semibold text-[var(--ink)]">{t("share")}</span>
              </div>
              <div className="flex gap-x-2">
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 h-9 flex items-center justify-center bg-gray-100 hover:bg-[#2AABEE] hover:text-white rounded-md transition-colors text-gray-500"
                >
                  <RiTelegramLine size={18} />
                </a>
                <button
                  type="button"
                  onClick={() => { navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : ""); toast.success(t("link_copied")); }}
                  className="flex-1 h-9 flex items-center justify-center bg-gray-100 hover:bg-[#E1306C] hover:text-white rounded-md transition-colors text-gray-500 cursor-pointer"
                >
                  <RiInstagramLine size={18} />
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 h-9 flex items-center justify-center bg-gray-100 hover:bg-[var(--ink)] hover:text-white rounded-md transition-colors text-gray-500"
                >
                  <RiTwitterXLine size={18} />
                </a>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex flex-col gap-y-6 md:gap-y-8 lg:grow min-w-0">

            {/* Single box: title + meta + image + body */}
            <div className="relative bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-5 sm:p-7">
                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--ink)] leading-snug mb-4">{article.title[locale]}</h1>

                {/* Author + rating + date — single row */}
                <div className="flex items-center gap-x-3 sm:gap-x-4 flex-nowrap pt-4 mt-1 border-t border-gray-100 overflow-hidden">
                  {/* Author */}
                  <div className="flex items-center gap-x-2 min-w-0">
                    {article.instructor.avatarUrl ? (
                      <Image src={article.instructor.avatarUrl} alt={article.instructor.name[locale]} width={28} height={28} style={{ width: 28, height: 28 }} className="rounded-full object-cover shrink-0 opacity-60" />
                    ) : (
                      <div className="size-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <RiUserLine size={14} className="text-gray-400" />
                      </div>
                    )}
                    <span className="text-sm text-gray-500 truncate max-w-[120px] sm:max-w-none">{article.instructor.name[locale]}</span>
                  </div>
                  {/* Divider */}
                  <div className="w-px h-4 bg-gray-200 shrink-0" />
                  {/* Rating */}
                  <div className="flex items-center gap-x-1.5 shrink-0">
                    <RiStarFill size={13} className="text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-500">{article.averageRating ? article.averageRating.toFixed(1) : "—"}</span>
                  </div>
                  {/* Date pushed to end */}
                  <div className="flex items-center gap-x-1.5 shrink-0 ms-auto">
                    <RiCalendarLine size={13} className="text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-500">{publishedDate}</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail */}
              {thumb ? (
                <div className="px-5 sm:px-7 pb-5">
                  <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden">
                    <Image src={thumb} alt={article.title[locale]} fill className="object-cover opacity-90" sizes="(max-width:1024px) 100vw, 800px" priority />
                  </div>
                </div>
              ) : (
                <div className="mx-5 sm:mx-7 mb-5 aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                  <RiBookOpenLine size={40} className="text-gray-300" />
                </div>
              )}

              {/* Body */}
              <div className="p-5 sm:p-7">
                <div
                  className="article-body text-sm md:text-base text-gray-600 leading-8"
                  dangerouslySetInnerHTML={{ __html: article.body[locale] }}
                />

                {/* Mobile actions */}
                <div className="flex lg:hidden flex-col gap-y-3 mt-6">
                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                    <Link href={`/teacher/${article.instructor.slug}`}
                      className="flex items-center justify-center gap-x-2 h-11 w-full rounded-md bg-[var(--brand)] text-white font-bold text-sm hover:opacity-90 transition-all">
                      <RiUserLine size={17} />
                      {t("view_profile")}
                    </Link>
                    <ArticleFavoriteButton articleId={article.id} t={t} />
                  </div>
                  <div className="bg-white rounded-lg border border-gray-100 p-3">
                    <div className="flex items-center gap-x-2 mb-2.5">
                      <RiShareLine size={15} className="text-[var(--ink)]" />
                      <span className="text-sm font-semibold text-[var(--ink)]">{t("share")}</span>
                    </div>
                    <div className="flex gap-x-2">
                      <a
                        href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 h-9 flex items-center justify-center bg-gray-100 hover:bg-[#2AABEE] hover:text-white rounded-md transition-colors text-gray-500"
                      >
                        <RiTelegramLine size={18} />
                      </a>
                      <button
                        type="button"
                        onClick={() => { navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : ""); toast.success(t("link_copied")); }}
                        className="flex-1 h-9 flex items-center justify-center bg-gray-100 hover:bg-[#E1306C] hover:text-white rounded-md transition-colors text-gray-500 cursor-pointer"
                      >
                        <RiInstagramLine size={18} />
                      </button>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex-1 h-9 flex items-center justify-center bg-gray-100 hover:bg-[var(--ink)] hover:text-white rounded-md transition-colors text-gray-500"
                      >
                        <RiTwitterXLine size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ReviewsSection articleId={article.id} articleSlug={articleSlug} t={t} />

          </div>

        </div>
      </div>
    </div>
  );
}

export default function ArticleDetailPage({ articleSlug }: { articleSlug: string }) {
  return (
    <Suspense fallback={<ArticleDetailSkeleton />}>
      <ArticleDetailContent articleSlug={articleSlug} />
    </Suspense>
  );
}
