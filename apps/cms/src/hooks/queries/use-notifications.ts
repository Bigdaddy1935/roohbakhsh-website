"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { NotificationItem, CreateNotificationRequest, Paginated } from "@roohbakhsh/shared";

export function useSendNotification() {
  const qc = useQueryClient();
  return useMutation<NotificationItem, Error, CreateNotificationRequest>({
    mutationFn: (body) => api.post<NotificationItem>("/notifications", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

/** تاریخچه‌ی همه‌ی اعلانات ارسال‌شده (صفحه‌بندی‌شده، جدیدترین اول). */
export function useNotificationsHistory(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<Paginated<NotificationItem>>({
    queryKey: ["notifications", "history", params],
    queryFn: () => api.get<Paginated<NotificationItem>>(`/notifications${query}`),
  });
}
