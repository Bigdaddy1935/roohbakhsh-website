"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, tokenStore } from "@/lib/api-client";
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  User,
} from "@roohbakhsh/shared";

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

export function useRegister() {
  const qc = useQueryClient();
  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: (body) => api.post<AuthResponse>("/auth/register", body),
    onSuccess: (data) => {
      tokenStore.set(data.accessToken, data.refreshToken);
      qc.setQueryData(authKeys.me, data.user);
    },
  });
}

export function useForgotPassword() {
  return useMutation<void, Error, ForgotPasswordRequest>({
    mutationFn: (body) => api.post<void>("/auth/forgot-password", body),
  });
}

export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordRequest>({
    mutationFn: (body) => api.post<void>("/auth/reset-password", body),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: () =>
      api.delete<void>("/auth/logout", { refreshToken: tokenStore.getRefresh() }),
    onSettled: () => {
      tokenStore.clear();
      qc.clear();
    },
  });
}
