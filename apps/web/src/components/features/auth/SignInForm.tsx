"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import AuthCard from "./AuthCard";

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
  },
};

export default function SignInForm() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthCard locale={locale}>
      <h1 className="text-xl font-extrabold text-[var(--ink)] mb-1">{ui.title}</h1>
      <p className="text-sm text-gray-400 mb-6">
        {ui.sub}{" "}
        <Link href="/auth/signup" className="text-[var(--brand)] font-semibold hover:underline">{ui.subLink}</Link>
      </p>

      <form className="flex flex-col gap-y-3" onSubmit={(e) => e.preventDefault()}>
        {/* Email */}
        <div className="relative">
          <RiMailLine size={17} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="email"
            placeholder={ui.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-11 rounded-xl border border-gray-200 ps-10 pe-4 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none focus:border-[var(--brand)] transition-colors bg-white"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <RiLockLine size={17} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type={showPass ? "text" : "password"}
            placeholder={ui.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full h-11 rounded-xl border border-gray-200 ps-10 pe-10 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none focus:border-[var(--brand)] transition-colors bg-white"
          />
          <button type="button" onClick={() => setShowPass((s) => !s)}
            className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPass ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
          </button>
        </div>

        <div className="flex justify-end">
          <Link href="/auth/forgot-password" className="text-xs text-[var(--brand)] hover:underline">{ui.forgot}</Link>
        </div>

        <button type="submit"
          className="w-full h-11 rounded-xl bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity mt-1">
          {ui.submit}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-x-3 my-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">{ui.or}</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Google */}
      <button type="button"
        className="w-full h-11 rounded-xl border border-gray-200 flex items-center justify-center gap-x-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-gray-50 transition-colors">
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z" /><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7l-6.5 5C9.6 39.6 16.3 44 24 44z" /><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C40.9 35.3 44 30 44 24c0-1.3-.1-2.7-.4-4z" /></svg>
        {ui.google}
      </button>
    </AuthCard>
  );
}
