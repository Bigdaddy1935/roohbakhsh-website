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
  RiDeleteBinLine,
  RiUserLine,
} from "react-icons/ri";
import {
  LuLayoutDashboard,
  LuBookOpen,
  LuUserCog,
  LuReceiptText,
  LuLogOut,
  LuCircleUser,
} from "react-icons/lu";
import { useMe, useLogout } from "@/hooks/queries/use-auth";
import { useCart, useRemoveFromCart } from "@/hooks/queries/use-cart";
import { useCategories } from "@/hooks/queries/use-categories";
import { useCourses } from "@/hooks/queries/use-courses";
import { formatMoney } from "@/lib/format";

type IconType = React.ComponentType<{ className?: string; size?: number }>;
const SLUG_ICONS: Record<string, IconType> = {
  quran:    RiBookOpenLine,
  fiqh:     RiScales2Line,
  aqeedah:  RiMoonLine,
  history:  RiTimeLine,
  arabic:   RiPenNibLine,
  tazkiyah: RiHeartLine,
};

const UI = {
  ar: {
    home: "الرئيسية",
    myCourses: "دوراتي",
    account: "تفاصيل الحساب",
    transactions: "المعاملات",
    logout: "تسجيل الخروج",
    cartEmpty: "سلة الشراء فارغة",
    cartTotal: "الإجمالي",
    checkout: "إتمام الشراء",
    remove: "حذف",
  },
  ur: {
    home: "ہوم",
    myCourses: "میرے کورسز",
    account: "اکاؤنٹ کی تفصیلات",
    transactions: "لین دین",
    logout: "لاگ آؤٹ",
    cartEmpty: "کارٹ خالی ہے",
    cartTotal: "کل رقم",
    checkout: "خریداری مکمل کریں",
    remove: "ہٹائیں",
  },
};

