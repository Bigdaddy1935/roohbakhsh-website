// ──────────────────────────────────────────────────────────────
// بازدیدهای اخیر کاربر — دوره یا درس
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate, Localized } from "./common";

export type RecentViewType = "course" | "lesson";

/** یک آیتم در لیست «آخرین بازدیدها». */
export interface RecentViewItem {
  type: RecentViewType;
  id: ID;
  title: Localized;
  thumbnailUrl: Localized<string | null>;
  /** دوره‌ی مرتبط — برای lesson همان دوره‌ی والد، برای course خودش. */
  courseId: ID;
  courseSlug: string;
  viewedAt: ISODate;
}

/** بدنه‌ی درخواست ثبت بازدید — وقتی کاربر صفحه‌ی دوره یا درس را باز می‌کند. */
export interface RecordViewRequest {
  type: RecentViewType;
  id: ID;
}
