"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ValidateCouponRequest, ValidateCouponResponse } from "@roohbakhsh/shared";

export function useValidateCoupon() {
  return useMutation<ValidateCouponResponse, Error, ValidateCouponRequest>({
    mutationFn: (body) => api.post<ValidateCouponResponse>("/coupons/validate", body),
  });
}
