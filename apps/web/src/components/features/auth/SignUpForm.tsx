"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import {
  RiUserLine, RiPhoneLine, RiMailLine,
  RiEyeLine, RiEyeOffLine, RiLoader4Line,
} from "react-icons/ri";
import AuthCard from "./AuthCard";
import { useRegister } from "@/hooks/queries/use-auth";
import type { ApiError } from "@roohbakhsh/shared";

// ── i18n strings ─────────────────────────────────────────────────
const UI = {
  ar: {
    title: "إنشاء حساب جديد",
    sub: "لديك حساب بالفعل؟",
    subLink: "تسجيل الدخول",
    name: "الاسم الكامل",
    namePlaceholder: "مثال: أحمد محمد",
    phone: "رقم الجوال (اختياري)",
    phonePlaceholder: "966500000000+",
    email: "البريد الإلكتروني",
    emailPlaceholder: "example@mail.com",
    password: "كلمة المرور",
    passwordPlaceholder: "٨ أحرف على الأقل",
    confirmPassword: "تأكيد كلمة المرور",
    submit: "إنشاء الحساب",
    or: "أو",
    google: "التسجيل عبر Google",
    // validation
    nameRequired: "الاسم الكامل مطلوب",
    nameMin: "يجب أن يتضمن الاسم حرفين على الأقل",
    emailRequired: "البريد الإلكتروني مطلوب",
    emailInvalid: "صيغة البريد الإلكتروني غير صحيحة",
    phoneInvalid: "رقم الجوال غير صحيح",
    passwordRequired: "كلمة المرور مطلوبة",
    passwordMin: "يجب أن تتكون كلمة المرور من ٨ أحرف على الأقل",
    passwordWeak: "يجب أن تحتوي على حرف ورقم على الأقل",
    confirmRequired: "تأكيد كلمة المرور مطلوب",
    confirmMismatch: "كلمة المرور غير متطابقة",
    // api error codes
    EMAIL_TAKEN: "هذا البريد الإلكتروني مسجّل بالفعل",
    PHONE_TAKEN: "رقم الجوال مسجّل بالفعل",
    VALIDATION_ERROR: "يرجى مراجعة البيانات المدخلة",
  },
  ur: {
    title: "نیا اکاؤنٹ بنائیں",
    sub: "پہلے سے اکاؤنٹ ہے؟",
    subLink: "لاگ ان کریں",
    name: "پورا نام",
    namePlaceholder: "مثال: احمد محمد",
    phone: "موبائل نمبر (اختیاری)",
    phonePlaceholder: "92300000000+",
    email: "ای میل",
    emailPlaceholder: "example@mail.com",
    password: "پاسورڈ",
    passwordPlaceholder: "کم از کم ۸ حروف",
    confirmPassword: "پاسورڈ کی تصدیق",
    submit: "اکاؤنٹ بنائیں",
    or: "یا",
    google: "Google سے رجسٹر",
    nameRequired: "پورا نام ضروری ہے",
    nameMin: "نام میں کم از کم ۲ حروف ہونے چاہئیں",
    emailRequired: "ای میل ضروری ہے",
    emailInvalid: "ای میل کا فارمیٹ درست نہیں",
    phoneInvalid: "موبائل نمبر درست نہیں",
    passwordRequired: "پاسورڈ ضروری ہے",
    passwordMin: "پاسورڈ کم از کم ۸ حروف کا ہونا چاہیے",
    passwordWeak: "پاسورڈ میں کم از کم ایک حرف اور ایک نمبر ہونا چاہیے",
    confirmRequired: "پاسورڈ کی تصدیق ضروری ہے",
    confirmMismatch: "پاسورڈ مطابقت نہیں رکھتا",
    EMAIL_TAKEN: "یہ ای میل پہلے سے رجسٹرڈ ہے",
    PHONE_TAKEN: "یہ موبائل نمبر پہلے سے رجسٹرڈ ہے",
    VALIDATION_ERROR: "براہ کرم درج کردہ معلومات کو چیک کریں",
  },
};

