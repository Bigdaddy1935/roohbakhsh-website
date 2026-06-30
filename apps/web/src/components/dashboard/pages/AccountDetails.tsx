"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import {
  RiUser3Line, RiCalendar2Line,
  RiPhoneLine, RiMailLine, RiShieldKeyholeLine,
} from "react-icons/ri";
import { AccountPageSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useMe } from "@/hooks/queries/use-auth";

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
    notAvailable: "تعديل المعلومات الشخصية وكلمة المرور غير متاح حالياً — سيتم إضافته قريباً.",
    memberSince: "عضو منذ",
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
    notAvailable: "ذاتی معلومات اور پاسورڈ میں ترمیم ابھی دستیاب نہیں — جلد شامل ہوگا۔",
    memberSince: "رکن بمطابق",
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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.fullName ?? "");
      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

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

      <div className="max-w-xl flex flex-col gap-y-7">
        {/* Profile info */}
        <section>
          <h2 className="text-sm font-bold text-[var(--ink)] mb-4 flex items-center gap-x-2">
            <RiUser3Line size={16} className="text-[var(--brand)]" />
            {ui.profileInfo}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FieldRow label={ui.name} value={name} icon={RiUser3Line} />
            <FieldRow label={ui.email} value={email} icon={RiMailLine} />
            <div className="sm:col-span-2">
              <FieldRow label={ui.phone} value={phone} icon={RiPhoneLine} dir="ltr" />
            </div>
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-sm font-bold text-[var(--ink)] mb-4 flex items-center gap-x-2">
            <RiShieldKeyholeLine size={16} className="text-[var(--brand)]" />
            {ui.security}
          </h2>
          <div className="flex items-start gap-x-3 p-4 rounded-md bg-amber-50 border border-amber-100">
            <RiShieldKeyholeLine size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">{ui.notAvailable}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
