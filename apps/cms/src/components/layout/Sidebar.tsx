"use client";

import { forwardRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  RiDashboardLine,
  RiBookOpenLine,
  RiUserStarLine,
  RiPriceTagLine,
  RiImageLine,
  RiArticleLine,
  RiTeamLine,
  RiShoppingCartLine,
  RiBankCardLine,
  RiCustomerServiceLine,
  RiStarLine,
  RiCoupon3Line,
  RiNotificationLine,
  RiLogoutBoxLine,
  RiSettings4Line,
  RiMenuLine,
  RiCloseLine,
} from "react-icons/ri";
import { useLogout } from "@/hooks/queries/use-auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "داشبورد", icon: RiDashboardLine, exact: true },
  { href: "/dashboard/courses", label: "دوره‌ها", icon: RiBookOpenLine },
  { href: "/dashboard/gallery", label: "گالری", icon: RiImageLine },
  { href: "/dashboard/instructors", label: "کارمندان", icon: RiUserStarLine },
  { href: "/dashboard/categories", label: "دسته‌بندی‌ها", icon: RiPriceTagLine },
  { href: "/dashboard/articles", label: "مقالات", icon: RiArticleLine },
  { href: "/dashboard/users", label: "کاربران", icon: RiTeamLine },
  { href: "/dashboard/orders", label: "سفارش‌ها", icon: RiShoppingCartLine },
  { href: "/dashboard/payments", label: "پرداخت‌ها", icon: RiBankCardLine },
  { href: "/dashboard/tickets", label: "تیکت‌ها", icon: RiCustomerServiceLine },
  { href: "/dashboard/reviews", label: "نظرات", icon: RiStarLine },
  { href: "/dashboard/coupons", label: "کوپن‌ها", icon: RiCoupon3Line },
  { href: "/dashboard/notifications", label: "اعلان‌ها", icon: RiNotificationLine },
  { href: "/dashboard/settings", label: "تنظیمات", icon: RiSettings4Line },
];

const BOTTOM_ITEMS = NAV_ITEMS.slice(0, 4);

const Sidebar = forwardRef<HTMLElement>(function Sidebar(_props, ref) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleLogout() {
    logout.mutate(undefined, {
      onSettled: () => router.replace("/signin"),
    });
  }

  return (
    <>
      {/* ── دسکتاپ / تبلت: sidebar عمودی ── */}
      <aside
        ref={ref}
        className="hidden md:flex w-12 lg:w-[var(--sidebar-w)] shrink-0 bg-white border border-gray-100 rounded-[20px] max-h-[90vh] flex-col overflow-hidden sticky top-12"
      >
        {/* Logo — فقط دسکتاپ */}
        <div className="hidden lg:flex items-center justify-center h-[105px] px-4 border-b border-gray-100 shrink-0">
          <img
            src="https://roohbakhshac.ir/logo.png"
            alt="روح‌بخش"
            className="h-14 object-contain"
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="flex flex-col gap-1 px-2 lg:px-3">
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    title={label}
                    className={`flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 rounded-md text-[15px] font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--brand)] text-white"
                        : "text-[var(--ink)] hover:bg-gray-50 hover:text-[var(--brand)]"
                    }`}
                  >
                    <Icon size={20} className="shrink-0" />
                    <span className="hidden lg:inline">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-2 lg:p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            disabled={logout.isPending}
            title="خروج از پنل"
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 rounded-md text-[15px] font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
          >
            <RiLogoutBoxLine size={20} className="shrink-0" />
            <span className="hidden lg:inline">خروج از پنل</span>
          </button>
        </div>
      </aside>

      {/* ── موبایل: bottom navigation bar ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-gray-100 flex items-center justify-around px-2 h-16">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                isActive ? "text-[var(--brand)]" : "text-gray-400"
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}

        {/* دکمه منوی کامل */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-gray-400"
        >
          <RiMenuLine size={22} />
          <span className="text-[10px] font-medium">بیشتر</span>
        </button>
      </nav>

      {/* ── Drawer موبایل ── */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex flex-col justify-end">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          {/* sheet */}
          <div className="relative bg-white rounded-t-[24px] max-h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-bold text-[var(--ink)]">منو</span>
              <button onClick={() => setDrawerOpen(false)} className="text-gray-400">
                <RiCloseLine size={22} />
              </button>
            </div>
            <nav className="overflow-y-auto py-3">
              <ul className="flex flex-col gap-1 px-3">
                {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
                  const isActive = exact ? pathname === href : pathname.startsWith(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setDrawerOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium transition-colors ${
                          isActive
                            ? "bg-[var(--brand)] text-white"
                            : "text-[var(--ink)] hover:bg-gray-50"
                        }`}
                      >
                        <Icon size={20} className="shrink-0" />
                        <span>{label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={handleLogout}
                disabled={logout.isPending}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <RiLogoutBoxLine size={20} />
                <span>خروج از پنل</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default Sidebar;