// ── validation helpers ────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-()]{7,15}$/;
const HAS_LETTER = /[a-zA-Z؀-ۿ]/;
const HAS_DIGIT  = /\d/;

type Fields = { fullName: string; email: string; phone: string; password: string; confirm: string };
type FieldErrors = Partial<Record<keyof Fields, string>>;

function validate(f: Fields, ui: typeof UI["ar"]): FieldErrors {
  const errs: FieldErrors = {};
  if (!f.fullName.trim())           errs.fullName = ui.nameRequired;
  else if (f.fullName.trim().length < 2) errs.fullName = ui.nameMin;

  if (!f.email.trim())              errs.email = ui.emailRequired;
  else if (!EMAIL_RE.test(f.email)) errs.email = ui.emailInvalid;

  if (f.phone.trim() && !PHONE_RE.test(f.phone)) errs.phone = ui.phoneInvalid;

  if (!f.password)                  errs.password = ui.passwordRequired;
  else if (f.password.length < 8)   errs.password = ui.passwordMin;
  else if (!HAS_LETTER.test(f.password) || !HAS_DIGIT.test(f.password))
                                    errs.password = ui.passwordWeak;

  if (!f.confirm)                   errs.confirm = ui.confirmRequired;
  else if (f.confirm !== f.password) errs.confirm = ui.confirmMismatch;

  return errs;
}

function passwordStrength(p: string): 0 | 1 | 2 | 3 {
  if (!p) return 0;
  let score = 0;
  if (p.length >= 8) score++;
  if (HAS_LETTER.test(p) && HAS_DIGIT.test(p)) score++;
  if (p.length >= 12 && /[^a-zA-Z0-9؀-ۿ]/.test(p)) score++;
  return score as 0 | 1 | 2 | 3;
}

function openGoogleAuth() {
  const w = 500, h = 620;
  const left = window.screenX + (window.outerWidth - w) / 2;
  const top  = window.screenY + (window.outerHeight - h) / 2;
  window.open("/api/auth/google", "google-auth", `width=${w},height=${h},left=${left},top=${top},scrollbars=yes,resizable=yes`);
}

