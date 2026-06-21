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

      {/* Language switcher */}
      <div className="relative z-10 flex items-center gap-2 mb-6">
        {(["ar", "ur"] as const).map((l) => (
          <button
            key={l}
            onClick={() => switchLocale(l)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              locale === l
                ? "bg-[var(--brand)] text-white"
                : "bg-white text-gray-500 hover:bg-gray-100"
            }`}
          >
            {LANG[l]}
          </button>
        ))}
      </div>

      {/* Logo */}
      <Link href="/" className="relative z-10 mb-6">
        <Image
          src="https://roohbakhshac.ir/logo.png"
          alt="روح‌بخش"
          width={200}
          height={64}
          className="h-16 w-auto object-contain"
          priority
        />
      </Link>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-xl shadow-xl">
        <div className="px-7 py-8">
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
