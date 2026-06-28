"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

type Props = {
  children: React.ReactNode;
};

const FOOTER = {
  ar: { text: "بالتسجيل في الموقع، فأنت توافق على ", terms: "الشروط والأحكام", of: " لأكاديمية روح‌بخش." },
  ur: { text: "سائٹ پر رجسٹریشن کر کے آپ روح‌بخش اکیڈمی کی ", terms: "شرائط و احکام", of: " سے متفق ہیں۔" },
};


export default function AuthCard({ children }: Props) {
  const locale = useLocale() as "ar" | "ur";
  const f = FOOTER[locale];

  return (
    <div className="relative min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -end-32 w-96 h-96 rounded-full bg-[var(--brand)] opacity-10" />
        <div className="absolute -bottom-24 -start-24 w-80 h-80 rounded-full bg-[var(--cta)] opacity-10" />
        <div className="absolute top-1/2 start-1/4 w-56 h-56 rounded-full bg-[var(--brand)] opacity-5" />
      </div>

      {/* Logo */}
      <Link href="/" className="relative z-10 mb-8 mt-4">
        <Image
          src="https://roohbakhshac.ir/logo.png"
          alt="روح‌بخش"
          width={240}
          height={80}
          className="h-20 w-auto object-contain"
          priority
        />
      </Link>

      {/* Card */}
      <div className="relative z-10 w-[320px]">
        <div className="absolute -top-4 right-1/2 left-1/2 translate-x-1/2 mx-auto bg-[var(--brand)] w-[348px] h-[100px] rounded-xl -z-10" />
        <div className="bg-white rounded-md px-8 pt-8 pb-7">
          {children}
        </div>
      </div>

      {/* Footer */}
      <p className="relative z-10 mt-6 text-center text-xs text-gray-400 max-w-xs leading-6">
        {f.text}
        <Link href="/terms" className="text-[var(--brand)] hover:underline">
          {f.terms}
        </Link>
        {f.of}
      </p>
    </div>
  );
}
