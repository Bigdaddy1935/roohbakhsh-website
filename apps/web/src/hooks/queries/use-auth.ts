"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, tokenStore } from "@/lib/api-client";
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
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

export function useVerifyEmail() {
  return useMutation<void, Error, VerifyEmailRequest>({
    mutationFn: (body) => api.post<void>("/auth/verify-email", body),
  });
}

export function useResendVerification() {
  return useMutation<void, Error, ResendVerificationRequest>({
    mutationFn: (body) => api.post<void>("/auth/resend-verification", body),
  });
}

export function useChangePassword() {
  return useMutation<void, Error, { newPassword: string }>({
    mutationFn: (data) => api.post<void>("/auth/change-password", data),
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
