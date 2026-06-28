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
  RiCheckLine, RiReplyLine, RiSendPlaneLine,
} from "react-icons/ri";
import { toast } from "sonner";
import { useArticle } from "@/hooks/queries/use-articles";
import {
  useArticleReviews, useCreateArticleReview,
  useApproveReview, useRejectReview, useReplyToReview, usePendingReviews,
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
          <div className="flex items-center justify-between">
            <StarsInput value={rating} onChange={setRating} />
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
                    <Stars rating={r.rating} size={12} />
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
                    <RiChat3Line size={16} className="text-[var(--brand)]" />
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

function ArticleDetailSkeleton() {
  return (
    <div className="bg-[var(--bg)] min-h-screen">
      <div className="container pt-8 sm:pt-10 pb-16">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-x-2 mb-7">
          <Sk className="h-4 w-16" />
          <Sk className="h-4 w-4" />
          <Sk className="h-4 w-16" />
          <Sk className="h-4 w-4" />
          <Sk className="h-4 w-32" />
        </div>

        <div className="flex flex-col lg:flex-row gap-7">
          {/* Left sidebar skeleton */}
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
                <Sk className="h-7 w-3/4 mb-4" />
                <div className="flex items-center gap-x-5 pb-5 mb-5 border-b border-gray-100">
                  <div className="flex items-center gap-x-2 flex-1">
                    <Sk className="size-8 rounded-full shrink-0" />
                    <div className="flex flex-col gap-y-1.5">
                      <Sk className="h-3 w-16" />
                      <Sk className="h-3.5 w-28" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-y-1.5 shrink-0">
                    <Sk className="h-3 w-20" />
                    <Sk className="h-3 w-8" />
                  </div>
                  <div className="flex flex-col items-end gap-y-1.5 shrink-0">
                    <Sk className="h-3 w-16" />
                    <Sk className="h-3.5 w-20" />
                  </div>
                </div>
              </div>
              <div className="px-5 sm:px-7 pb-5">
                <Sk className="w-full aspect-video rounded-xl" />
              </div>
              <div className="p-5 sm:p-7 flex flex-col gap-y-3">
                <Sk className="h-3.5 w-full" />
                <Sk className="h-3.5 w-full" />
                <Sk className="h-3.5 w-5/6" />
                <Sk className="h-3.5 w-2/3" />
                <Sk className="h-3.5 w-full" />
                <Sk className="h-3.5 w-4/5" />
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
        <nav className="flex items-center gap-x-2 text-sm text-gray-400 mb-7 overflow-x-auto">
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
                <button className="flex-1 h-9 flex items-center justify-center bg-gray-100 hover:bg-[#2AABEE] hover:text-white rounded-md transition-colors text-gray-500">
                  <RiTelegramLine size={18} />
                </button>
                <button className="flex-1 h-9 flex items-center justify-center bg-gray-100 hover:bg-[#E1306C] hover:text-white rounded-md transition-colors text-gray-500">
                  <RiInstagramLine size={18} />
                </button>
                <button className="flex-1 h-9 flex items-center justify-center bg-gray-100 hover:bg-[var(--ink)] hover:text-white rounded-md transition-colors text-gray-500">
                  <RiTwitterXLine size={18} />
                </button>
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

                {/* Author + rating + date */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pb-5 mb-5 border-b border-gray-100">
                  {/* Author */}
                  <div className="flex items-center gap-x-2.5 min-w-0">
                    {article.instructor.avatarUrl ? (
                      <Image src={article.instructor.avatarUrl} alt={article.instructor.name[locale]} width={36} height={36} style={{ width: 36, height: 36 }} className="rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="size-9 rounded-full bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
                        <RiUserLine size={16} className="text-[var(--brand)]" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-400 mb-0.5">{t("author")}</p>
                      <p className="text-sm font-semibold text-[var(--ink)] truncate">{article.instructor.name[locale]}</p>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="hidden sm:block w-px h-8 bg-gray-100 shrink-0" />
                  {/* Rating */}
                  <div className="flex flex-col shrink-0">
                    <p className="text-[11px] text-gray-400 mb-1">{t("rating")}</p>
                    <div className="flex items-center gap-x-1.5">
                      <Stars rating={article.averageRating} size={13} />
                      <span className="text-sm font-semibold text-[var(--ink)]">{article.averageRating ? article.averageRating.toFixed(1) : "—"}</span>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="hidden sm:block w-px h-8 bg-gray-100 shrink-0" />
                  {/* Date */}
                  <div className="flex flex-col shrink-0">
                    <p className="text-[11px] text-gray-400 mb-0.5">{t("published_at")}</p>
                    <div className="flex items-center gap-x-1.5">
                      <RiCalendarLine size={14} className="text-[var(--brand)] shrink-0" />
                      <p className="text-sm font-semibold text-[var(--ink)]">{publishedDate}</p>
                    </div>
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
                <div className="flex lg:hidden items-center gap-x-2.5 mt-6">
                  <Link href={`/teacher/${article.instructor.slug}`}
                    className="flex items-center justify-center gap-x-2 h-11 flex-1 rounded-lg bg-[var(--brand)] text-white font-bold text-sm hover:opacity-90 transition-all">
                    <RiUserLine size={17} />
                    {t("view_profile")}
                  </Link>
                  <ArticleFavoriteButton articleId={article.id} t={t} />
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
