"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import {
  RiUser3Line, RiCalendar2Line,
  RiPhoneLine, RiMailLine, RiShieldKeyholeLine, RiEyeLine, RiEyeOffLine,
} from "react-icons/ri";
import { AccountPageSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useMe, useChangePassword } from "@/hooks/queries/use-auth";

const UI = {
  ar: {
    title: "الحساب الشخصي",
    subtitle: "معلومات حسابك ووضعه الحالي",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الجوال",
    joined: "تاريخ الانضمام",
    profileInfo: "المعلومات الشخصية",
    security: "الأمان",
    memberSince: "عضو منذ",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور الجديدة",
    changePassword: "تغيير كلمة المرور",
    saving: "جارٍ الحفظ...",
    successMsg: "تم تغيير كلمة المرور بنجاح",
    errorWrong: "كلمة المرور الحالية غير صحيحة",
    errorMismatch: "كلمة المرور الجديدة غير متطابقة",
    errorShort: "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل",
  },
  ur: {
    title: "ذاتی اکاؤنٹ",
    subtitle: "آپ کے اکاؤنٹ کی معلومات اور حیثیت",
    name: "پورا نام",
    email: "ای میل",
    phone: "موبائل نمبر",
    joined: "شمولیت کی تاریخ",
    profileInfo: "ذاتی معلومات",
    security: "سیکیورٹی",
    memberSince: "رکن بمطابق",
    currentPassword: "موجودہ پاسورڈ",
    newPassword: "نیا پاسورڈ",
    confirmPassword: "نئے پاسورڈ کی تصدیق",
    changePassword: "پاسورڈ تبدیل کریں",
    saving: "محفوظ ہو رہا ہے...",
    successMsg: "پاسورڈ کامیابی سے تبدیل ہو گیا",
    errorWrong: "موجودہ پاسورڈ غلط ہے",
    errorMismatch: "نئے پاسورڈ مطابقت نہیں رکھتے",
    errorShort: "نیا پاسورڈ کم از کم 8 حروف کا ہونا چاہیے",
  },
};

function FieldRow({
  label,
  value,
  icon: Icon,
  dir,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
  dir?: string;
}) {
  return (
    <div className="flex flex-col gap-y-1.5">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</label>
      <div
        className={`flex items-center gap-x-3 h-11 px-4 rounded-md bg-gray-50 ${!value ? "opacity-40" : ""}`}
        dir={dir}
      >
        {Icon && <Icon size={16} className="text-gray-400 shrink-0" />}
        <span className="text-sm text-[var(--ink)] font-medium truncate">{value || "—"}</span>
      </div>
    </div>
  );
}

export default function AccountDetails() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const { data: user, isLoading } = useMe();
  const changePassword = useChangePassword();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.fullName ?? "");
      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess(false);
    if (newPwd.length < 8) { setPwdError(ui.errorShort); return; }
    if (newPwd !== confirmPwd) { setPwdError(ui.errorMismatch); return; }
    try {
      await changePassword.mutateAsync({ newPassword: newPwd });
      setPwdSuccess(true);
      setNewPwd(""); setConfirmPwd("");
    } catch {
      setPwdError(ui.errorWrong);
    }
  }

  if (isLoading) return <AccountPageSkeleton />;

  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-lg lg:p-7 min-h-full">
      {/* Profile hero */}
      <div className="flex items-center gap-x-4 sm:gap-x-5 p-5 sm:p-6 rounded-lg bg-gradient-to-l from-[var(--brand)]/5 to-[var(--brand)]/10 mb-7">
        <div className="size-16 sm:size-20 rounded-lg bg-[var(--brand)] flex items-center justify-center shrink-0 shadow-lg shadow-[var(--brand)]/30">
          <RiUser3Line size={32} className="text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-extrabold text-[var(--ink)] truncate">
            {user?.fullName ?? "—"}
          </h1>
          <p className="text-sm text-gray-500 truncate mt-0.5">{user?.email ?? "—"}</p>
          {user?.createdAt && (
            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-x-1.5">
              <RiCalendar2Line size={12} />
              {ui.memberSince} {user.createdAt.slice(0, 10)}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-7">
        {/* Profile info */}
        <section className="flex-1">
          <h2 className="text-sm font-bold text-[var(--ink)] mb-4 flex items-center gap-x-2">
            <RiUser3Line size={16} className="text-[var(--brand)]" />
            {ui.profileInfo}
          </h2>
          <div className="flex flex-col gap-3">
            <FieldRow label={ui.name} value={name} icon={RiUser3Line} />
            <FieldRow label={ui.email} value={email} icon={RiMailLine} />
            <FieldRow label={ui.phone} value={phone} icon={RiPhoneLine} dir="ltr" />
          </div>
        </section>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-gray-200 self-stretch" />

        {/* Change password */}
        <section className="flex-1">
          <h2 className="text-sm font-bold text-[var(--ink)] mb-4 flex items-center gap-x-2">
            <RiShieldKeyholeLine size={16} className="text-[var(--brand)]" />
            {ui.security}
          </h2>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-y-3">
            <div className="flex flex-col gap-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">{ui.newPassword}</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  required
                  className="w-full h-11 rounded-md border border-gray-200 px-4 pe-10 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                />
                <button type="button" onClick={() => setShowNew(v => !v)} className="absolute top-1/2 -translate-y-1/2 end-3 text-gray-400">
                  {showNew ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">{ui.confirmPassword}</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  required
                  className="w-full h-11 rounded-md border border-gray-200 px-4 pe-10 text-sm outline-none focus:border-[var(--brand)] transition-colors"
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute top-1/2 -translate-y-1/2 end-3 text-gray-400">
                  {showConfirm ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                </button>
              </div>
            </div>

            {pwdError && <p className="text-xs text-red-500">{pwdError}</p>}
            {pwdSuccess && <p className="text-xs text-emerald-600">{ui.successMsg}</p>}

            <button
              type="submit"
              disabled={changePassword.isPending}
              className="h-11 px-6 rounded-md bg-[var(--brand)] text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60 self-end"
            >
              {changePassword.isPending ? ui.saving : ui.changePassword}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