export default function Header() {
  const t = useTranslations("Header");
  const locale = useLocale() as "ar" | "ur";
  const router = useRouter();
  const pathname = usePathname();
  const ui = UI[locale];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string>("");

  const { data: user } = useMe();
  const { data: cart } = useCart();
  const { mutate: removeFromCart } = useRemoveFromCart();
  const { mutate: logout } = useLogout();
  const { data: categories = [] } = useCategories();
  const { data: allCoursesData } = useCourses({ limit: 100 });

  const isLoggedIn = !!user;
  const cartItems = cart?.items ?? [];

  const switchLocale = (next: string) => router.replace(pathname, { locale: next });

  const activeCategory = categories.find((c) => c.slug === activeSlug) ?? categories[0];
  const courseWord = locale === "ar" ? "دورة" : "کورس";

  const userMenuItems = [
    { href: "/dashboard",              icon: LuLayoutDashboard, label: ui.home },
    { href: "/dashboard/my-courses",   icon: LuBookOpen,        label: ui.myCourses },
    { href: "/dashboard/account",      icon: LuUserCog,         label: ui.account },
    { href: "/dashboard/transactions", icon: LuReceiptText,     label: ui.transactions },
  ];

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
            <Link href="/cart" aria-label={t("cart")} className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-7 text-[var(--ink)] hover:text-[var(--brand)] transition-colors" viewBox="0 0 24 24" fill="none"><g fill="none"><path d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 8H21" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -end-1.5 size-4 flex items-center justify-center rounded-full bg-[var(--cta)] text-white text-[10px] font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop logo */}
          <Link href="/" className="hidden md:block shrink-0">
            <Image src="https://roohbakhshac.ir/logo.png" alt="روح‌بخش" width={160} height={52} className="object-contain h-13 w-auto" priority />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-x-6 lg:gap-x-8 text-[14px] font-semibold text-[var(--ink)]">
            <div className="group relative">
              <Link href="/courses" className="flex items-center gap-x-1 whitespace-nowrap py-1 transition-colors hover:text-[var(--brand)] group-hover:text-[var(--brand)]">
                {t("courses")}
                <RiArrowDownSLine size={18} className="transition-transform duration-200 group-hover:rotate-180" />
              </Link>
              <div className="absolute top-full right-0 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 pt-4 z-50">
                <div className="flex bg-white border border-gray-200 rounded-xl shadow-xl shadow-black/[0.08] overflow-hidden">
                  {/* Left: category list */}
                  <div className="flex flex-col gap-y-1 p-4 w-72 shrink-0">
                    {categories.map((cat) => {
                      const Icon = SLUG_ICONS[cat.slug] ?? RiBookOpenLine;
                      const isActive = (activeSlug || categories[0]?.slug) === cat.slug;
                      return (
                        <Link key={cat.id} href={`/courses?cats=${cat.id}`}
                          onMouseEnter={() => setActiveSlug(cat.slug)}
                          className={`flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}`}>
                          <span className="flex items-center gap-x-3">
                            <Icon size={22} className={`shrink-0 ${isActive ? "text-[var(--brand)]" : "text-gray-400"}`} />
                            <span className="text-sm font-medium">{cat.name[locale]}</span>
                          </span>
                          <RiArrowLeftSLine size={18} className="text-gray-300 shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                  {/* Right: active category detail */}
                  {activeCategory && (() => {
                    const catCourses = (allCoursesData?.items ?? [])
                      .filter((c) => c.categoryId === activeCategory.id)
                      .slice(0, 5);
                    return (
                      <div className="flex flex-col justify-between bg-gray-50 w-64 p-5 border-s border-gray-100">
                        <div className="flex flex-col gap-y-3 flex-1">
                          {(activeCategory.thumbnailUrl?.[locale] ?? activeCategory.thumbnailUrl?.ar) && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={activeCategory.thumbnailUrl?.[locale] ?? activeCategory.thumbnailUrl?.ar ?? ""}
                              alt={activeCategory.name[locale]}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex flex-col gap-y-0.5 mt-2">
                            {catCourses.length > 0 ? catCourses.map((course) => (
                              <Link
                                key={course.id}
                                href={`/courses/${course.slug}`}
                                className="flex items-center gap-x-2.5 px-2 py-1.5 rounded-lg text-[13px] text-[var(--ink)] hover:bg-white hover:text-[var(--brand)] transition-colors group"
                              >
                                <span className="size-1.5 rounded-full bg-[var(--brand)]/40 group-hover:bg-[var(--brand)] shrink-0 transition-colors" />
                                <span className="line-clamp-1">{course.title[locale]}</span>
                              </Link>
                            )) : (
                              <p className="text-xs text-gray-400 px-2 py-4 text-center">{t("noCourses")}</p>
                            )}
                          </div>
                        </div>
                        <Link href={`/courses?cats=${activeCategory.id}`} className="flex items-center justify-end gap-x-2 text-[13px] font-semibold text-[var(--brand)] hover:underline pt-3 mt-auto border-t border-gray-200">
                          {t("viewAll")}
                          <RiArrowLeftSLine size={15} />
                        </Link>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
            <Link href="/articles" className="whitespace-nowrap py-1 transition-colors hover:text-[var(--brand)]">{t("articles")}</Link>
            <Link href="/about" className="whitespace-nowrap py-1 transition-colors hover:text-[var(--brand)]">{t("about")}</Link>
          </nav>

          <div className="hidden md:block flex-1" />

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-x-5">

            {/* Language switcher — toggle */}
            <button type="button" onClick={() => switchLocale(locale === "ar" ? "ur" : "ar")}
              className="border border-gray-200 rounded-md text-[12px] font-semibold cursor-pointer w-[55px] h-[35px] text-gray-500 hover:bg-gray-100 transition-colors">
              {locale === "ar" ? "اردو" : "ع"}
            </button>

            {/* Cart with hover popup */}
            <div className="group relative">
              <button type="button" aria-label={t("cart")}
                className="size-9 flex items-center justify-center rounded-xl hover:text-[var(--brand)] text-[var(--ink)] transition-colors relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-6 md:size-7" viewBox="0 0 24 24" fill="none"><g fill="none"><path d="M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 8H21" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1.5 -end-1.5 size-4 flex items-center justify-center rounded-full bg-[var(--cta)] text-white text-[10px] font-bold">
                    {cartItems.length}
                  </span>
                )}
              </button>
              {/* Cart popup */}
              <div className="absolute top-full end-0 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 pt-3 z-50 w-80">
                <div className="bg-white border border-gray-200 rounded-xl shadow-xl shadow-black/[0.08] overflow-hidden">
                  {cartItems.length === 0 ? (
                    <div className="py-10 text-center text-sm text-gray-400">{ui.cartEmpty}</div>
                  ) : (
                    <>
                      <div className="flex flex-col divide-y divide-gray-100 max-h-72 overflow-y-auto">
                        {cartItems.map((item) => {
                          const thumb = item.thumbnailUrl?.[locale] ?? item.thumbnailUrl?.ar ?? "";
                          return (
                            <div key={item.courseId} className="flex items-center gap-x-3 px-4 py-3">
                              {thumb ? (
                                <Image src={thumb} alt={item.title[locale]} width={48} height={48} className="size-12 rounded-lg object-cover shrink-0" />
                              ) : (
                                <div className="size-12 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
                                  <RiBookOpenLine size={20} className="text-[var(--brand)]" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[var(--ink)] truncate">{item.title[locale]}</p>
                                <p className="text-xs text-[var(--brand)] mt-0.5">{formatMoney(item.effectivePrice, locale)}</p>
                              </div>
                              <button type="button" onClick={() => removeFromCart(item.courseId)}
                                className="shrink-0 size-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                                <RiDeleteBinLine size={15} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500">{ui.cartTotal}:</span>
                        <span className="text-sm font-bold text-[var(--ink)]">{formatMoney(cart?.total, locale)}</span>
                      </div>
                      <div className="px-4 pb-4">
                        <Link href="/cart"
                          className="block w-full h-9 rounded-lg bg-[var(--cta)] text-white text-sm font-bold text-center leading-9 hover:opacity-90 transition-opacity">
                          {ui.checkout}
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* User icon with hover popup */}
            <div className="group relative">
              <button type="button"
                className="size-9 flex items-center justify-center rounded-xl hover:text-[var(--brand)] text-[var(--ink)] transition-colors overflow-hidden">
                {user?.avatarUrl ? (
                  <Image src={user.avatarUrl} alt="user" width={36} height={36} className="size-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-6 md:size-7" viewBox="0 0 24 24" fill="none"><g fill="none"><path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26003 15 3.41003 18.13 3.41003 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
                )}
              </button>
              {/* User menu popup */}
              <div className="absolute top-full end-0 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 pt-3 z-50 w-64">
                <div className="bg-white border border-gray-200 rounded-xl shadow-xl shadow-black/[0.08] p-5">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-x-3 pb-3 mb-1 border-b border-gray-100">
                        {user.avatarUrl ? (
                          <Image src={user.avatarUrl} alt="user" width={44} height={44} className="size-11 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="size-11 rounded-full bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
                            <LuCircleUser size={22} className="text-[var(--brand)]" />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0 cursor-default">
                          <span className="text-sm font-semibold text-[var(--ink)] truncate">{user.fullName}</span>
                          <span className="text-xs text-gray-400 mt-1">{user.phone ?? user.email}</span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        {userMenuItems.map(({ href, icon: Icon, label }) => (
                          <Link key={href} href={href}
                            className="flex items-center gap-x-3 py-2.5 px-3 hover:bg-gray-50 transition-colors rounded-lg">
                            <Icon size={22} className="text-gray-500 shrink-0" />
                            <span className="text-sm font-semibold text-[var(--ink)]">{label}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="pt-3 mt-2 border-t border-gray-100">
                        <button type="button" onClick={() => logout()}
                          className="flex items-center justify-center w-full gap-x-3 py-2.5 px-3 text-red-500 bg-red-500/10 rounded-lg cursor-pointer transition-colors hover:bg-red-500/15">
                          <LuLogOut size={18} className="shrink-0" />
                          <span className="text-sm font-semibold">{ui.logout}</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-y-2">
                      <Link href="/signin" className="block w-full h-9 rounded-lg border border-[var(--brand)] text-[var(--brand)] text-sm font-semibold text-center leading-9 hover:bg-[var(--brand)]/5 transition-colors">
                        {t("signin")}
                      </Link>
                      <Link href="/signup" className="block w-full h-9 rounded-lg bg-[var(--cta)] text-white text-sm font-bold text-center leading-9 hover:opacity-90 transition-opacity">
                        {t("signup")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

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
          {isLoggedIn ? (
            <div className="flex items-center gap-x-3 px-3 py-3 bg-white rounded-xl border border-gray-100">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt="user" width={40} height={40} className="size-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="size-10 rounded-full bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
                  <RiUserLine size={18} className="text-[var(--brand)]" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--ink)] truncate">{user.fullName}</p>
                <p className="text-xs text-gray-400 truncate">{user.phone ?? user.email}</p>
              </div>
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

          {isLoggedIn && (
            <div className="flex flex-col gap-y-0.5">
              {userMenuItems.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href} onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-x-3 px-2 py-2.5 rounded-xl hover:bg-white transition-colors">
                  <Icon size={18} className="text-[var(--brand)]" />
                  <span className="text-sm text-[var(--ink)]">{label}</span>
                </Link>
              ))}
              <button type="button" onClick={() => { logout(); setDrawerOpen(false); }}
                className="flex items-center gap-x-3 px-2 py-2.5 rounded-xl text-red-500 hover:bg-white transition-colors w-full">
                <LuLogOut size={18} />
                <span className="text-sm">{ui.logout}</span>
              </button>
            </div>
          )}

          {/* Categories */}
          <div>
            <p className="text-xs font-bold text-[var(--brand)] mb-2.5">{t("categories_title")}</p>
            <div className="flex flex-col gap-y-0.5">
              {categories.map((cat) => {
                const Icon = SLUG_ICONS[cat.slug] ?? RiBookOpenLine;
                return (
                  <Link key={cat.id} href={`/courses?cats=${cat.id}`} onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between px-2 py-2.5 rounded-xl hover:bg-white transition-colors">
                    <span className="flex items-center gap-x-3 text-sm text-[var(--ink)]">
                      <Icon size={18} className="text-[var(--brand)]" />
                      {cat.name[locale]}
                    </span>
                    <RiArrowLeftSLine size={16} className="text-gray-300" />
                  </Link>
                );
              })}
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
