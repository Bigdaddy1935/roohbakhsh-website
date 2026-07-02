"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  RiDashboardLine,
  RiBookOpenLine,
  RiUserStarLine,
  RiPriceTagLine,
  RiArticleLine,
  RiTeamLine,
  RiShoppingCartLine,
  RiBankCardLine,
  RiCustomerServiceLine,
  RiStarLine,
  RiCoupon3Line,
  RiNotificationLine,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { useLogout } from "@/hooks/queries/use-auth";

const NAV_ITEMS = [
  { href: "/dashboard", label: "داشبورد", icon: RiDashboardLine, exact: true },
  { href: "/dashboard/courses", label: "دوره‌ها", icon: RiBookOpenLine },
  { href: "/dashboard/instructors", label: "اساتید", icon: RiUserStarLine },
  { href: "/dashboard/categories", label: "دسته‌بندی‌ها", icon: RiPriceTagLine },
  { href: "/dashboard/articles", label: "مقالات", icon: RiArticleLine },
  { href: "/dashboard/users", label: "کاربران", icon: RiTeamLine },
  { href: "/dashboard/orders", label: "سفارش‌ها", icon: RiShoppingCartLine },
  { href: "/dashboard/payments", label: "پرداخت‌ها", icon: RiBankCardLine },
  { href: "/dashboard/tickets", label: "تیکت‌ها", icon: RiCustomerServiceLine },
  { href: "/dashboard/reviews", label: "نظرات", icon: RiStarLine },
  { href: "/dashboard/coupons", label: "کوپن‌ها", icon: RiCoupon3Line },
  { href: "/dashboard/notifications", label: "اعلان‌ها", icon: RiNotificationLine },
];

const Sidebar = forwardRef<HTMLElement>(function Sidebar(_props, ref) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();

  function handleLogout() {
    logout.mutate(undefined, {
      onSettled: () => router.replace("/signin"),
    });
  }

  return (
    <aside ref={ref} className="w-[var(--sidebar-w)] shrink-0 bg-white border border-gray-100 rounded-[20px] max-h-[90vh] flex flex-col overflow-hidden self-center">

      {/* Logo */}
      <div className="flex items-center justify-center py-6 px-4 border-b border-gray-100">
        <img src="https://roohbakhshac.ir/logo.png" alt="روح‌بخش" className="h-14 object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-[15px] font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--brand)] text-white"
                      : "text-[var(--ink)] hover:bg-gray-50 hover:text-[var(--brand)]"
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

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-[15px] font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
        >
          <RiLogoutBoxLine size={20} className="shrink-0" />
          <span>خروج از پنل</span>
        </button>
      </div>
    </aside>
  );
});

export default Sidebar;
