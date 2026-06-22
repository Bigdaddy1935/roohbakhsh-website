"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, tokenStore } from "@/lib/api-client";
import type { NotificationItem, NotificationsSummary, Paginated } from "@roohbakhsh/shared";

export const notificationKeys = {
  list: (params?: Record<string, unknown>) => ["notifications", "list", params] as const,
  unreadCount: ["notifications", "unread-count"] as const,
};

export function useNotificationItems(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<Paginated<NotificationItem>>({
    queryKey: notificationKeys.list(params),
    queryFn: () => api.get<Paginated<NotificationItem>>(`/notifications${query}`),
    enabled: typeof window !== "undefined" && !!tokenStore.getAccess(),
  });
}

export function useUnreadCount() {
  return useQuery<NotificationsSummary>({
    queryKey: notificationKeys.unreadCount,
    queryFn: () => api.get<NotificationsSummary>("/notifications/unread-count"),
    enabled: typeof window !== "undefined" && !!tokenStore.getAccess(),
    refetchInterval: 60_000,
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.post<void>(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => api.post<void>("/notifications/read-all"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
