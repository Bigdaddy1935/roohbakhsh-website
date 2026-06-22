"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api, tokenStore } from "@/lib/api-client";
import type { InitiatePaymentResponse, PaginatedPayments } from "@roohbakhsh/shared";

export const paymentKeys = {
  mine: (params?: Record<string, unknown>) => ["payments", "mine", params] as const,
};

export function useMyPayments(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedPayments>({
    queryKey: paymentKeys.mine(params),
    queryFn: () => api.get<PaginatedPayments>(`/payments/mine${query}`),
    enabled: typeof window !== "undefined" && !!tokenStore.getAccess(),
  });
}

export function useInitiatePayment() {
  return useMutation<InitiatePaymentResponse, Error, string>({
    mutationFn: (orderId) =>
      api.post<InitiatePaymentResponse>(`/payments/initiate/${orderId}`),
    onSuccess: (data) => {
      if (data.gatewayUrl) window.location.href = data.gatewayUrl;
    },
  });
}