// ── component ─────────────────────────────────────────────────────
export default function SignUpForm() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const [fields, setFields] = useState<Fields>({ fullName: "", email: "", phone: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFields((f) => ({ ...f, [key]: val }));
    // clear error on change if already submitted
    if (submitted) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const strength = passwordStrength(fields.password);
  const strengthColors = ["bg-gray-200", "bg-red-400", "bg-yellow-400", "bg-emerald-500"] as const;
  const strengthLabels = {
    ar: ["", "ضعيف", "متوسط", "قوي"],
    ur: ["", "کمزور", "درمیانہ", "مضبوط"],
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setGlobalError(null);

    const errs = validate(fields, ui);
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    register(
      {
        fullName: fields.fullName.trim(),
        email: fields.email.trim().toLowerCase(),
        phone: fields.phone.trim() || undefined,
        password: fields.password,
        preferredLocale: locale,
      },
      {
        onSuccess: () => router.push("/dashboard"),
        onError: (err) => {
          const apiErr = err as unknown as ApiError;
          // field-level errors from server
          if (apiErr.fields) {
            setFieldErrors((prev) => ({ ...prev, ...apiErr.fields as FieldErrors }));
          }
          // known codes
          const codeMsg = (ui as Record<string, string>)[apiErr.code];
          setGlobalError(codeMsg ?? apiErr.message ?? "حدث خطأ، يرجى المحاولة لاحقاً");
        },
      },
    );
  }

  // ── render helpers ─────────────────────────────────────────────
  // ltrIcon: icon on start side (for email/phone which contain LTR chars)
  const inputCls = (key: keyof Fields, ltrIcon = false) =>
    `w-full h-11 rounded-md border ${ltrIcon ? "ps-10 pe-4" : "ps-4 pe-10"} text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none transition-colors bg-white disabled:opacity-60 ${
      fieldErrors[key] ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-[var(--brand)]"
    }`;

  const confirmCls = `w-full h-11 rounded-md border ps-4 pe-10 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none transition-colors bg-white disabled:opacity-60 ${
    fieldErrors.confirm
      ? "border-red-400 focus:border-red-400"
      : fields.confirm && fields.confirm === fields.password
        ? "border-emerald-400 focus:border-emerald-500"
        : "border-gray-200 focus:border-[var(--brand)]"
  }`;

  return (
    <AuthCard>
      <h1 className="text-2xl font-extrabold text-[var(--ink)] text-center">{ui.title}</h1>
      <p className="text-sm text-gray-400 mt-2 mb-6 text-center">
        {ui.sub}{" "}
        <Link href="/signin" className="text-[var(--brand)] font-semibold hover:underline">{ui.subLink}</Link>
      </p>

      {/* Global API error */}
      {globalError && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {globalError}
        </div>
      )}

      <form className="flex flex-col gap-y-3" onSubmit={handleSubmit} noValidate>

        {/* Full name */}
        <div>
          <div className="relative">
            <span className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <RiUserLine size={17} />
            </span>
            <input
              type="text"
              placeholder={ui.namePlaceholder}
              value={fields.fullName}
              onChange={set("fullName")}
              disabled={isPending}
              autoComplete="name"
              className={inputCls("fullName")}
            />
          </div>
          {fieldErrors.fullName && <p className="text-xs text-red-500 mt-1 px-1">{fieldErrors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <span className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <RiMailLine size={17} />
            </span>
            <input
              type="email"
              placeholder={ui.emailPlaceholder}
              value={fields.email}
              onChange={set("email")}
              disabled={isPending}
              autoComplete="email"
              className={inputCls("email")}
            />
          </div>
          {fieldErrors.email && <p className="text-xs text-red-500 mt-1 px-1">{fieldErrors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <div className="relative">
            <span className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <RiPhoneLine size={17} />
            </span>
            <input
              type="tel"
              placeholder={ui.phonePlaceholder}
              value={fields.phone}
              onChange={set("phone")}
              disabled={isPending}
              autoComplete="tel"
              dir="rtl"
              className={inputCls("phone")}
            />
          </div>
          {fieldErrors.phone && <p className="text-xs text-red-500 mt-1 px-1">{fieldErrors.phone}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder={ui.passwordPlaceholder}
              value={fields.password}
              onChange={set("password")}
              disabled={isPending}
              autoComplete="new-password"
              className={inputCls("password")}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
            </button>
          </div>
          {/* Strength bar */}
          {fields.password && (
            <div className="mt-1.5 px-0.5 flex items-center gap-x-2">
              <div className="flex gap-x-1 flex-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${strength >= i ? strengthColors[strength] : "bg-gray-200"}`} />
                ))}
              </div>
              <span className={`text-[10px] font-semibold ${["", "text-red-400", "text-yellow-500", "text-emerald-500"][strength]}`}>
                {strengthLabels[locale][strength]}
              </span>
            </div>
          )}
          {fieldErrors.password && <p className="text-xs text-red-500 mt-1 px-1">{fieldErrors.password}</p>}
        </div>

        {/* Confirm password */}
        <div>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder={ui.confirmPassword}
              value={fields.confirm}
              onChange={set("confirm")}
              disabled={isPending}
              autoComplete="new-password"
              className={confirmCls}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
            </button>
          </div>
          {fieldErrors.confirm && <p className="text-xs text-red-500 mt-1 px-1">{fieldErrors.confirm}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 rounded-md bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity mt-1 disabled:opacity-60 flex items-center justify-center gap-x-2"
        >
          {isPending ? <RiLoader4Line size={18} className="animate-spin" /> : ui.submit}
        </button>
      </form>

    </AuthCard>
  );
}
