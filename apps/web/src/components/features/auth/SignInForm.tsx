"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { RiMailLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import AuthCard from "./AuthCard";
import { useLogin } from "@/hooks/queries/use-auth";
import type { ApiError } from "@roohbakhsh/shared";

const UI = {
  ar: {
    title: "تسجيل الدخول",
    sub: "ليس لديك حساب؟",
    subLink: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    forgot: "نسيت كلمة المرور؟",
    submit: "دخول",
    or: "أو",
    google: "الدخول عبر Google",
    emailRequired: "البريد الإلكتروني مطلوب",
    emailInvalid: "صيغة البريد الإلكتروني غير صحيحة",
    passwordRequired: "كلمة المرور مطلوبة",
    networkError: "تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى",
  },
  ur: {
    title: "لاگ ان کریں",
    sub: "اکاؤنٹ نہیں ہے؟",
    subLink: "رجسٹر کریں",
    email: "ای میل",
    password: "پاسورڈ",
    forgot: "پاسورڈ بھول گئے؟",
    submit: "لاگ ان",
    or: "یا",
    google: "Google سے لاگ ان",
    emailRequired: "ای میل ضروری ہے",
    emailInvalid: "ای میل کا فارمیٹ درست نہیں ہے",
    passwordRequired: "پاسورڈ ضروری ہے",
    networkError: "سرور سے رابطہ نہیں ہو سکا۔ اپنا انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں",
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function openGoogleAuth() {
  const w = 500, h = 620;
  const left = window.screenX + (window.outerWidth - w) / 2;
  const top = window.screenY + (window.outerHeight - h) / 2;
  window.open("/api/auth/google", "google-auth", `width=${w},height=${h},left=${left},top=${top},scrollbars=yes,resizable=yes`);
}

export default function SignInForm() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const router = useRouter();
  const { mutate: login, isPending, error } = useLogin();

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const apiError = error as ApiError | null;

  const formMessage =
    apiError?.code === "NETWORK_ERROR"
      ? ui.networkError
      : apiError?.code === "VALIDATION_ERROR"
        ? null // field-level errors are shown next to inputs instead
        : apiError?.message ?? null;

  function validate(): boolean {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = ui.emailRequired;
    else if (!EMAIL_RE.test(email.trim())) next.email = ui.emailInvalid;
    if (!password) next.password = ui.passwordRequired;
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    login(
      { email: email.trim(), password },
      {
        onSuccess: () => router.push("/dashboard"),
        onError: (err) => {
          const apiErr = err as unknown as ApiError;
          if (apiErr?.fields) {
            setFieldErrors({ email: apiErr.fields.email, password: apiErr.fields.password });
          }
        },
      },
    );
  }

  return (
    <AuthCard>
      <h1 className="text-2xl font-extrabold text-[var(--ink)] text-center">{ui.title}</h1>
      <p className="text-sm text-gray-400 mt-2 mb-7 text-center">
        {ui.sub}{" "}
        <Link href="/signup" className="text-[var(--brand)] font-semibold hover:underline">{ui.subLink}</Link>
      </p>

      {formMessage && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {formMessage}
        </div>
      )}

      <form className="flex flex-col gap-y-3" onSubmit={handleSubmit} noValidate>
        <div>
          <div className="relative">
            <RiMailLine size={17} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="email"
              placeholder={ui.email}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
              }}
              disabled={isPending}
              aria-invalid={!!fieldErrors.email}
              className={`w-full h-11 rounded-md border ps-4 pe-10 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none transition-colors bg-white disabled:opacity-60 ${
                fieldErrors.email ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-[var(--brand)]"
              }`}
            />
          </div>
          {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
        </div>

        <div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder={ui.password}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((f) => ({ ...f, password: undefined }));
              }}
              disabled={isPending}
              aria-invalid={!!fieldErrors.password}
              className={`w-full h-11 rounded-md border ps-4 pe-10 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none transition-colors bg-white disabled:opacity-60 ${
                fieldErrors.password ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-[var(--brand)]"
              }`}
            />
            <button type="button" onClick={() => setShowPass((s) => !s)}
              className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPass ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
            </button>
          </div>
          {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
        </div>

        <div className="flex justify-start">
          <Link href="/forgoat-password" className="text-xs text-[var(--brand)] hover:underline">{ui.forgot}</Link>
        </div>

        <button type="submit" disabled={isPending}
          className="w-full h-11 rounded-md bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity mt-1 disabled:opacity-60">
          {isPending ? "..." : ui.submit}
        </button>
      </form>

    </AuthCard>
  );
}
