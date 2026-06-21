"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import {
  RiMenu2Line,
  RiCloseLine,
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiBookOpenLine,
  RiScales2Line,
  RiMoonLine,
  RiTimeLine,
  RiPenNibLine,
  RiHeartLine,
  RiShoppingCartLine,
  RiUserLine,
  RiLoginBoxLine,
} from "react-icons/ri";

type CategoryId = "quran" | "fiqh" | "aqeedah" | "history" | "arabic" | "tazkiyah";

type CategoryDef = {
  id: CategoryId;
  href: string;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
};

const CATEGORIES: CategoryDef[] = [
  { id: "quran",    href: "/courses/quran",    Icon: RiBookOpenLine  },
  { id: "fiqh",     href: "/courses/fiqh",     Icon: RiScales2Line   },
  { id: "aqeedah",  href: "/courses/aqeedah",  Icon: RiMoonLine      },
  { id: "history",  href: "/courses/history",  Icon: RiTimeLine      },
  { id: "arabic",   href: "/courses/arabic",   Icon: RiPenNibLine    },
  { id: "tazkiyah", href: "/courses/tazkiyah", Icon: RiHeartLine     },
];

const MOCK_COURSES: Record<CategoryId, { ar: string[]; ur: string[] }> = {
  quran:    { ar: ["تجويد القرآن الكريم", "تفسير جزء عم", "علوم القرآن", "الإجازة بالقراءات"], ur: ["تجوید القرآن الکریم", "تفسیر جزء عم", "علوم القرآن", "اجازہ بالقراءات"] },
  fiqh:     { ar: ["أصول الفقه الإسلامي", "فقه العبادات", "الفقه المقارن", "أحكام المعاملات"], ur: ["اصول فقہ اسلامی", "فقہ عبادات", "فقہ مقارن", "احکام معاملات"] },
  aqeedah:  { ar: ["العقيدة الطحاوية", "شرح الأسماء الحسنى", "التوحيد وأقسامه", "علم الكلام"], ur: ["عقیدہ طحاویہ", "شرح اسماء الحسنیٰ", "توحید اور اس کی اقسام", "علم کلام"] },
  history:  { ar: ["السيرة النبوية الشريفة", "تاريخ الخلفاء الراشدين", "تاريخ الدولة الأموية", "فتوحات صدر الإسلام"], ur: ["سیرت النبی ﷺ", "تاریخ خلفاء راشدین", "تاریخ دولت اموی", "فتوحات صدر اسلام"] },
  arabic:   { ar: ["النحو الميسر للمبتدئين", "الصرف العملي", "البلاغة القرآنية", "تحليل النصوص العربية"], ur: ["عربی نحو برائے مبتدیین", "صرف عملی", "قرآنی بلاغت", "عربی متون کا تجزیہ"] },
  tazkiyah: { ar: ["تزكية النفس ومراقي السعادة", "رياض الصالحين", "الأذكار والأوراد", "علم الأخلاق الإسلامي"], ur: ["تزکیہ نفس", "ریاض الصالحین", "اذکار و اوراد", "اسلامی اخلاق"] },
};

