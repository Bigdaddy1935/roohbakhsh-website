import type { ApiHeaderOptions } from "@nestjs/swagger";

export const LANG_HEADER: ApiHeaderOptions = {
  name: "Accept-Language",
  description: "زبان پیام‌های خطا — `ar` (پیش‌فرض) یا `ur`",
  required: false,
  schema: { type: "string", enum: ["ar", "ur"], default: "ar" },
};
