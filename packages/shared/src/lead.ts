// ──────────────────────────────────────────────────────────────
// جمع‌آوری سرنخ (ایمیل/شماره) و ثبت‌نام در رویداد — منبع داده: NestJS
// مربوط به فاز ۱: «فرم جمع‌آوری ایمیل/شماره تماس» و «ثبت‌نام در یک رویداد».
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate } from "./common";

/** فرم ساده‌ی جمع‌آوری ایمیل/شماره (نیوزلتر یا تماس). */
export interface LeadRequest {
  email: string;
  phone?: string;
  fullName?: string;
  /** از کدام صفحه/فرم آمده، برای گزارش‌گیری. */
  source: string;
}

export interface Lead extends LeadRequest {
  id: ID;
  createdAt: ISODate;
}

/** ثبت‌نام در یک رویداد/دوره/کلاس (فاز ۱). */
export interface EventRegistrationRequest {
  eventId: ID;
  fullName: string;
  email: string;
  phone: string;
}

export interface EventRegistration extends EventRegistrationRequest {
  id: ID;
  status: "pending" | "confirmed";
  createdAt: ISODate;
}
