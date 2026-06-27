"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/navigation";
import { RiEyeLine, RiEyeOffLine, RiCheckboxCircleLine, RiArrowRightSLine } from "react-icons/ri";
import AuthCard from "./AuthCard";
import { useResetPassword } from "@/hooks/queries/use-auth";
import type { ApiError } from "@roohbakhsh/shared";

const UI = {
  ar: {
    title: "تعيين كلمة مرور جديدة",
    sub: "أدخل كلمة المرور الجديدة وتأكيدها",
    newPass: "كلمة المرور الجديدة",
    confirmPass: "تأكيد كلمة المرور",
    submit: "حفظ كلمة المرور",
    successTitle: "تم تغيير كلمة المرور!",
    successSub: "يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.",
    goLogin: "الذهاب إلى تسجيل الدخول",
    mismatch: "كلمتا المرور غير متطابقتين",
    required: "كلمة المرور مطلوبة",
    tooShort: "كلمة المرور يجب أن تكون ٨ أحرف على الأقل",
    networkError: "تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى",
    invalidToken: "رابط استعادة كلمة المرور غير صالح أو منتهي الصلاحية",
    requestNew: "طلب رابط جديد",
  },
  ur: {
    title: "نیا پاسورڈ سیٹ کریں",
    sub: "نیا پاسورڈ درج کریں اور تصدیق کریں",
    newPass: "نیا پاسورڈ",
    confirmPass: "پاسورڈ کی تصدیق",
    submit: "پاسورڈ محفوظ کریں",
    successTitle: "پاسورڈ تبدیل ہو گیا!",
    successSub: "اب آپ نئے پاسورڈ سے لاگ ان کر سکتے ہیں۔",
    goLogin: "لاگ ان صفحے پر جائیں",
    mismatch: "پاسورڈ مماثل نہیں ہیں",
    required: "پاسورڈ ضروری ہے",
    tooShort: "پاسورڈ کم از کم ۸ حروف کا ہونا چاہیے",
    networkError: "سرور سے رابطہ نہیں ہو سکا۔ اپنا انٹرنیٹ کنکشن چیک کریں اور دوبارہ کوشش کریں",
    invalidToken: "پاسورڈ ری سیٹ لنک غلط یا میعاد ختم ہو گیا ہے",
    requestNew: "نیا لنک حاصل کریں",
  },
};

export default function ResetPasswordForm() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [done, setDone] = useState(false);

  const apiError = error as ApiError | null;
  const formMessage =
    apiError?.code === "INVALID_RESET_TOKEN"
      ? ui.invalidToken
      : apiError?.code === "NETWORK_ERROR"
        ? ui.networkError
        : apiError?.message ?? null;

  function validate(): boolean {
    if (!newPass) { setFieldError(ui.required); return false; }
    if (newPass.length < 8) { setFieldError(ui.tooShort); return false; }
    if (newPass !== confirmPass) { setFieldError(ui.mismatch); return false; }
    setFieldError("");
    return true;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !validate()) return;
    resetPassword({ token, newPassword: newPass }, { onSuccess: () => setDone(true) });
  };

  if (!token) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center text-center gap-y-4 py-4">
          <h1 className="text-xl font-extrabold text-[var(--ink)]">{ui.invalidToken}</h1>
          <Link href="/forgoat-password" className="flex items-center gap-x-1 text-sm text-[var(--brand)] font-semibold hover:underline mt-2">
            <RiArrowRightSLine size={16} />
            {ui.requestNew}
          </Link>
        </div>
      </AuthCard>
    );
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
          <button onClick={() => router.push("/signin")}
            className="w-full h-11 rounded-lg bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity mt-2">
            {ui.goLogin}
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-extrabold text-[var(--ink)] mb-1 text-center">{ui.title}</h1>
          <p className="text-sm text-gray-400 mt-2 mb-7 text-center">{ui.sub}</p>

          {formMessage && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {formMessage}
              {apiError?.code === "INVALID_RESET_TOKEN" && (
                <>
                  {" "}
                  <Link href="/forgoat-password" className="font-semibold underline">{ui.requestNew}</Link>
                </>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-y-3" noValidate>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder={ui.newPass}
                value={newPass}
                onChange={(e) => { setNewPass(e.target.value); if (fieldError) setFieldError(""); }}
                disabled={isPending}
                minLength={8}
                className={`w-full h-11 rounded-lg border ps-4 pe-10 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none focus:border-[var(--brand)] transition-colors bg-white disabled:opacity-60 ${
                  fieldError ? "border-red-300" : "border-gray-200"
                }`}
              />
              <button type="button" onClick={() => setShowNew((s) => !s)}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder={ui.confirmPass}
                value={confirmPass}
                onChange={(e) => { setConfirmPass(e.target.value); if (fieldError) setFieldError(""); }}
                disabled={isPending}
                className={`w-full h-11 rounded-lg border ps-4 pe-10 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none focus:border-[var(--brand)] transition-colors bg-white disabled:opacity-60 ${
                  fieldError ? "border-red-300" : "border-gray-200"
                }`}
              />
              <button type="button" onClick={() => setShowConfirm((s) => !s)}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
              </button>
            </div>

            {fieldError && <p className="text-xs text-red-500 px-1">{fieldError}</p>}

            <button type="submit" disabled={isPending}
              className="w-full h-11 rounded-lg bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity mt-1 disabled:opacity-60">
              {isPending ? "..." : ui.submit}
            </button>
          </form>
        </>
      )}
    </AuthCard>
  );
}
