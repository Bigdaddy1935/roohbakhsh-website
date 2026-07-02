"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { CouponRecord, Paginated, CreateCouponRequest, UpdateCouponRequest } from "@roohbakhsh/shared";

export const couponKeys = {
  list: (params?: Record<string, unknown>) => ["coupons", "list", params] as const,
  detail: (id: string) => ["coupons", "detail", id] as const,
};

export function useCoupons(params?: { page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const query = qs.toString() ? `?${qs}` : "";

  return useQuery<Paginated<CouponRecord>>({
    queryKey: couponKeys.list(params),
    queryFn: () => api.get<Paginated<CouponRecord>>(`/coupons${query}`),
  });
}

export function useCoupon(id: string) {
  return useQuery<CouponRecord>({
    queryKey: couponKeys.detail(id),
    queryFn: () => api.get<CouponRecord>(`/coupons/${id}`),
    enabled: !!id,
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation<CouponRecord, Error, CreateCouponRequest>({
    mutationFn: (body) => api.post<CouponRecord>("/coupons", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons", "list"] }),
  });
}

export function useUpdateCoupon(id: string) {
  const qc = useQueryClient();
  return useMutation<CouponRecord, Error, UpdateCouponRequest>({
    mutationFn: (body) => api.patch<CouponRecord>(`/coupons/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["coupons", "list"] });
      qc.invalidateQueries({ queryKey: couponKeys.detail(id) });
    },
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete<void>(`/coupons/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons", "list"] }),
  });
}
