"use client";

import { useState } from "react";
import Link from "next/link";
import { RiMailLine, RiArrowRightLine } from "react-icons/ri";
import { useForgotPassword } from "@/hooks/queries/use-auth";
import type { ApiError } from "@roohbakhsh/shared";

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    if (!email.trim()) { setEmailError("ایمیل الزامی است"); return; }
    if (!EMAIL_RE.test(email.trim())) { setEmailError("فرمت ایمیل صحیح نیست"); return; }
    setEmailError(null);

    forgotPassword.mutate(
      { email: email.trim() },
      {
        onSuccess: () => setSuccess(true),
        onError: (err) => {
          const apiErr = err as unknown as ApiError;
          if (apiErr.statusCode === 0) {
            setServerError("اتصال به سرور برقرار نشد.");
          } else {
            setServerError(apiErr.message ?? "خطایی رخ داد. دوباره تلاش کنید.");
          }
        },
      },
    );
  }

  const isPending = forgotPassword.isPending;

  return (
    <div className="relative min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -end-32 w-96 h-96 rounded-full bg-[var(--brand)] opacity-10" />
        <div className="absolute -bottom-24 -start-24 w-80 h-80 rounded-full bg-[var(--cta)] opacity-10" />
        <div className="absolute top-1/2 start-1/4 w-56 h-56 rounded-full bg-[var(--brand)] opacity-5" />
      </div>

      <div className="relative z-10 mb-8 mt-4">
        <img src="https://roohbakhshac.ir/logo.png" alt="روح‌بخش" className="h-20 w-auto object-contain" />
      </div>

      <div className="relative z-10 w-[320px]">
        <div className="absolute -top-4 right-1/2 left-1/2 translate-x-1/2 mx-auto bg-[var(--brand)] w-[348px] h-[100px] rounded-lg -z-10" />
        <div className="bg-white rounded-md px-8 pt-8 pb-7">
          <h1 className="text-2xl font-extrabold text-[var(--ink)] text-center">فراموشی رمز</h1>
          <p className="text-sm text-gray-400 mt-2 mb-7 text-center">ایمیل حساب خود را وارد کنید</p>

          {success ? (
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <RiMailLine size={24} className="text-[var(--brand)]" />
              </div>
              <p className="text-sm text-center text-gray-600 leading-6">
                لینک بازیابی رمز به ایمیل شما ارسال شد.
                <br />
                صندوق ورودی خود را بررسی کنید.
              </p>
              <Link href="/signin" className="text-sm text-[var(--brand)] hover:underline">
                بازگشت به ورود
              </Link>
            </div>
          ) : (
            <>
              {serverError && (
                <div className="mb-4 px-3 py-2.5 rounded-md bg-red-50 border border-red-200 text-sm text-red-600 text-center">
                  {serverError}
                </div>
              )}

              <form className="flex flex-col gap-y-3" onSubmit={handleSubmit} noValidate>
                <div>
                  <div className="relative">
                    <RiMailLine size={17} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="ایمیل"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                        if (serverError) setServerError(null);
                      }}
                      disabled={isPending}
                      aria-invalid={!!emailError}
                      className={`w-full h-11 rounded-md border ps-4 pe-10 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none transition-colors bg-white disabled:opacity-60 ${
                        emailError
                          ? "border-red-300 focus:border-red-400"
                          : "border-gray-200 focus:border-[var(--brand)]"
                      }`}
                    />
                  </div>
                  {emailError && <p className="mt-1 text-xs text-red-500">{emailError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-11 rounded-md bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity mt-1 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      در حال ارسال...
                    </>
                  ) : (
                    "ارسال لینک بازیابی"
                  )}
                </button>

                <Link href="/signin" className="flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-[var(--brand)] transition-colors mt-1">
                  <RiArrowRightLine size={14} />
                  بازگشت به ورود
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
