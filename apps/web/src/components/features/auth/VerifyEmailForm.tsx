"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { RiCheckboxCircleLine, RiErrorWarningLine, RiLoader4Line } from "react-icons/ri";
import AuthCard from "./AuthCard";
import { useVerifyEmail, useResendVerification } from "@/hooks/queries/use-auth";
import type { ApiError } from "@roohbakhsh/shared";

const UI = {
  ar: {
    verifying: "جارٍ التحقق من بريدك الإلكتروني...",
    successTitle: "تم تأكيد البريد الإلكتروني!",
    successSub: "يمكنك الآن استخدام حسابك بشكل كامل.",
    goLogin: "الذهاب إلى تسجيل الدخول",
    invalidToken: "رابط التأكيد غير صالح أو منتهي الصلاحية.",
    noToken: "لم يتم العثور على رابط تأكيد. تحقق من بريدك الإلكتروني.",
    resendTitle: "إعادة إرسال رابط التأكيد",
    emailPlaceholder: "بريدك الإلكتروني",
    resendBtn: "إرسال الرابط",
    resendSent: "إذا كان البريد الإلكتروني مسجلاً وغير مؤكد، فقد تم إرسال رابط جديد.",
    networkError: "تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى",
  },
  ur: {
    verifying: "آپ کا ای میل تصدیق ہو رہا ہے...",
    successTitle: "ای میل کامیابی سے تصدیق ہو گیا!",
    successSub: "اب آپ اپنا اکاؤنٹ مکمل طور پر استعمال کر سکتے ہیں۔",
    goLogin: "لاگ ان صفحے پر جائیں",
    invalidToken: "تصدیقی لنک غلط یا میعاد ختم ہو گیا ہے۔",
    noToken: "کوئی تصدیقی لنک نہیں ملا۔ اپنا ای میل چیک کریں۔",
    resendTitle: "تصدیقی لنک دوبارہ بھیجیں",
    emailPlaceholder: "آپ کا ای میل",
    resendBtn: "لنک بھیجیں",
    resendSent: "اگر یہ ای میل رجسٹرڈ اور غیر تصدیق شدہ ہے تو نیا لنک بھیج دیا گیا ہے۔",
    networkError: "سرور سے رابطہ نہیں ہو سکا۔ اپنا انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں",
  },
};

function ResendVerificationBlock({ ui }: { ui: (typeof UI)["ar"] }) {
  const [email, setEmail] = useState("");
  const { mutate: resend, isPending, isSuccess } = useResendVerification();

  if (isSuccess) {
    return <p className="text-sm text-[var(--brand)] text-center">{ui.resendSent}</p>;
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (email.trim()) resend({ email: email.trim() }); }}
      className="flex flex-col gap-y-3 mt-4"
    >
      <p className="text-sm font-semibold text-[var(--ink)] text-center">{ui.resendTitle}</p>
      <input
        type="email"
        required
        placeholder={ui.emailPlaceholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isPending}
        dir="ltr"
        className="w-full h-11 rounded-lg border border-gray-200 px-4 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none focus:border-[var(--brand)] transition-colors bg-white disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-full h-11 rounded-lg bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {isPending ? "..." : ui.resendBtn}
      </button>
    </form>
  );
}

export default function VerifyEmailForm() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutate: verifyEmail, isPending, isSuccess, error } = useVerifyEmail();
  const attempted = useRef(false);

  useEffect(() => {
    if (token && !attempted.current) {
      attempted.current = true;
      verifyEmail({ token });
    }
  }, [token, verifyEmail]);

  const apiError = error as ApiError | null;
  const errorMessage = !token
    ? ui.noToken
    : apiError?.code === "INVALID_VERIFICATION_TOKEN"
      ? ui.invalidToken
      : apiError?.code === "NETWORK_ERROR"
        ? ui.networkError
        : apiError?.message ?? null;

  if (token && isPending) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center text-center gap-y-4 py-4">
          <RiLoader4Line size={36} className="animate-spin text-[var(--brand)]" />
          <p className="text-sm text-gray-500">{ui.verifying}</p>
        </div>
      </AuthCard>
    );
  }

  if (isSuccess) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center text-center gap-y-4 py-4">
          <div className="size-16 rounded-full bg-[var(--brand)]/10 flex items-center justify-center">
            <RiCheckboxCircleLine size={36} className="text-[var(--brand)]" />
          </div>
          <h1 className="text-xl font-extrabold text-[var(--ink)]">{ui.successTitle}</h1>
          <p className="text-sm text-gray-400">{ui.successSub}</p>
          <Link
            href="/signin"
            className="w-full h-11 rounded-lg bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity mt-2 flex items-center justify-center"
          >
            {ui.goLogin}
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="flex flex-col items-center text-center gap-y-4 py-4">
        <div className="size-16 rounded-full bg-red-50 flex items-center justify-center">
          <RiErrorWarningLine size={36} className="text-red-500" />
        </div>
        <p className="text-sm text-gray-500">{errorMessage}</p>
        <ResendVerificationBlock ui={ui} />
      </div>
    </AuthCard>
  );
}
