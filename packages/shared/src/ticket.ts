// ──────────────────────────────────────────────────────────────
// تیکتینگ ساده — منبع داده: NestJS (فاز ۱: «سیستم ساده تیکتینگ یا چت ساده»)
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate } from "./common";

export type TicketStatus = "open" | "answered" | "closed";

export interface Ticket {
  id: ID;
  subject: string;
  status: TicketStatus;
  createdAt: ISODate;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: ID;
  body: string;
  /** فرستنده: کاربر یا پشتیبانی. */
  authorType: "user" | "support";
  createdAt: ISODate;
}

export interface CreateTicketRequest {
  subject: string;
  body: string;
  /** برای کاربر مهمان که هنوز ثبت‌نام نکرده. */
  guestEmail?: string;
}

export interface ReplyTicketRequest {
  ticketId: ID;
  body: string;
}
