"use client";

import { useQuery } from "@tanstack/react-query";
import { api, tokenStore } from "@/lib/api-client";
import type { InvoiceRecord, PaginatedInvoices } from "@roohbakhsh/shared";

export const invoiceKeys = {
  mine: (params?: Record<string, unknown>) => ["invoices", "mine", params] as const,
  detail: (invoiceNumber: string) => ["invoices", "mine", "detail", invoiceNumber] as const,
};

export function useMyInvoices(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedInvoices>({
    queryKey: invoiceKeys.mine(params),
    queryFn: () => api.get<PaginatedInvoices>(`/invoices/mine${query}`),
    enabled: typeof window !== "undefined" && !!tokenStore.getAccess(),
  });
}

export function useMyInvoice(invoiceNumber: string) {
  return useQuery<InvoiceRecord>({
    queryKey: invoiceKeys.detail(invoiceNumber),
    queryFn: () => api.get<InvoiceRecord>(`/invoices/mine/${invoiceNumber}`),
    enabled: !!invoiceNumber && typeof window !== "undefined" && !!tokenStore.getAccess(),
  });
}
