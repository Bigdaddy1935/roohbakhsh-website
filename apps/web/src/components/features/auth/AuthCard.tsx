"use client";

import Image from "next/image";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

type Props = {
  children: React.ReactNode;
};

const FOOTER = {
  ar: { text: "بالتسجيل في الموقع، فأنت توافق على ", terms: "الشروط والأحكام", of: " لأكاديمية روح‌بخش." },
  ur: { text: "سائٹ پر رجسٹریشن کر کے آپ روح‌بخش اکیڈمی کی ", terms: "شرائط و احکام", of: " سے متفق ہیں۔" },
};

const LANG = { ar: "العربية", ur: "اردو" };

export default function AuthCard({ children }: Props) {
  const locale = useLocale() as "ar" | "ur";
  const router = useRouter();
  const pathname = usePathname();
  const f = FOOTER[locale];

  const switchLocale = (next: "ar" | "ur") => {
    if (next !== locale) router.replace(pathname, { locale: next });
  };

  return (
    <div className="relative min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -end-32 w-96 h-96 rounded-full bg-[var(--brand)] opacity-10" />
        <div className="absolute -bottom-24 -start-24 w-80 h-80 rounded-full bg-[var(--cta)] opacity-10" />
        <div className="absolute top-1/2 start-1/4 w-56 h-56 rounded-full bg-[var(--brand)] opacity-5" />
      </div>

      {/* Language switcher — fixed top bar */}
      <div className="fixed top-0 start-0 end-0 z-50 flex justify-center gap-2 bg-white/80 backdrop-blur-sm border-b border-gray-100 py-2.5 px-4">
        {(["ar", "ur"] as const).map((l) => (
          <button
            key={l}
            onClick={() => switchLocale(l)}
            className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              locale === l
                ? "bg-[var(--brand)] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {LANG[l]}
          </button>
        ))}
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
      <div className="relative z-10 w-full max-w-sm bg-white rounded-xl shadow-xl">
        <div className="px-8 pt-8 pb-7">
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
