"use client";

import { useQuery } from "@tanstack/react-query";
import { api, tokenStore } from "@/lib/api-client";
import type { UserDashboard } from "@roohbakhsh/shared";

export const dashboardKeys = {
  me: ["dashboard", "me"] as const,
};

export function useDashboard() {
  return useQuery<UserDashboard>({
    queryKey: dashboardKeys.me,
    queryFn: () => api.get<UserDashboard>("/users/me/dashboard"),
    enabled: typeof window !== "undefined" && !!tokenStore.getAccess(),
  });
}
