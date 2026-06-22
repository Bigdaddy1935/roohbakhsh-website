"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiMailLine, RiArrowRightSLine, RiCheckboxCircleLine } from "react-icons/ri";
import AuthCard from "./AuthCard";
import { useForgotPassword } from "@/hooks/queries/use-auth";
import type { ApiError } from "@roohbakhsh/shared";

const UI = {
  ar: {
    title: "استعادة كلمة المرور",
    sub: "أدخل بريدك الإلكتروني وسنرسل لك رابط استعادة كلمة المرور",
    email: "البريد الإلكتروني",
    submit: "إرسال رابط الاستعادة",
    back: "رجوع",
    emailRequired: "البريد الإلكتروني مطلوب",
    emailInvalid: "صيغة البريد الإلكتروني غير صحيحة",
    networkError: "تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى",
    successTitle: "تحقق من بريدك الإلكتروني",
    successSub: "إذا كان هذا البريد مسجلاً لدينا، فستصلك رسالة تحتوي على رابط لإعادة تعيين كلمة المرور.",
  },
  ur: {
    title: "پاسورڈ بازیابی",
    sub: "اپنا ای میل درج کریں، ہم آپ کو پاسورڈ ری سیٹ لنک بھیجیں گے",
    email: "ای میل",
    submit: "ری سیٹ لنک بھیجیں",
    back: "واپس",
    emailRequired: "ای میل ضروری ہے",
    emailInvalid: "ای میل کا فارمیٹ درست نہیں ہے",
    networkError: "سرور سے رابطہ نہیں ہو سکا۔ اپنا انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں",
    successTitle: "اپنا ای میل چیک کریں",
    successSub: "اگر یہ ای میل ہمارے ہاں رجسٹرڈ ہے تو آپ کو پاسورڈ ری سیٹ لنک موصول ہوگا۔",
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordForm() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const { mutate: forgotPassword, isPending, error } = useForgotPassword();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [done, setDone] = useState(false);

  const apiError = error as ApiError | null;
  const formMessage = apiError?.code === "NETWORK_ERROR" ? ui.networkError : apiError?.message ?? null;

  function validate(): boolean {
    let next: string | undefined;
    if (!email.trim()) next = ui.emailRequired;
    else if (!EMAIL_RE.test(email.trim())) next = ui.emailInvalid;
    setEmailError(next);
    return !next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    forgotPassword({ email: email.trim() }, { onSuccess: () => setDone(true) });
  }

  return (
    <AuthCard>
      {done ? (
        <div className="flex flex-col items-center text-center gap-y-4 py-4">
          <div className="size-16 rounded-full bg-[var(--brand)]/10 flex items-center justify-center">
            <RiCheckboxCircleLine size={36} className="text-[var(--brand)]" />
          </div>
          <h1 className="text-xl font-extrabold text-[var(--ink)]">{ui.successTitle}</h1>
          <p className="text-sm text-gray-400">{ui.successSub}</p>
          <Link href="/signin" className="flex items-center gap-x-1 text-sm text-[var(--brand)] font-semibold hover:underline mt-2">
            <RiArrowRightSLine size={16} />
            {ui.back}
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-extrabold text-[var(--ink)] mb-1 text-center">{ui.title}</h1>
          <p className="text-sm text-gray-400 mt-2 mb-7 text-center">{ui.sub}</p>

          {formMessage && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {formMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-y-4" noValidate>
            <div>
              <div className="relative">
                <RiMailLine size={17} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder={ui.email}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(undefined);
                  }}
                  disabled={isPending}
                  aria-invalid={!!emailError}
                  className={`w-full h-11 rounded-lg border ps-4 pe-10 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none transition-colors bg-white disabled:opacity-60 ${
                    emailError ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-[var(--brand)]"
                  }`}
                />
              </div>
              {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
            </div>
            <button type="submit" disabled={isPending}
              className="w-full h-11 rounded-lg bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60">
              {isPending ? "..." : ui.submit}
            </button>
          </form>
          <div className="mt-4 flex justify-center">
            <Link href="/signin" className="flex items-center gap-x-1 text-sm text-gray-400 hover:text-[var(--ink)] transition-colors">
              <RiArrowRightSLine size={16} />
              {ui.back}
            </Link>
          </div>
        </>
      )}
    </AuthCard>
  );
}
