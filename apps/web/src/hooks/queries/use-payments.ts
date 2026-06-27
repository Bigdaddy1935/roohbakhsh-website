"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { api, apiUpload, tokenStore } from "@/lib/api-client";
import type {
  InitiatePaymentResponse,
  PaginatedPayments,
  PaymentDestinationAccount,
  PaymentRecord,
  SubmitCardToCardPaymentRequest,
  UploadReceiptResponse,
} from "@roohbakhsh/shared";

export const paymentKeys = {
  mine: (params?: Record<string, unknown>) => ["payments", "mine", params] as const,
  destination: ["payments", "destination-info"] as const,
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

/** اطلاعات حساب مقصد آکادمی برای کارت‌به‌کارت. */
export function useDestinationAccount() {
  return useQuery<PaymentDestinationAccount>({
    queryKey: paymentKeys.destination,
    queryFn: () => api.get<PaymentDestinationAccount>("/payments/manual/destination-info"),
    enabled: typeof window !== "undefined" && !!tokenStore.getAccess(),
    staleTime: Infinity,
  });
}

/** آپلود تصویر رسید کارت‌به‌کارت — لینک عمومی برمی‌گردد. */
export function useUploadReceipt() {
  return useMutation<UploadReceiptResponse, Error, File>({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("file", file);
      return apiUpload<UploadReceiptResponse>("/payments/upload-receipt", formData);
    },
  });
}

/** ثبت اطلاعات پرداخت کارت‌به‌کارت برای یک سفارش — یا با رسید، یا فقط اطلاعات متنی. */
export function useSubmitCardToCard(orderId: string) {
  return useMutation<PaymentRecord, Error, SubmitCardToCardPaymentRequest>({
    mutationFn: (body) => api.post<PaymentRecord>(`/payments/manual/${orderId}`, body),
  });
}
