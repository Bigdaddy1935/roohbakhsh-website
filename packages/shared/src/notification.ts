// ──────────────────────────────────────────────────────────────
// اعلان‌ها — NestJS API
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate } from "./common";

export interface Notification {
  id: ID;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: ISODate;
}

export interface UnreadCountResponse {
  count: number;
}
