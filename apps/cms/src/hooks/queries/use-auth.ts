"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, tokenStore, apiRequest } from "@/lib/api-client";
import type { AuthResponse, LoginRequest, User } from "@roohbakhsh/shared";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export function useMe() {
  return useQuery<User>({
    queryKey: authKeys.me,
    queryFn: () => api.get<User>("/auth/me"),
    enabled: typeof window !== "undefined" && !!tokenStore.getAccess(),
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (body) => api.post<AuthResponse>("/auth/login", body),
    onSuccess: (data) => {
      tokenStore.set(data.accessToken, data.refreshToken);
      qc.setQueryData(authKeys.me, data.user);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () =>
      apiRequest<void>("/auth/logout", {
        method: "DELETE",
        body: JSON.stringify({ refreshToken: tokenStore.getRefresh() }),
      }),
    onSettled: () => {
      tokenStore.clear();
      qc.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation<void, Error, { email: string }>({
    mutationFn: (body) => api.post<void>("/auth/forgot-password", body),
  });
}

export function useResetPassword() {
  return useMutation<void, Error, { token: string; newPassword: string }>({
    mutationFn: (body) => api.post<void>("/auth/reset-password", body),
  });
}
