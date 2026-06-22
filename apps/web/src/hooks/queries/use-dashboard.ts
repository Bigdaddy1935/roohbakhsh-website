"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { DashboardResponse } from "@roohbakhsh/shared";

export const dashboardKeys = {
  me: ["dashboard", "me"] as const,
};

export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: dashboardKeys.me,
    queryFn: () => api.get<DashboardResponse>("/users/me/dashboard"),
  });
}
