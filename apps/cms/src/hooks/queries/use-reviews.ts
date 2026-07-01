"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Paginated, ReviewWithTarget } from "@roohbakhsh/shared";

export const reviewKeys = {
  pending: (params?: Record<string, unknown>) => ["reviews", "pending", params] as const,
  all: (params?: Record<string, unknown>) => ["reviews", "all", params] as const,
};

export function useReviewsPending(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<Paginated<ReviewWithTarget>>({
    queryKey: reviewKeys.pending(params),
    queryFn: () => api.get<Paginated<ReviewWithTarget>>(`/reviews/pending${query}`),
  });
}

export function useApproveReview() {
  const qc = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (id) => api.post(`/reviews/${id}/approve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useRejectReview() {
  const qc = useQueryClient();
  return useMutation<unknown, Error, string>({
    mutationFn: (id) => api.post(`/reviews/${id}/reject`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useReplyReview() {
  const qc = useQueryClient();
  return useMutation<unknown, Error, { id: string; body: string }>({
    mutationFn: ({ id, body }) => api.post(`/reviews/${id}/reply`, { body }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
