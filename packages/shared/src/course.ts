// ──────────────────────────────────────────────────────────────
// دوره‌ها — منبع داده: CMS (Payload/Strapi)
// تولید/ویرایش محتوای دوره در پنل CMS انجام می‌شود.
// سایت این داده‌ها را فقط می‌خوانَد (read-only).
// ──────────────────────────────────────────────────────────────

import type { ID, Localized, Money, ISODate } from "./common";
import type { InstructorSummary } from "./instructor";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type CourseStatus = "draft" | "published" | "archived";

/** نسخه‌ی سبک دوره — برای کارت‌ها و لیست‌ها (صفحه‌ی دوره‌ها). */
export interface CourseListItem {
  id: ID;
  slug: string; // برای URL: /courses/:slug
  title: Localized;
  excerpt: Localized; // توضیح کوتاه روی کارت
  thumbnailUrl: string;
  level: CourseLevel;
  price: Money | null; // null یعنی رایگان
  instructor: InstructorSummary;
  /** آیا حداقل یک جلسه‌ی رایگان دارد (طبق نیازمندی فاز ۳). */
  hasFreePreview: boolean;
}

/** نسخه‌ی کامل دوره — برای صفحه‌ی جزئیات دوره. */
export interface CourseDetail extends CourseListItem {
  description: Localized; // توضیح کامل (HTML/Markdown)
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
  /** جلسه‌ی رایگان قابل مشاهده بدون خرید؟ */
  isFreePreview: boolean;
}

/** فیلترهای صفحه‌ی دوره‌ها که فرانت به API می‌فرستد. */
export interface CourseListQuery {
  level?: CourseLevel;
  instructorId?: ID;
  tag?: string;
  search?: string;
}
