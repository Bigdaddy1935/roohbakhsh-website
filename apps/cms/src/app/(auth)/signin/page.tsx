"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RiMailLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useLogin } from "@/hooks/queries/use-auth";
import { tokenStore } from "@/lib/api-client";
import type { ApiError, AuthResponse } from "@roohbakhsh/shared";

export default function SignInPage() {
  const router = useRouter();
  const login = useLogin();

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(): boolean {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "ایمیل الزامی است";
    else if (!EMAIL_RE.test(email.trim())) next.email = "فرمت ایمیل صحیح نیست";
    if (!password) next.password = "رمز عبور الزامی است";
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    login.mutate(
      { email: email.trim(), password },
      {
        onSuccess: (data: AuthResponse) => {
          if (data.user.role !== "admin") {
            tokenStore.clear();
            setServerError("دسترسی به پنل مدیریت فقط برای ادمین‌ها مجاز است.");
            return;
          }
          router.replace("/dashboard");
        },
        onError: (err) => {
          const apiErr = err as unknown as ApiError;
          if (apiErr.statusCode === 401 || apiErr.code === "INVALID_CREDENTIALS") {
            setServerError("ایمیل یا رمز عبور اشتباه است");
          } else if (apiErr.statusCode === 0) {
            setServerError("اتصال به سرور برقرار نشد. لطفاً اینترنت خود را بررسی کنید.");
          } else {
            setServerError(apiErr.message ?? "خطایی رخ داد. لطفاً دوباره تلاش کنید.");
          }
        },
      },
    );
  }

  const isPending = login.isPending;

  return (
    <div className="relative min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -end-32 w-96 h-96 rounded-full bg-[var(--brand)] opacity-10" />
        <div className="absolute -bottom-24 -start-24 w-80 h-80 rounded-full bg-[var(--cta)] opacity-10" />
        <div className="absolute top-1/2 start-1/4 w-56 h-56 rounded-full bg-[var(--brand)] opacity-5" />
      </div>

      {/* Logo */}
      <div className="relative z-10 mb-8 mt-4">
        <img
          src="https://roohbakhshac.ir/logo.png"
          alt="روح‌بخش"
          className="h-20 w-auto object-contain"
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-[320px]">
        <div className="absolute -top-4 right-1/2 left-1/2 translate-x-1/2 mx-auto bg-[var(--brand)] w-[348px] h-[100px] rounded-lg -z-10" />
        <div className="bg-white rounded-md px-8 pt-8 pb-7">
          <h1 className="text-2xl font-extrabold text-[var(--ink)] text-center">ورود به پنل</h1>
          <p className="text-sm text-gray-400 mt-2 mb-7 text-center">آکادمی روح‌بخش</p>

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
                    if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
                    if (serverError) setServerError(null);
                  }}
                  disabled={isPending}
                  aria-invalid={!!fieldErrors.email}
                  className={`w-full h-11 rounded-md border ps-4 pe-10 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none transition-colors bg-white disabled:opacity-60 ${
                    fieldErrors.email
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-[var(--brand)]"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="رمز عبور"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((f) => ({ ...f, password: undefined }));
                    if (serverError) setServerError(null);
                  }}
                  disabled={isPending}
                  aria-invalid={!!fieldErrors.password}
                  className={`w-full h-11 rounded-md border ps-4 pe-10 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none transition-colors bg-white disabled:opacity-60 ${
                    fieldErrors.password
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-[var(--brand)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex justify-start">
              <Link href="/forgot-password" className="text-xs text-[var(--brand)] hover:underline">
                فراموشی رمز عبور؟
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-11 rounded-md bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity mt-1 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  در حال ورود...
                </>
              ) : (
                "ورود"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
