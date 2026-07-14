"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { PaginatedAdminOrders } from "@roohbakhsh/shared";

export const orderKeys = {
  adminList: (params?: Record<string, unknown>) => ["orders", "admin-list", params] as const,
};

export function useOrdersAdmin(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedAdminOrders>({
    queryKey: orderKeys.adminList(params),
    queryFn: () => api.get<PaginatedAdminOrders>(`/orders${query}`),
  });
}
