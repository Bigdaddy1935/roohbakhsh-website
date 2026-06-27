"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { RiUserLine, RiLoader4Line } from "react-icons/ri";
import { useMe } from "@/hooks/queries/use-auth";

const UI = {
  ar: {
    title: "تفاصيل الحساب",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "رقم الجوال",
    joined: "تاريخ الانضمام",
    changePass: "تغيير كلمة المرور",
    currentPass: "كلمة المرور الحالية",
    newPass: "كلمة المرور الجديدة",
    confirmPass: "تأكيد كلمة المرور الجديدة",
    save: "حفظ التغييرات",
    savePass: "تحديث كلمة المرور",
    profileInfo: "المعلومات الشخصية",
    notAvailable: "تعديل المعلومات الشخصية وكلمة المرور غير متوفر حالياً.",
  },
  ur: {
    title: "اکاؤنٹ کی تفصیلات",
    name: "پورا نام",
    email: "ای میل",
    phone: "موبائل نمبر",
    joined: "شمولیت کی تاریخ",
    changePass: "پاسورڈ تبدیل کریں",
    currentPass: "موجودہ پاسورڈ",
    newPass: "نیا پاسورڈ",
    confirmPass: "نئے پاسورڈ کی تصدیق",
    save: "تبدیلیاں محفوظ کریں",
    savePass: "پاسورڈ اپ ڈیٹ کریں",
    profileInfo: "ذاتی معلومات",
    notAvailable: "ذاتی معلومات اور پاسورڈ میں ترمیم فی الحال دستیاب نہیں ہے۔",
  },
};

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

  const inputCls = "w-full h-10 rounded-md border border-gray-200 px-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] transition-colors bg-white";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <RiLoader4Line size={32} className="text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7 min-h-full">
      <h1 className="text-base font-bold text-[var(--ink)] mb-6">{ui.title}</h1>

      <div className="max-w-2xl flex flex-col gap-y-8">
        {/* Avatar */}
        <div className="flex items-center gap-x-5">
          <div className="relative shrink-0">
            <div className="size-[72px] rounded-full bg-[var(--brand)]/10 flex items-center justify-center border-2 border-[var(--brand)]/20">
              <RiUserLine size={32} className="text-[var(--brand)]" />
            </div>
          </div>
          <div>
            <p className="text-base font-bold text-[var(--ink)]">{user?.fullName ?? "—"}</p>
            <p className="text-sm text-gray-400 mt-0.5">{user?.email ?? "—"}</p>
            {user?.createdAt && (
              <p className="text-xs text-gray-300 mt-0.5">{ui.joined}: {user.createdAt.slice(0, 10)}</p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* Profile info */}
        <div>
          <h2 className="text-sm font-bold text-[var(--ink)] mb-4">{ui.profileInfo}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{ui.name}</label>
              <input type="text" value={name} disabled className={`${inputCls} disabled:bg-gray-50 disabled:text-gray-400`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{ui.email}</label>
              <input type="email" value={email} disabled className={`${inputCls} disabled:bg-gray-50 disabled:text-gray-400`} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{ui.phone}</label>
              <input type="tel" value={phone} disabled dir="ltr" className={`${inputCls} disabled:bg-gray-50 disabled:text-gray-400`} />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">{ui.notAvailable}</p>
        </div>
      </div>
    </div>
  );
}
