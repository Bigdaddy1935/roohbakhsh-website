// ──────────────────────────────────────────────────────────────
// درصد پیشرفت دوره — بر اساس مدت‌زمان درس‌هایی که کاربر آنلاین دیده
// ──────────────────────────────────────────────────────────────

import type { ID } from "./common";

export interface CourseProgress {
  courseId: ID;
  courseSlug: string;
  /** مجموع مدت‌زمان درس‌هایی که کاربر دیده (دقیقه). */
  watchedMinutes: number;
  /** مدت‌زمان کل دوره (دقیقه). */
  totalMinutes: number;
  /** درصد پیشرفت — ۰ تا ۱۰۰. totalMinutes صفر یعنی پیشرفت صفر. */
  progressPercent: number;
}
