"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  RecentViewItem,
  RecordViewRequest,
  Paginated,
} from "@roohbakhsh/shared";

export const recentlyViewedKeys = {
  list: (params?: Record<string, unknown>) => ["recently-viewed", "list", params] as const,
  paginated: (params?: Record<string, unknown>) => ["recently-viewed", "paginated", params] as const,
};

export function useRecentlyViewed(params?: { limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<RecentViewItem[]>({
    queryKey: recentlyViewedKeys.list(params),
    queryFn: () => api.get<RecentViewItem[]>(`/recently-viewed${query}`),
  });
}

export function useRecentlyViewedPaginated(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<Paginated<RecentViewItem>>({
    queryKey: recentlyViewedKeys.paginated(params),
    queryFn: () => api.get<Paginated<RecentViewItem>>(`/recently-viewed/paginated${query}`),
  });
}

export function useRecordView() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, RecordViewRequest>({
    mutationFn: (body) => api.post<void>("/recently-viewed", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recently-viewed"] });
    },
  });
}
