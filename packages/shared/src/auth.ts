// ──────────────────────────────────────────────────────
// احراز هویت و کاربر — منبع داده: بک‌اند NestJS
// (نه CMS. حساب‌های کاربری نهایی مال NestJS است.)
// ──────────────────────────────────────────────────────

import type { ID, ISODate, Locale, Money } from "./common";
import type { Ticket } from "./ticket";
import type { RecentViewItem } from "./recently-viewed";
import type { FavoriteItem } from "./favorite";
import type { CourseProgress } from "./progress";

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
  isActive: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
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

/** خروجی داشبورد پروفایل کاربر — GET /users/me/dashboard */
export interface UserDashboard {
  /** مجموع پرداختی کاربر روی سفارش‌های paid — null یعنی هیچ پرداختی ثبت نشده. */
  totalSpent: Money | null;
  /** تعداد دوره‌های متمایزی که کاربر خریده (از روی سفارش‌های paid). */
  myCoursesCount: number;
  /** تعداد کل تیکت‌های کاربر. */
  ticketsCount: number;
  /** آخرین تیکت‌ها — حداکثر ۳ مورد. */
  recentTickets: Ticket[];
  /** آخرین بازدیدها — دوره یا درس، حداکثر ۵ مورد. */
  recentViews: RecentViewItem[];
  /** علاقه‌مندی‌ها — دوره یا مقاله. */
  favorites: FavoriteItem[];
  /** درصد پیشرفت برای دوره‌هایی که کاربر خریده. */
  coursesProgress: CourseProgress[];
}
