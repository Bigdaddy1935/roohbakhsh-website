"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, tokenStore } from "@/lib/api-client";
import type { CartRecord } from "@roohbakhsh/shared";

export const cartKeys = {
  cart: ["cart"] as const,
};

export function useCart() {
  return useQuery<CartRecord>({
    queryKey: cartKeys.cart,
    queryFn: () => api.get<CartRecord>("/cart"),
    enabled: typeof window !== "undefined" && !!tokenStore.getAccess(),
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation<CartRecord, Error, string>({
    mutationFn: (courseId) => api.post<CartRecord>("/cart/items", { courseId }),
    onSuccess: (data) => qc.setQueryData(cartKeys.cart, data),
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  return useMutation<CartRecord, Error, string>({
    mutationFn: (courseId) => api.delete<CartRecord>(`/cart/items/${courseId}`),
    onSuccess: (data) => qc.setQueryData(cartKeys.cart, data),
  });
}

export function useClearCart() {
  const qc = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () => api.delete<void>("/cart"),
    onSuccess: () => qc.setQueryData(cartKeys.cart, { items: [], total: null }),
  });
}
