// ──────────────────────────────────────────────────────────────
// اساتید — CMS (read) + NestJS API (CRUD)
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate, Localized } from "./common";

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
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: "telegram" | "instagram" | "youtube" | "x" | "website";
  url: string;
}

// ── NestJS API contract ────────────────────────────────────────

/** پاسخ API بک‌اند (NestJS) برای یک استاد. */
export interface InstructorRecord {
  id: ID;
  name: Localized;
  slug: string;
  avatarUrl: string;
  bio: Localized | null;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CreateInstructorRequest {
  name: Localized;
  slug: string;
  avatarUrl: string;
  bio?: Localized;
}

export interface UpdateInstructorRequest {
  name?: Localized;
  slug?: string;
  avatarUrl?: string;
  bio?: Localized | null;
}
