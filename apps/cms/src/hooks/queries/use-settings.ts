"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { PaymentDestinationAccount } from "@roohbakhsh/shared";

const settingKeys = {
  paymentDestination: ["settings", "payment-destination"] as const,
};

export function usePaymentDestination() {
  return useQuery<PaymentDestinationAccount>({
    queryKey: settingKeys.paymentDestination,
    queryFn: () => api.get<PaymentDestinationAccount>("/settings/payment-destination"),
  });
}

export function useUpdatePaymentDestination() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PaymentDestinationAccount>) =>
      api.patch<PaymentDestinationAccount>("/settings/payment-destination", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: settingKeys.paymentDestination }),
  });
}
