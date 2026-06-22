"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ReviewRecord, CreateReviewRequest, PaginatedReviews } from "@roohbakhsh/shared";

export const reviewKeys = {
  course: (courseSlug: string, params?: Record<string, unknown>) =>
    ["reviews", "course", courseSlug, params] as const,
  article: (articleSlug: string, params?: Record<string, unknown>) =>
    ["reviews", "article", articleSlug, params] as const,
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
