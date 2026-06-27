// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Ø§Ø­Ø±Ø§Ø² Ù‡ÙˆÛŒØª Ùˆ Ú©Ø§Ø±Ø¨Ø± â€” Ù…Ù†Ø¨Ø¹ Ø¯Ø§Ø¯Ù‡: Ø¨Ú©â€ŒØ§Ù†Ø¯ NestJS
// (Ù†Ù‡ CMS. Ø­Ø³Ø§Ø¨â€ŒÙ‡Ø§ÛŒ Ú©Ø§Ø±Ø¨Ø±ÛŒ Ù†Ù‡Ø§ÛŒÛŒ Ù…Ø§Ù„ NestJS Ø§Ø³Øª.)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

import type { ID, ISODate, Locale } from "./common";

export type UserRole = "user" | "instructor" | "admin";

/** Ú©Ø§Ø±Ø¨Ø± â€” Ù‡Ù…Ø§Ù† Ú†ÛŒØ²ÛŒ Ú©Ù‡ Ø¯Ø± Ø¯Ø§Ø´Ø¨ÙˆØ±Ø¯ Ú©Ø§Ø±Ø¨Ø±ÛŒ Ù†Ù…Ø§ÛŒØ´ Ø¯Ø§Ø¯Ù‡ Ù…ÛŒâ€ŒØ´ÙˆØ¯. */
export interface User {
  id: ID;
  email: string;
  phone: string | null;
  fullName: string;
  role: UserRole;
  preferredLocale: Locale;
  avatarUrl: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
}

// â”€â”€ ÙˆØ±ÙˆØ¯ÛŒ/Ø®Ø±ÙˆØ¬ÛŒ APIÙ‡Ø§ â”€â”€

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  preferredLocale: Locale;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** Ù¾Ø§Ø³Ø® Ù…Ø´ØªØ±Ú© Ø«Ø¨Øªâ€ŒÙ†Ø§Ù… Ùˆ ÙˆØ±ÙˆØ¯. */
export interface AuthResponse {
  user: User;
  /** ØªÙˆÚ©Ù† JWT â€” ÙØ±Ø§Ù†Øª Ø¢Ù† Ø±Ø§ Ø°Ø®ÛŒØ±Ù‡ Ùˆ Ø¯Ø± Ù‡Ø¯Ø± Ù‡Ø± Ø¯Ø±Ø®ÙˆØ§Ø³Øª Ù…ÛŒâ€ŒÙØ±Ø³ØªØ¯. */
  accessToken: string;
  /** Ø¨Ø±Ø§ÛŒ ØªÙ…Ø¯ÛŒØ¯ ØªÙˆÚ©Ù†. */
  refreshToken: string;
}


export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
