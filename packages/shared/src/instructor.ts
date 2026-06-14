// ──────────────────────────────────────────────────────────────
// اساتید — منبع داده: CMS
// ──────────────────────────────────────────────────────────────

import type { ID, Localized } from "./common";

/** نسخه‌ی خلاصه — وقتی داخل کارت دوره نمایش داده می‌شود. */
export interface InstructorSummary {
  id: ID;
  slug: string;
  name: Localized;
  avatarUrl: string;
}

/** نسخه‌ی کامل — برای صفحه‌ی معرفی استاد. */
export interface InstructorDetail extends InstructorSummary {
  bio: Localized;
  /** لینک شبکه‌های اجتماعی (مثلاً سیدکاظم در سند فاز ۱). */
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: "telegram" | "instagram" | "youtube" | "x" | "website";
  url: string;
}
