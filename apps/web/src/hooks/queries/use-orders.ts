"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, tokenStore } from "@/lib/api-client";
import type { CreateOrderRequest, OrderRecord, PaginatedOrders } from "@roohbakhsh/shared";
import { cartKeys } from "./use-cart";

export const orderKeys = {
  mine: (params?: Record<string, unknown>) => ["orders", "mine", params] as const,
  detail: (id: string) => ["orders", "mine", "detail", id] as const,
};

export function useMyOrders(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<PaginatedOrders>({
    queryKey: orderKeys.mine(params),
    queryFn: () => api.get<PaginatedOrders>(`/orders/mine${query}`),
    enabled: typeof window !== "undefined" && !!tokenStore.getAccess(),
  });
}

export function useMyOrder(id: string) {
  return useQuery<OrderRecord>({
    queryKey: orderKeys.detail(id),
    queryFn: () => api.get<OrderRecord>(`/orders/mine/${id}`),
    enabled: !!id && typeof window !== "undefined" && !!tokenStore.getAccess(),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation<OrderRecord, Error, CreateOrderRequest>({
    mutationFn: (body) => api.post<OrderRecord>("/orders", body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cartKeys.cart });
      qc.invalidateQueries({ queryKey: ["orders", "mine"] });
    },
  });
}
