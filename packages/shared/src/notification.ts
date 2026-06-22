// ──────────────────────────────────────────────────────────────
// اعلانات — خبر جدید، دوره‌ی جدید، کد تخفیف جدید
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate, Localized } from "./common";

export type NotificationType = "course" | "article" | "coupon";

/** یک اعلان — global است (برای همه‌ی کاربران یکسان)، وضعیت خوانده‌شدن per-user است. */
export interface NotificationItem {
  id: ID;
  type: NotificationType;
  targetId: ID;
  title: Localized;
  /** برای course/article: اسلاگ برای لینک‌دهی. برای coupon: کد تخفیف. */
  slug: string | null;
  createdAt: ISODate;
  isRead: boolean;
}

export interface NotificationsSummary {
  unreadCount: number;
}
