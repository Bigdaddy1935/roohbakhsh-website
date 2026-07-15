// ──────────────────────────────────────────────────────────────
// کارمندان (اساتید + نویسندگان) — CMS (read) + NestJS API (CRUD)
// ──────────────────────────────────────────────────────────────

import type { ID, ISODate, Localized } from "./common";

export type StaffType = "instructor" | "author";

/** نسخه‌ی خلاصه — وقتی داخل کارت دوره نمایش داده می‌شود. */
export interface InstructorSummary {
  id: ID;
  slug: string;
  name: Localized;
  avatarUrl: string | null;
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

/** پاسخ API بک‌اند (NestJS) برای یک کارمند (استاد یا نویسنده). */
export interface InstructorRecord {
  id: ID;
  name: Localized;
  slug: string;
  avatarUrl: string | null;
  bio: Localized | null;
  staffType: StaffType;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface CreateInstructorRequest {
  name: Localized;
  slug: string;
  avatarUrl?: string;
  bio?: Localized;
  staffType?: StaffType;
}

export interface UpdateInstructorRequest {
  name?: Localized;
  slug?: string;
  avatarUrl?: string;
  bio?: Localized | null;
  staffType?: StaffType;
}
