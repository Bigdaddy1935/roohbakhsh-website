"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  ReviewRecord,
  CreateReviewRequest,
  ReplyToReviewRequest,
  PaginatedReviews,
  PaginatedReviewsWithTarget,
} from "@roohbakhsh/shared";

export const allReviewsKeys = {
  list: (params?: Record<string, unknown>) => ["reviews", "all", params] as const,
};

export function useReviews(params?: { page?: number; limit?: number; rating?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.rating) qs.set("rating", String(params.rating));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedReviewsWithTarget>({
    queryKey: allReviewsKeys.list(params),
    queryFn: () => api.get<PaginatedReviewsWithTarget>(`/reviews${query}`),
  });
}

export const reviewKeys = {
  course: (courseSlug: string, params?: Record<string, unknown>) =>
    params === undefined
      ? (["reviews", "course", courseSlug] as const)
      : (["reviews", "course", courseSlug, params] as const),
  article: (articleSlug: string, params?: Record<string, unknown>) =>
    params === undefined
      ? (["reviews", "article", articleSlug] as const)
      : (["reviews", "article", articleSlug, params] as const),
  lesson: (lessonId: string, params?: Record<string, unknown>) =>
    params === undefined
      ? (["reviews", "lesson", lessonId] as const)
      : (["reviews", "lesson", lessonId, params] as const),
};

export function useCourseReviews(courseSlug: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedReviews>({
    queryKey: reviewKeys.course(courseSlug, params),
    queryFn: () => api.get<PaginatedReviews>(`/courses/${courseSlug}/reviews${query}`),
    enabled: !!courseSlug,
  });
}

export function useCreateCourseReview() {
  const queryClient = useQueryClient();
  return useMutation<ReviewRecord, Error, { courseSlug: string } & CreateReviewRequest>({
    mutationFn: ({ courseSlug, ...body }) =>
      api.post<ReviewRecord>(`/courses/${courseSlug}/reviews`, body),
    onSuccess: (_data, { courseSlug }) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.course(courseSlug) });
    },
  });
}

export function useArticleReviews(articleSlug: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedReviews>({
    queryKey: reviewKeys.article(articleSlug, params),
    queryFn: () => api.get<PaginatedReviews>(`/articles/${articleSlug}/reviews${query}`),
    enabled: !!articleSlug,
  });
}

export function useCreateArticleReview() {
  const queryClient = useQueryClient();
  return useMutation<ReviewRecord, Error, { articleSlug: string } & CreateReviewRequest>({
    mutationFn: ({ articleSlug, ...body }) =>
      api.post<ReviewRecord>(`/articles/${articleSlug}/reviews`, body),
    onSuccess: (_data, { articleSlug }) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.article(articleSlug) });
    },
  });
}

export function useLessonReviews(lessonId: string, params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedReviews>({
    queryKey: reviewKeys.lesson(lessonId, params),
    queryFn: () => api.get<PaginatedReviews>(`/lessons/${lessonId}/reviews${query}`),
    enabled: !!lessonId,
  });
}

export function useCreateLessonReview() {
  const queryClient = useQueryClient();
  return useMutation<ReviewRecord, Error, { lessonId: string } & CreateReviewRequest>({
    mutationFn: ({ lessonId, ...body }) =>
      api.post<ReviewRecord>(`/lessons/${lessonId}/reviews`, body),
    onSuccess: (_data, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.lesson(lessonId) });
    },
  });
}

// ── مدیریت نظرات — فقط admin ─────────────────────────────────────────────

export const pendingReviewKeys = {
  list: (params?: Record<string, unknown>) => ["reviews", "pending", params] as const,
};

export function usePendingReviews(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedReviewsWithTarget>({
    queryKey: pendingReviewKeys.list(params),
    queryFn: () => api.get<PaginatedReviewsWithTarget>(`/reviews/pending${query}`),
  });
}

function invalidateAllReviewQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["reviews"] });
}

export function useApproveReview() {
  const queryClient = useQueryClient();
  return useMutation<ReviewRecord, Error, string>({
    mutationFn: (reviewId) => api.post<ReviewRecord>(`/reviews/${reviewId}/approve`),
    onSuccess: () => invalidateAllReviewQueries(queryClient),
  });
}

export function useRejectReview() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (reviewId) => api.post<void>(`/reviews/${reviewId}/reject`),
    onSuccess: () => invalidateAllReviewQueries(queryClient),
  });
}

export function useReplyToReview() {
  const queryClient = useQueryClient();
  return useMutation<ReviewRecord, Error, { reviewId: string } & ReplyToReviewRequest>({
    mutationFn: ({ reviewId, ...body }) => api.post<ReviewRecord>(`/reviews/${reviewId}/reply`, body),
    onSuccess: () => invalidateAllReviewQueries(queryClient),
  });
}
