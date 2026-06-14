// ──────────────────────────────────────────────────────────────
// احراز هویت و کاربر — منبع داده: بک‌اند NestJS
// (نه CMS. حساب‌های کاربری نهایی مال NestJS است.)
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate, Locale } from "./common";

export type UserRole = "user" | "instructor" | "admin";

/** کاربر — همان چیزی که در داشبورد کاربری نمایش داده می‌شود. */
export interface User {
  id: ID;
  email: string;
  phone: string | null;
  fullName: string;
  role: UserRole;
  preferredLocale: Locale;
  avatarUrl: string | null;
  createdAt: ISODate;
}

// ── ورودی/خروجی APIها ──

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  preferredLocale: Locale;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** پاسخ مشترک ثبت‌نام و ورود. */
export interface AuthResponse {
  user: User;
  /** توکن JWT — فرانت آن را ذخیره و در هدر هر درخواست می‌فرستد. */
  accessToken: string;
  /** برای تمدید توکن. */
  refreshToken: string;
}
