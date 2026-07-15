"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { AdminPaymentRecord, PaginatedAdminPayments } from "@roohbakhsh/shared";

export const paymentKeys = {
  pending: (params?: Record<string, unknown>) => ["payments", "pending", params] as const,
  logs: (params?: Record<string, unknown>) => ["payments", "logs", params] as const,
};

export function usePaymentsPending(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedAdminPayments>({
    queryKey: paymentKeys.pending(params),
    queryFn: () => api.get<PaginatedAdminPayments>(`/payments/manual/pending${query}`),
  });
}

export function usePaymentLogs(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedAdminPayments>({
    queryKey: paymentKeys.logs(params),
    queryFn: () => api.get<PaginatedAdminPayments>(`/payments/logs${query}`),
  });
}

export function useApprovePayment() {
  const qc = useQueryClient();
  return useMutation<AdminPaymentRecord, Error, string>({
    mutationFn: (paymentId) => api.post<AdminPaymentRecord>(`/payments/manual/${paymentId}/approve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payments"] }),
  });
}

export function useRejectPayment() {
  const qc = useQueryClient();
  return useMutation<AdminPaymentRecord, Error, string>({
    mutationFn: (paymentId) => api.post<AdminPaymentRecord>(`/payments/manual/${paymentId}/reject`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payments"] }),
  });
}