export default function Header() {
  const t = useTranslations("Header");
  const locale = useLocale() as "ar" | "ur";
  const router = useRouter();
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("quran");

  /* Mock auth state — replace with real auth when backend is ready */
  const isLoggedIn = false;

  const switchLocale = (next: string) => router.replace(pathname, { locale: next });

  const catNames: Record<CategoryId, string> = {
    quran:    t("categories.quran"),
    fiqh:     t("categories.fiqh"),
    aqeedah:  t("categories.aqeedah"),
    history:  t("categories.history"),
    arabic:   t("categories.arabic"),
    tazkiyah: t("categories.tazkiyah"),
  };

  const mockCourses = MOCK_COURSES[activeCategory][locale];

  return (
    <>
      {/* ── HEADER ── */}
      <header className="bg-[#F7F7F7] border-b border-gray-200 h-[85px] md:h-[100px]">
        <div className="container h-full flex items-center gap-x-6">

          {/* Mobile */}
          <div className="flex md:hidden w-full items-center justify-between">
            <button type="button" onClick={() => setDrawerOpen(true)} className="text-[var(--ink)]" aria-label="open menu">
              <RiMenu2Line size={26} />
            </button>
            <Link href="/">
              <Image src="https://roohbakhshac.ir/logo.png" alt="روح‌بخش" width={150} height={48} className="object-contain h-12 w-auto" priority />
            </Link>
            <Link href="/cart" aria-label={t("cart")}>
              <RiShoppingCartLine size={24} className="text-[var(--ink)] hover:text-[var(--brand)] transition-colors" />
            </Link>
          </div>

          {/* Desktop logo */}
          <Link href="/" className="hidden md:block shrink-0">
            <Image src="https://roohbakhshac.ir/logo.png" alt="روح‌بخش" width={160} height={52} className="object-contain h-13 w-auto" priority />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-x-6 lg:gap-x-8 text-[14px] font-semibold text-[var(--ink)]">

            {/* Mega menu */}
            <div className="group relative">
              <Link href="/courses" className="flex items-center gap-x-1 whitespace-nowrap py-1 transition-colors hover:text-[var(--brand)] group-hover:text-[var(--brand)]">
                {t("courses")}
                <RiArrowDownSLine size={18} className="transition-transform duration-200 group-hover:rotate-180" />
              </Link>
              <div className="absolute top-full right-0 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 pt-4 z-50">
                <div className="flex bg-white border border-gray-200 rounded-xl shadow-xl shadow-black/[0.08] overflow-hidden">
                  <div className="flex flex-col gap-y-1 p-4 w-72 shrink-0">
                    {CATEGORIES.map(({ id, href, Icon }) => (
                      <Link key={id} href={href} onMouseEnter={() => setActiveCategory(id)}
                        className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${activeCategory === id ? "bg-gray-100" : "hover:bg-gray-50"}`}>
                        <span className="flex items-center gap-x-3">
                          <Icon size={22} className={`shrink-0 ${activeCategory === id ? "text-[var(--brand)]" : "text-gray-400"}`} />
                          <span className="text-sm font-medium">{catNames[id]}</span>
                        </span>
                        <RiArrowLeftSLine size={18} className="text-gray-300 shrink-0" />
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col justify-between bg-gray-50 w-64 p-5 border-s border-gray-100">
                    <div className="flex flex-col gap-y-3.5">
                      {mockCourses.map((course) => (
                        <Link key={course} href={`/courses/${activeCategory}`} className="text-sm text-[var(--ink)] hover:text-[var(--brand)] transition-colors">
                          {course}
                        </Link>
                      ))}
                    </div>
                    <Link href={`/courses/${activeCategory}`} className="flex items-center gap-x-1 text-[13px] font-semibold text-[var(--brand)] hover:underline mt-5">
                      {t("viewAll")}
                      <RiArrowLeftSLine size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/articles" className="whitespace-nowrap py-1 transition-colors hover:text-[var(--brand)]">{t("articles")}</Link>
            <Link href="/about" className="whitespace-nowrap py-1 transition-colors hover:text-[var(--brand)]">{t("about")}</Link>
          </nav>

          <div className="hidden md:block flex-1" />

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-x-3">

            {/* Language switcher — fixed width to prevent layout shift */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-[12px] font-semibold">
              <button
                type="button"
                onClick={() => switchLocale("ar")}
                className={`w-8 text-center py-1.5 transition-colors cursor-pointer ${locale === "ar" ? "bg-[var(--brand)] text-white" : "text-gray-500 hover:bg-gray-100"}`}
              >
                ع
              </button>
              <button
                type="button"
                onClick={() => switchLocale("ur")}
                className={`w-[52px] text-center py-1.5 transition-colors cursor-pointer ${locale === "ur" ? "bg-[var(--brand)] text-white" : "text-gray-500 hover:bg-gray-100"}`}
              >
                اردو
              </button>
            </div>

            {/* Cart */}
            <Link href="/cart" aria-label={t("cart")} className="size-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-[var(--brand)] hover:text-[var(--brand)] text-[var(--ink)] transition-colors">
              <RiShoppingCartLine size={20} />
            </Link>

            {/* Auth */}
            {isLoggedIn ? (
              <button className="size-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-[var(--brand)] hover:text-[var(--brand)] text-[var(--ink)] transition-colors">
                <RiUserLine size={20} />
              </button>
            ) : (
              <Link
                href="/signin"
                className="flex items-center gap-x-1.5 h-9 px-4 rounded-xl bg-[var(--brand)] text-white text-[13px] font-semibold hover:bg-[var(--brand)]/90 transition-colors whitespace-nowrap"
              >
                <RiLoginBoxLine size={16} />
                {locale === "ar" ? "دخول | تسجيل" : "لاگ ان | رجسٹر"}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <div onClick={() => setDrawerOpen(false)} className={`fixed inset-0 bg-black/50 z-[60] transition-all duration-300 ${drawerOpen ? "visible opacity-100" : "invisible opacity-0"}`} />

      <div className={`fixed top-0 bottom-0 start-0 w-72 bg-[#F7F7F7] z-[70] overflow-y-auto transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between h-[100px] bg-white px-5 border-b border-gray-200">
          <Link href="/" onClick={() => setDrawerOpen(false)}>
            <Image src="https://roohbakhshac.ir/logo.png" alt="روح‌بخش" width={120} height={40} className="object-contain h-10 w-auto" />
          </Link>
          <button type="button" onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-[var(--ink)] transition-colors">
            <RiCloseLine size={24} />
          </button>
        </div>

        <div className="px-4 py-5 flex flex-col gap-y-5">

          {/* Auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-x-3 px-2 py-3 bg-white rounded-xl border border-gray-100">
              <div className="size-10 rounded-xl bg-[var(--brand)]/10 flex items-center justify-center">
                <RiUserLine size={20} className="text-[var(--brand)]" />
              </div>
              <span className="text-sm font-semibold text-[var(--ink)]">{locale === "ar" ? "الملف الشخصي" : "پروفائل"}</span>
            </div>
          ) : (
            <div className="flex gap-x-2">
              <Link href="/signup" onClick={() => setDrawerOpen(false)} className="flex-1">
                <button type="button" className="w-full h-10 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: "var(--cta)" }}>
                  {t("signup")}
                </button>
              </Link>
              <Link href="/signin" onClick={() => setDrawerOpen(false)} className="flex-1">
                <button type="button" className="w-full h-10 rounded-xl text-sm font-semibold border transition-colors" style={{ borderColor: "var(--brand)", color: "var(--brand)" }}>
                  {t("signin")}
                </button>
              </Link>
            </div>
          )}

          {/* Language */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden text-sm font-semibold">
            {(["ar", "ur"] as const).map((lng) => (
              <button key={lng} type="button" onClick={() => switchLocale(lng)}
                className={`flex-1 py-2 transition-colors cursor-pointer ${locale === lng ? "bg-[var(--brand)] text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                {lng === "ar" ? "العربية" : "اردو"}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-bold text-[var(--brand)] mb-2.5">{t("categories_title")}</p>
            <div className="flex flex-col gap-y-0.5">
              {CATEGORIES.map(({ id, href, Icon }) => (
                <Link key={id} href={href} onClick={() => setDrawerOpen(false)} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-white transition-colors">
                  <span className="flex items-center gap-x-3 text-sm text-[var(--ink)]">
                    <Icon size={18} className="text-[var(--brand)]" />
                    {catNames[id]}
                  </span>
                  <RiArrowLeftSLine size={16} className="text-gray-300" />
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 flex flex-col gap-y-0.5">
            {([
              { href: "/articles", label: t("articles") },
              { href: "/about",    label: t("about")    },
              { href: "/cart",     label: t("cart")     },
            ] as const).map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setDrawerOpen(false)} className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-white transition-colors">
                <span className="text-sm text-[var(--ink)]">{label}</span>
                <RiArrowLeftSLine size={16} className="text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
