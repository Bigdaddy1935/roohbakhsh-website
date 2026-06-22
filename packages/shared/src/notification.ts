// ──────────────────────────────────────────────────────────────
// اعلانات — پیام دلخواهی که ادمین برای همه‌ی کاربران ارسال می‌کند
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate, Localized } from "./common";

/** یک اعلان — global است (برای همه‌ی کاربران یکسان)، وضعیت خوانده‌شدن per-user است. */
export interface NotificationItem {
  id: ID;
  title: Localized;
  body: Localized;
  /** لینکی که با کلیک روی اعلان باز می‌شود — اختیاری (مثلاً به یک دوره/مقاله/صفحه). */
  link: string | null;
  createdAt: ISODate;
  isRead: boolean;
}

export interface CreateNotificationRequest {
  title: Localized;
  body: Localized;
  link?: string | null;
}

export interface NotificationsSummary {
  unreadCount: number;
}
