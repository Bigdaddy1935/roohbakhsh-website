import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Props = {
  children: React.ReactNode;
  locale: "ar" | "ur";
};

const FOOTER = {
  ar: { text: "بالتسجيل في الموقع، فأنت توافق على ", terms: "الشروط والأحكام", of: " لأكاديمية روح‌بخش." },
  ur: { text: "سائٹ پر رجسٹریشن کر کے آپ روح‌بخش اکیڈمی کی ", terms: "شرائط و احکام", of: " سے متفق ہیں۔" },
};

export default function AuthCard({ children, locale }: Props) {
  const f = FOOTER[locale];
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center px-4 py-10">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <Image src="https://roohbakhshac.ir/logo.png" alt="روح‌بخش" width={160} height={52} className="h-12 w-auto object-contain" priority />
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-1.5 bg-[var(--brand)]" />
        <div className="px-7 py-8">
          {children}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-gray-400 max-w-xs leading-6">
        {f.text}
        <Link href="/terms" className="text-[var(--brand)] hover:underline">{f.terms}</Link>
        {f.of}
      </p>
    </div>
  );
}
