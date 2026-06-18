import type { Locale } from "@roohbakhsh/shared";

type LocalizedMsg = Record<Locale, string>;

// ── کدهای خطای کسب‌وکاری ──────────────────────────────────────────────────
export const ERROR_MESSAGES: Record<string, LocalizedMsg> = {
  // auth
  EMAIL_TAKEN: {
    ar: "هذا البريد الإلكتروني مسجّل مسبقاً",
    ur: "یہ ای میل پہلے سے رجسٹرڈ ہے",
  },
  INVALID_CREDENTIALS: {
    ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    ur: "ای میل یا پاس ورڈ غلط ہے",
  },
  INVALID_REFRESH_TOKEN: {
    ar: "رمز التحديث غير صالح أو منتهية صلاحيته",
    ur: "ریفریش ٹوکن غلط ہے یا میعاد ختم ہو گئی",
  },
  // عمومی
  VALIDATION_ERROR: {
    ar: "البيانات المُدخَلة غير صحيحة",
    ur: "درج کردہ ڈیٹا غلط ہے",
  },
  INTERNAL_ERROR: {
    ar: "حدث خطأ في الخادم، يرجى المحاولة لاحقاً",
    ur: "سرور میں خرابی آئی، بعد میں دوبارہ کوشش کریں",
  },
  Unauthorized: {
    ar: "غير مصرح بالوصول",
    ur: "رسائی کی اجازت نہیں",
  },
  FORBIDDEN: {
    ar: "ليس لديك صلاحية للوصول إلى هذا المورد",
    ur: "آپ کو اس ریسورس تک رسائی کی اجازت نہیں",
  },
  NOT_FOUND: {
    ar: "المورد المطلوب غير موجود",
    ur: "مطلوبہ ریسورس موجود نہیں",
  },
  // category
  CATEGORY_NOT_FOUND: {
    ar: "التصنيف المطلوب غير موجود",
    ur: "مطلوبہ زمرہ موجود نہیں",
  },
  PARENT_CATEGORY_NOT_FOUND: {
    ar: "التصنيف الأب غير موجود",
    ur: "والد زمرہ موجود نہیں",
  },
  SLUG_TAKEN: {
    ar: "هذا الرابط (slug) مستخدم مسبقاً",
    ur: "یہ slug پہلے سے استعمال میں ہے",
  },
  CATEGORY_HAS_CHILDREN: {
    ar: "لا يمكن حذف التصنيف لأنه يحتوي على تصنيفات فرعية",
    ur: "زمرہ حذف نہیں ہو سکتا کیونکہ اس میں ذیلی زمرے موجود ہیں",
  },
  CANNOT_SET_SELF_AS_PARENT: {
    ar: "لا يمكن تعيين التصنيف كوالد لنفسه",
    ur: "زمرہ اپنا خود والد نہیں بن سکتا",
  },
  CIRCULAR_PARENT_REFERENCE: {
    ar: "لا يمكن تعيين تصنيف فرعي كوالد — سيؤدي ذلك إلى حلقة لا نهائية",
    ur: "ذیلی زمرے کو والد نہیں بنایا جا سکتا — یہ لامحدود لوپ بنائے گا",
  },
  // instructor
  INSTRUCTOR_NOT_FOUND: {
    ar: "المدرّس المطلوب غير موجود",
    ur: "مطلوبہ استاد موجود نہیں",
  },
  INSTRUCTOR_SLUG_TAKEN: {
    ar: "هذا الرابط (slug) مستخدم مسبقاً من قِبَل مدرّس آخر",
    ur: "یہ slug پہلے سے کسی اور استاد کے لیے استعمال میں ہے",
  },
  // course
  COURSE_NOT_FOUND: {
    ar: "الدورة المطلوبة غير موجودة",
    ur: "مطلوبہ کورس موجود نہیں",
  },
  COURSE_SLUG_TAKEN: {
    ar: "هذا الرابط (slug) مستخدم مسبقاً من قِبَل دورة أخرى",
    ur: "یہ slug پہلے سے کسی اور کورس کے لیے استعمال میں ہے",
  },
  // lesson
  LESSON_NOT_FOUND: {
    ar: "الدرس المطلوب غير موجود",
    ur: "مطلوبہ سبق موجود نہیں",
  },
};

// ── ترجمه‌ی پیام‌های validation از class-validator ────────────────────────
// پیام‌ها به شکل "fieldName must be ..." می‌آیند — فیلد رو جدا می‌کنیم.
const VALIDATION_PATTERNS: Array<{
  pattern: RegExp;
  ar: (field: string, match: RegExpMatchArray) => string;
  ur: (field: string, match: RegExpMatchArray) => string;
}> = [
  {
    pattern: /must be an email/,
    ar: (f) => `يجب أن يكون ${f} بريداً إلكترونياً صحيحاً`,
    ur: (f) => `${f} ایک درست ای میل ہونی چاہیے`,
  },
  {
    pattern: /must be longer than or equal to (\d+) characters/,
    ar: (f, m) => `يجب أن يكون ${f} ${m[1]} أحرف على الأقل`,
    ur: (f, m) => `${f} کم از کم ${m[1]} حروف کا ہونا ضروری ہے`,
  },
  {
    pattern: /must be shorter than or equal to (\d+) characters/,
    ar: (f, m) => `يجب أن لا يتجاوز ${f} ${m[1]} حرفاً`,
    ur: (f, m) => `${f} زیادہ سے زیادہ ${m[1]} حروف ہونے چاہئیں`,
  },
  {
    pattern: /must be a string/,
    ar: (f) => `يجب أن يكون ${f} نصاً`,
    ur: (f) => `${f} متن ہونا چاہیے`,
  },
  {
    pattern: /must be one of:/,
    ar: (f) => `قيمة ${f} غير مدعومة`,
    ur: (f) => `${f} کی قدر قابل قبول نہیں`,
  },
  {
    pattern: /should not be empty/,
    ar: (f) => `${f} مطلوب`,
    ur: (f) => `${f} ضروری ہے`,
  },
  {
    pattern: /must be a number/,
    ar: (f) => `يجب أن يكون ${f} رقماً`,
    ur: (f) => `${f} عدد ہونا چاہیے`,
  },
];

export function localizeValidationMessage(
  rawMsg: string,
  locale: Locale,
): string {
  const parts = rawMsg.split(" ");
  const field = parts[0] ?? "";
  const rest = parts.slice(1).join(" ");

  for (const { pattern, ar, ur } of VALIDATION_PATTERNS) {
    const match = rest.match(pattern);
    if (match) {
      return locale === "ar" ? ar(field, match) : ur(field, match);
    }
  }
  // fallback: پیام اصلی
  return rawMsg;
}

export function localizeErrorCode(code: string, locale: Locale): string {
  return ERROR_MESSAGES[code]?.[locale] ?? code;
}

export function parseLocale(acceptLanguage: string | undefined): Locale {
  const lang = acceptLanguage?.split(",")[0]?.trim().toLowerCase();
  if (lang === "ur") return "ur";
  return "ar"; // default
}
