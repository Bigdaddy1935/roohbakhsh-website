"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { RiCameraLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { MOCK_USER_PROFILE } from "@/data/dashboard.mock";

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
  },
};

export default function AccountDetails() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const user = MOCK_USER_PROFILE;

  const [name, setName] = useState(user.name[locale]);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputCls = "w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] transition-colors bg-white";

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-y-5">
      <h1 className="text-lg font-extrabold text-[var(--ink)]">{ui.title}</h1>

      {/* Avatar */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-x-5">
        <div className="relative shrink-0">
          <Image src={user.avatar} alt="avatar" width={72} height={72} className="size-18 rounded-full object-cover" />
          <button type="button"
            className="absolute bottom-0 end-0 size-7 rounded-full bg-[var(--brand)] text-white flex items-center justify-center shadow-md hover:opacity-90 transition-opacity">
            <RiCameraLine size={14} />
          </button>
        </div>
        <div>
          <p className="text-base font-bold text-[var(--ink)]">{user.name[locale]}</p>
          <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
          <p className="text-xs text-gray-300 mt-0.5">{ui.joined}: {user.joinDate[locale]}</p>
        </div>
      </div>

      {/* Profile info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-bold text-[var(--ink)] mb-4">{ui.profileInfo}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">{ui.name}</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">{ui.email}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">{ui.phone}</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className={inputCls} />
          </div>
        </div>
        <button type="button"
          className="mt-5 h-10 px-6 rounded-lg bg-[var(--brand)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          {ui.save}
        </button>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-sm font-bold text-[var(--ink)] mb-4">{ui.changePass}</h2>
        <div className="flex flex-col gap-y-3">
          {[
            { label: ui.currentPass, show: showCurrent, toggle: () => setShowCurrent((s) => !s) },
            { label: ui.newPass,     show: showNew,     toggle: () => setShowNew((s) => !s) },
            { label: ui.confirmPass, show: showConfirm, toggle: () => setShowConfirm((s) => !s) },
          ].map((f, i) => (
            <div key={i}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{f.label}</label>
              <div className="relative">
                <input type={f.show ? "text" : "password"}
                  className="w-full h-10 rounded-lg border border-gray-200 ps-4 pe-10 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] transition-colors bg-white" />
                <button type="button" onClick={f.toggle}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {f.show ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button"
          className="mt-5 h-10 px-6 rounded-lg bg-[var(--ink)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          {ui.savePass}
        </button>
      </div>
    </div>
  );
}
