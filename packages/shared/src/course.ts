// ──────────────────────────────────────────────────────────────
// دوره‌ها — CMS (read) + NestJS API (CRUD)
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate, Localized, Money } from "./common";
import type { InstructorSummary } from "./instructor";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type CourseStatus = "draft" | "published" | "archived";

/** وضعیت برگزاری دوره — مستقل از isPublished */
export type CourseRunStatus = "ongoing" | "upcoming" | "completed";

/** نحوه دسترسی به محتوای دوره */
export type AccessType = "online_only" | "downloadable";

/** نسخه‌ی سبک دوره — برای کارت‌ها و لیست‌ها (صفحه‌ی دوره‌ها). */
export interface CourseListItem {
  id: ID;
  slug: string;
  title: Localized;
  excerpt: Localized;
  thumbnailUrl: Localized<string | null>;
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
  videoUrl: Localized<string | null>;
  order: number;
  durationMinutes: number;
  isFreePreview: boolean;
  sectionId: ID;
  courseId: ID;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CreateLessonRequest {
  title: Localized;
  videoUrl?: Localized<string | null>;
  order?: number;
  durationMinutes: number;
  isFreePreview?: boolean;
}

export interface UpdateLessonRequest {
  title?: Localized;
  videoUrl?: Localized<string | null>;
  order?: number;
  durationMinutes?: number;
  isFreePreview?: boolean;
}

/** یک سرفصل از دوره — پاسخ API بک‌اند. */
export interface SectionRecord {
  id: ID;
  courseId: ID;
  title: Localized;
  order: number;
  lessons: Lesson[];
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CreateSectionRequest {
  title: Localized;
  order?: number;
}

export interface UpdateSectionRequest {
  title?: Localized;
  order?: number;
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
  thumbnailUrl: Localized<string | null>;
  /** ویدیوی معرفی دوره — دو زبانه، مثل thumbnailUrl. */
  introVideoUrl: Localized<string | null>;
  /** قیمت اصلی دوره — null یعنی رایگان. */
  price: Money | null;
  /** اطلاعات تخفیف — null یعنی بدون تخفیف. */
  discount: CourseDiscount | null;
  /** قیمت واقعی که کاربر پرداخت می‌کند (price یا discountedPrice بسته به فعال بودن تخفیف). */
  effectivePrice: Money | null;
  durationMinutes: number;
  lessonCount: number;
  /** میانگین امتیاز نظرات (۱ تا ۵) — null یعنی هنوز نظری ثبت نشده. */
  averageRating: number | null;
  /** تعداد کل نظرات ثبت‌شده روی این دوره. */
  reviewCount: number;
  /** تعداد کاربران یکتایی که این دوره را با سفارش paid خریده‌اند. */
  participantCount: number;
  level: CourseLevel;
  /** وضعیت برگزاری: ongoing=در حال برگزاری، upcoming=به زودی، completed=پایان‌یافته */
  runStatus: CourseRunStatus;
  /** نحوه دسترسی: online_only=فقط آنلاین، downloadable=قابل دانلود */
  accessType: AccessType;
  isPublished: boolean;
  instructorId: ID;
  instructor: InstructorSummary;
  categoryId: ID | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CourseStatsSummary {
  studentsCount: number;
  coursesCount: number;
  totalHours: number;
}

export interface CreateCourseRequest {
  title: Localized;
  slug: string;
  description: Localized;
  thumbnailUrl?: Localized<string | null>;
  introVideoUrl?: Localized<string | null>;
  price?: Money | null;
  level?: CourseLevel;
  runStatus?: CourseRunStatus;
  accessType?: AccessType;
  instructorId: ID;
  categoryId?: ID | null;
  discountPrice?: Money | null;
  discountExpiresAt?: ISODate | null;
}

export interface UpdateCourseRequest {
  title?: Localized;
  slug?: string;
  description?: Localized;
  thumbnailUrl?: Localized<string | null>;
  introVideoUrl?: Localized<string | null>;
  price?: Money | null;
  level?: CourseLevel;
  runStatus?: CourseRunStatus;
  accessType?: AccessType;
  isPublished?: boolean;
  instructorId?: ID;
  categoryId?: ID | null;
  /** قیمت تخفیف‌خورده — null برای حذف تخفیف. */
  discountPrice?: Money | null;
  /** تاریخ انقضای تخفیف (ISO 8601) — null یعنی تخفیف دائمی. */
  discountExpiresAt?: ISODate | null;
}
