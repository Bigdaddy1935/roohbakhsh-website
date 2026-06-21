"use client";

import { useState, useRef } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiMailLine, RiArrowLeftSLine } from "react-icons/ri";
import AuthCard from "./AuthCard";

const UI = {
  ar: {
    title: "استعادة كلمة المرور",
    sub: "أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق",
    email: "البريد الإلكتروني",
    submit: "إرسال رمز التحقق",
    otpTitle: "أدخل رمز التحقق",
    otpSub: "تم إرسال الرمز إلى بريدك الإلكتروني",
    otpResend: "لم تستلم الرمز؟",
    otpResendLink: "إعادة الإرسال",
    otpSubmit: "تأكيد ومتابعة",
    back: "رجوع",
  },
  ur: {
    title: "پاسورڈ بازیابی",
    sub: "اپنا ای میل درج کریں، ہم آپ کو تصدیقی کوڈ بھیجیں گے",
    email: "ای میل",
    submit: "کوڈ بھیجیں",
    otpTitle: "تصدیقی کوڈ درج کریں",
    otpSub: "کوڈ آپ کے ای میل پر بھیجا گیا ہے",
    otpResend: "کوڈ نہیں ملا؟",
    otpResendLink: "دوبارہ بھیجیں",
    otpSubmit: "تصدیق اور جاری رہیں",
    back: "واپس",
  },
};

const OTP_LENGTH = 5;

export default function ForgotPasswordForm() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(107);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    setSeconds(107);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(timerRef.current!); return 0; }
        return s - 1;
      });
    }, 1000);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("otp");
    startTimer();
    setTimeout(() => inputsRef.current[0]?.focus(), 50);
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputsRef.current[i - 1]?.focus();
  };

  const handleOtpChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < OTP_LENGTH - 1) inputsRef.current[i + 1]?.focus();
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <AuthCard>
      {step === "email" ? (
        <>
          <h1 className="text-2xl font-extrabold text-[var(--ink)] mb-1 text-center">{ui.title}</h1>
          <p className="text-sm text-gray-400 mt-2 mb-7 text-center">{ui.sub}</p>
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-y-4">
            <div className="relative">
              <RiMailLine size={17} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input type="email" placeholder={ui.email} value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full h-11 rounded-lg border border-gray-200 ps-4 pe-10 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none focus:border-[var(--brand)] transition-colors bg-white" />
            </div>
            <button type="submit"
              className="w-full h-11 rounded-lg bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity">
              {ui.submit}
            </button>
          </form>
          <div className="mt-4 flex justify-center">
            <Link href="/signin" className="flex items-center gap-x-1 text-sm text-gray-400 hover:text-[var(--ink)] transition-colors">
              <RiArrowLeftSLine size={16} />
              {ui.back}
            </Link>
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setStep("email")} className="flex items-center gap-x-1 text-sm text-gray-400 hover:text-[var(--ink)] mb-5 transition-colors">
            <RiArrowLeftSLine size={16} />
            {ui.back}
          </button>
          <h1 className="text-2xl font-extrabold text-[var(--ink)] mb-1 text-center">{ui.otpTitle}</h1>
          <p className="text-sm text-gray-400 mb-1 text-center">{ui.otpSub}</p>
          <p className="text-sm text-[var(--brand)] font-semibold mb-6 text-center">{fmt(seconds)}</p>

          <div dir="ltr" className="flex items-center justify-center gap-x-2.5 mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputsRef.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKey(i, e)}
                className="size-11 rounded-lg border border-gray-200 text-center text-lg font-bold text-[var(--ink)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15 transition-all bg-white"
              />
            ))}
          </div>

          <button type="button" onClick={() => {}}
            className="w-full h-11 rounded-lg bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity">
            {ui.otpSubmit}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            {ui.otpResend}{" "}
            <button type="button" onClick={() => { startTimer(); setOtp(Array(OTP_LENGTH).fill("")); }}
              className="text-[var(--brand)] font-semibold hover:underline disabled:opacity-40"
              disabled={seconds > 0}>
              {ui.otpResendLink}
            </button>
          </p>
        </>
      )}
    </AuthCard>
  );
}
