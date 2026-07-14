// ──────────────────────────────────────────────────────────────
// تیکتینگ ساده — منبع داده: NestJS (فاز ۱: «سیستم ساده تیکتینگ یا چت ساده»)
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate, Paginated } from "./common";

export type TicketStatus = "open" | "answered" | "closed";

/** فرستنده‌ی یک پیام تیکت: کاربر یا پشتیبانی. */
export type TicketMessageAuthorType = "user" | "support";

export interface Ticket {
  id: ID;
  userId: ID | null;
  guestEmail: string | null;
  subject: string;
  status: TicketStatus;
  createdAt: ISODate;
  updatedAt: ISODate;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id: ID;
  body: string;
  authorType: TicketMessageAuthorType;
  createdAt: ISODate;
}

export type PaginatedTickets = Paginated<Ticket>;

/** نسخه‌ی ادمین تیکت — شامل اطلاعات کاربر. */
export interface AdminTicket extends Ticket {
  user: { id: ID; fullName: string; email: string } | null;
}

export type PaginatedAdminTickets = Paginated<AdminTicket>;

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
