"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { RiCheckboxCircleLine, RiErrorWarningLine, RiLoader4Line, RiShieldCheckLine } from "react-icons/ri";
import AuthCard from "./AuthCard";
import { useVerifyEmail, useResendVerification } from "@/hooks/queries/use-auth";
import type { ApiError } from "@roohbakhsh/shared";

const UI = {
  ar: {
    title: "تأكيد البريد الإلكتروني",
    sub: "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني.",
    emailPlaceholder: "البريد الإلكتروني",
    codePlaceholder: "رمز التحقق",
    submit: "تأكيد الحساب",
    resendBtn: "إرسال الرمز مرة أخرى",
    resendSent: "تم إرسال رمز جديد إذا كان البريد مسجلاً وغير مؤكد.",
    successTitle: "تم تأكيد البريد الإلكتروني!",
    successSub: "جاري نقلك إلى حسابك...",
    invalidToken: "رمز التحقق غير صحيح أو منتهي الصلاحية.",
    emailRequired: "البريد الإلكتروني مطلوب",
    codeRequired: "رمز التحقق مطلوب",
    networkError: "تعذر الاتصال بالخادم. حاول مرة أخرى.",
  },
  ur: {
    title: "ای میل کی تصدیق",
    sub: "اپنے ای میل پر بھیجا گیا تصدیقی کوڈ درج کریں۔",
    emailPlaceholder: "ای میل",
    codePlaceholder: "تصدیقی کوڈ",
    submit: "اکاؤنٹ کی تصدیق کریں",
    resendBtn: "کوڈ دوبارہ بھیجیں",
    resendSent: "اگر ای میل رجسٹرڈ اور غیر تصدیق شدہ ہے تو نیا کوڈ بھیج دیا گیا ہے۔",
    successTitle: "ای میل تصدیق ہو گئی!",
    successSub: "آپ کو اکاؤنٹ میں لے جایا جا رہا ہے...",
    invalidToken: "تصدیقی کوڈ غلط یا ختم ہو چکا ہے۔",
    emailRequired: "ای میل ضروری ہے",
    codeRequired: "تصدیقی کوڈ ضروری ہے",
    networkError: "سرور سے رابطہ نہیں ہو سکا۔ دوبارہ کوشش کریں۔",
  },
};

export default function VerifyEmailForm() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(initialEmail ? 60 : 0);
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setTimeout(() => {
      setResendCooldown((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();
    if (!cleanEmail) return setErrorMessage(ui.emailRequired);
    if (!cleanCode) return setErrorMessage(ui.codeRequired);

    verifyEmail.mutate(
      { email: cleanEmail, code: cleanCode },
      {
        onSuccess: () => {
          setMessage(ui.successSub);
          router.push("/dashboard");
        },
        onError: (err) => {
          const apiErr = err as unknown as ApiError;
          setErrorMessage(
            apiErr.code === "INVALID_VERIFICATION_TOKEN"
              ? ui.invalidToken
              : apiErr.code === "NETWORK_ERROR"
                ? ui.networkError
                : apiErr.message ?? ui.invalidToken,
          );
        },
      },
    );
  }

  function handleResend() {
    const cleanEmail = email.trim().toLowerCase();
    if (resendCooldown > 0) return;
    if (!cleanEmail) return setErrorMessage(ui.emailRequired);
    setErrorMessage(null);
    resendVerification.mutate(
      { email: cleanEmail },
      {
        onSuccess: () => {
          setMessage(ui.resendSent);
          setResendCooldown(60);
        },
      },
    );
  }

  const isPending = verifyEmail.isPending || resendVerification.isPending;
  const canResend = !isPending && resendCooldown === 0;

  return (
    <AuthCard>
      <div className="flex flex-col items-center text-center gap-y-3 mb-5">
        <div className="size-14 rounded-full bg-[var(--brand)]/10 flex items-center justify-center">
          <RiShieldCheckLine size={30} className="text-[var(--brand)]" />
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--ink)]">{ui.title}</h1>
        <p className="text-sm text-gray-400">{ui.sub}</p>
      </div>

      {message && (
        <div className="mb-4 rounded-md bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 flex items-center gap-x-2">
          <RiCheckboxCircleLine size={18} />
          <span>{message}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center gap-x-2">
          <RiErrorWarningLine size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleVerify} className="flex flex-col gap-y-3" noValidate>
        <input
          type="email"
          placeholder={ui.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          dir="ltr"
          className="w-full h-11 rounded-md border border-gray-200 px-4 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none focus:border-[var(--brand)] transition-colors bg-white disabled:opacity-60"
        />

        <input
          inputMode="numeric"
          maxLength={6}
          placeholder={ui.codePlaceholder}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          disabled={isPending}
          dir="ltr"
          className="w-full h-12 rounded-md border border-gray-200 px-4 text-center text-xl font-bold tracking-[0.35em] text-[var(--ink)] placeholder:text-sm placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400 outline-none focus:border-[var(--brand)] transition-colors bg-white disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 rounded-md bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-x-2"
        >
          {verifyEmail.isPending ? <RiLoader4Line size={18} className="animate-spin" /> : ui.submit}
        </button>
      </form>

      <button
        type="button"
        onClick={handleResend}
        disabled={!canResend}
        className="mx-auto mt-4 flex min-h-8 items-center justify-center gap-x-2 rounded-md px-3 text-xs font-semibold text-[var(--brand)] transition-colors hover:bg-[var(--brand)]/5 disabled:text-gray-400 disabled:hover:bg-transparent"
      >
        {resendVerification.isPending ? (
          <RiLoader4Line size={16} className="animate-spin" />
        ) : resendCooldown > 0 ? (
          `${ui.resendBtn} (${resendCooldown})`
        ) : (
          ui.resendBtn
        )}
      </button>
    </AuthCard>
  );
}
