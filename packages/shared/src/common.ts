// ──────────────────────────────────────────────────────────────
// تایپ‌های پایه و مشترک کل پروژه
// این فایل قلب «قرارداد» است. بک‌اند و هر دو فرانت از همین استفاده می‌کنند.
// هر تغییری اینجا، فوراً در ادیتور همه نمایان می‌شود.
// ──────────────────────────────────────────────────────────────

/** زبان‌های پشتیبانی‌شده. سایت RTL است (عربی + اردو). */
export type Locale = "ar" | "ur";

export const SUPPORTED_LOCALES: Locale[] = ["ar", "ur"];
export const DEFAULT_LOCALE: Locale = "ar";

/**
 * متن چندزبانه. هر فیلد متنی که کاربر می‌بیند باید از این نوع باشد.
 * مثال: title: Localized => { ar: "...", ur: "..." }
 */
export type Localized<T = string> = Record<Locale, T>;

/** پول — برای پرداخت ارزی فاز ۳. مبلغ همیشه به کوچک‌ترین واحد ذخیره شود. */
export interface Money {
  /** مبلغ به کوچک‌ترین واحد ارز (سنت برای USD/EUR، ریال برای IRR) */
  amountMinor: number;
  currency: "USD" | "EUR" | "IRR";
}

/** پارامترهای صفحه‌بندی که فرانت به API می‌فرستد. */
export interface PaginationQuery {
  page?: number; // از 1 شروع
  pageSize?: number; // پیش‌فرض 12
}

/** پاسخ صفحه‌بندی‌شده — همه‌ی لیست‌ها این شکل را برمی‌گردانند. */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * شکل استاندارد خطای API. بک‌اند همیشه خطا را به این شکل برمی‌گرداند
 * تا فرانت یک‌جا و یکدست هندلش کند.
 */
export interface ApiError {
  statusCode: number;
  /** کد ماشین‌خوان برای فرانت، مثل "EMAIL_TAKEN" */
  code: string;
  /** پیام قابل‌نمایش (در صورت نیاز چندزبانه) */
  message: string;
  /** جزئیات اعتبارسنجی فیلدها (اختیاری) */
  fields?: Record<string, string>;
}

/** شناسه یکتا (در دیتابیس uuid). */
export type ID = string;

/** زمان به‌صورت رشته ISO 8601، مثل "2026-06-13T10:00:00Z". */
export type ISODate = string;
