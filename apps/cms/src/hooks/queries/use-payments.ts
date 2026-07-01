"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { PaymentRecord, PaginatedPayments } from "@roohbakhsh/shared";

export const paymentKeys = {
  pending: (params?: Record<string, unknown>) => ["payments", "pending", params] as const,
  logs: (params?: Record<string, unknown>) => ["payments", "logs", params] as const,
};

export function usePaymentsPending(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedPayments>({
    queryKey: paymentKeys.pending(params),
    queryFn: () => api.get<PaginatedPayments>(`/payments/manual/pending${query}`),
  });
}

export function usePaymentLogs(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedPayments>({
    queryKey: paymentKeys.logs(params),
    queryFn: () => api.get<PaginatedPayments>(`/payments/logs${query}`),
  });
}

export function useApprovePayment() {
  const qc = useQueryClient();
  return useMutation<PaymentRecord, Error, string>({
    mutationFn: (paymentId) => api.post<PaymentRecord>(`/payments/manual/${paymentId}/approve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payments"] }),
  });
}

export function useRejectPayment() {
  const qc = useQueryClient();
  return useMutation<PaymentRecord, Error, string>({
    mutationFn: (paymentId) => api.post<PaymentRecord>(`/payments/manual/${paymentId}/reject`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payments"] }),
  });
}
