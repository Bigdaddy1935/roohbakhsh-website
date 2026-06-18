// ──────────────────────────────────────────────────────────────
// دوره‌ها — CMS (read) + NestJS API (CRUD)
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate, Localized, Money } from "./common";
import type { InstructorSummary } from "./instructor";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type CourseStatus = "draft" | "published" | "archived";

/** نسخه‌ی سبک دوره — برای کارت‌ها و لیست‌ها (صفحه‌ی دوره‌ها). */
export interface CourseListItem {
  id: ID;
  slug: string;
  title: Localized;
  excerpt: Localized;
  thumbnailUrl: string;
  level: CourseLevel;
  price: Money | null;
  instructor: InstructorSummary;
  hasFreePreview: boolean;
}

/** نسخه‌ی کامل دوره — برای صفحه‌ی جزئیات دوره. */
export interface CourseDetail extends CourseListItem {
  description: Localized;
  status: CourseStatus;
  sections: CourseSection[];
  totalSessions: number;
  totalDurationMinutes: number;
  tags: string[];
  publishedAt: ISODate | null;
}

/** بخش‌بندی دوره (فصل‌ها) — ساختار دوره در فاز ۳. */
export interface CourseSection {
  id: ID;
  title: Localized;
  order: number;
  sessions: CourseSession[];
}

/** یک جلسه از دوره. */
export interface CourseSession {
  id: ID;
  title: Localized;
  order: number;
  durationMinutes: number;
  isFreePreview: boolean;
}

/** فیلترهای صفحه‌ی دوره‌ها که فرانت به API می‌فرستد. */
export interface CourseListQuery {
  level?: CourseLevel;
  instructorId?: ID;
  tag?: string;
  search?: string;
}

// ── NestJS API contract ────────────────────────────────────────

/** یک درس از دوره — پاسخ API بک‌اند. */
export interface Lesson {
  id: ID;
  title: Localized;
  order: number;
  durationMinutes: number;
  isFreePreview: boolean;
  courseId: ID;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CreateLessonRequest {
  title: Localized;
  order?: number;
  durationMinutes: number;
  isFreePreview?: boolean;
}

export interface UpdateLessonRequest {
  title?: Localized;
  order?: number;
  durationMinutes?: number;
  isFreePreview?: boolean;
}

/** اطلاعات تخفیف فعال روی یک دوره. */
export interface CourseDiscount {
  /** قیمت تخفیف‌خورده. */
  price: Money;
  /** تاریخ انقضا — null یعنی تخفیف دائمی است. */
  expiresAt: ISODate | null;
  /** آیا تخفیف الان فعال است؟ (محاسبه‌شده: بدون انقضا یا انقضا در آینده) */
  isActive: boolean;
}

/** پاسخ API بک‌اند برای یک دوره. */
export interface CourseRecord {
  id: ID;
  title: Localized;
  slug: string;
  description: Localized;
  thumbnailUrl: string | null;
  /** قیمت اصلی دوره — null یعنی رایگان. */
  price: Money | null;
  /** اطلاعات تخفیف — null یعنی بدون تخفیف. */
  discount: CourseDiscount | null;
  /** قیمت واقعی که کاربر پرداخت می‌کند (price یا discountedPrice بسته به فعال بودن تخفیف). */
  effectivePrice: Money | null;
  durationMinutes: number;
  lessonCount: number;
  level: CourseLevel;
  isPublished: boolean;
  instructorId: ID;
  instructor: InstructorSummary;
  categoryId: ID | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CreateCourseRequest {
  title: Localized;
  slug: string;
  description: Localized;
  thumbnailUrl?: string;
  price?: Money | null;
  level?: CourseLevel;
  instructorId: ID;
  categoryId?: ID | null;
  discountPrice?: Money | null;
  discountExpiresAt?: ISODate | null;
}

export interface UpdateCourseRequest {
  title?: Localized;
  slug?: string;
  description?: Localized;
  thumbnailUrl?: string | null;
  price?: Money | null;
  level?: CourseLevel;
  isPublished?: boolean;
  instructorId?: ID;
  categoryId?: ID | null;
  /** قیمت تخفیف‌خورده — null برای حذف تخفیف. */
  discountPrice?: Money | null;
  /** تاریخ انقضای تخفیف (ISO 8601) — null یعنی تخفیف دائمی. */
  discountExpiresAt?: ISODate | null;
}
