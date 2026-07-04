"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { AdminMonthlyStats } from "@roohbakhsh/shared";

export function useAdminMonthlyStats(year?: number) {
  const query = year ? `?year=${year}` : "";
  return useQuery<AdminMonthlyStats>({
    queryKey: ["admin", "monthly-stats", year],
    queryFn: () => api.get<AdminMonthlyStats>(`/admin/stats/monthly${query}`),
    staleTime: 60_000,
  });
}
