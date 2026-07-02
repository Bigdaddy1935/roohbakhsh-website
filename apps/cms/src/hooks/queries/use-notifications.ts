"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { NotificationItem, CreateNotificationRequest } from "@roohbakhsh/shared";

export function useSendNotification() {
  const qc = useQueryClient();
  return useMutation<NotificationItem, Error, CreateNotificationRequest>({
    mutationFn: (body) => api.post<NotificationItem>("/notifications", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
