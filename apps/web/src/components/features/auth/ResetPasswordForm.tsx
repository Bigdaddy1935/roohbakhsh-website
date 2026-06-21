"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { RiEyeLine, RiEyeOffLine, RiCheckboxCircleLine } from "react-icons/ri";
import AuthCard from "./AuthCard";

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
  },
};

export default function ResetPasswordForm() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) { setError(ui.mismatch); return; }
    setError("");
    setDone(true);
  };

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
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
            {/* New password — only eye on start (right in RTL) */}
            <div className="relative">
              <input type={showNew ? "text" : "password"} placeholder={ui.newPass} value={newPass}
                onChange={(e) => setNewPass(e.target.value)} required minLength={8}
                className="w-full h-11 rounded-lg border border-gray-200 ps-4 pe-10 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none focus:border-[var(--brand)] transition-colors bg-white" />
              <button type="button" onClick={() => setShowNew((s) => !s)}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
              </button>
            </div>

            {/* Confirm password */}
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} placeholder={ui.confirmPass} value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)} required
                className={`w-full h-11 rounded-lg border ps-4 pe-10 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none focus:border-[var(--brand)] transition-colors bg-white ${error ? "border-red-400" : "border-gray-200"}`} />
              <button type="button" onClick={() => setShowConfirm((s) => !s)}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <RiEyeOffLine size={17} /> : <RiEyeLine size={17} />}
              </button>
            </div>

            {error && <p className="text-xs text-red-500 px-1">{error}</p>}

            <button type="submit"
              className="w-full h-11 rounded-lg bg-[var(--ink)] text-white text-sm font-bold hover:opacity-90 transition-opacity mt-1">
              {ui.submit}
            </button>
          </form>
        </>
      )}
    </AuthCard>
  );
}
