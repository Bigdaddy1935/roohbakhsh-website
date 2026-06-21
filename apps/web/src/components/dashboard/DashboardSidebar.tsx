"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  RiHomeLine,
  RiBookmarkLine,
  RiExchangeDollarLine,
  RiCustomerService2Line,
  RiAccountCircleLine,
  RiLogoutBoxLine,
  RiCloseLine,
} from "react-icons/ri";
import { MOCK_USER_PROFILE } from "@/data/dashboard.mock";

const UI = {
  ar: {
    nav: "القائمة",
    home: "الرئيسية",
    myCourses: "دوراتي",
    transactions: "المعاملات",
    tickets: "التيكيت",
    account: "تفاصيل الحساب",
    logout: "تسجيل الخروج",
  },
  ur: {
    nav: "مینو",
    home: "ہوم",
    myCourses: "میرے کورسز",
    transactions: "لین دین",
    tickets: "ٹکٹس",
    account: "اکاؤنٹ کی تفصیلات",
    logout: "لاگ آؤٹ",
  },
};

const NAV = [
  { key: "home",         href: "/dashboard",              Icon: RiHomeLine },
  { key: "myCourses",   href: "/dashboard/my-courses",   Icon: RiBookmarkLine },
  { key: "transactions", href: "/dashboard/transactions", Icon: RiExchangeDollarLine },
  { key: "tickets",     href: "/dashboard/tickets",      Icon: RiCustomerService2Line },
  { key: "account",     href: "/dashboard/account",      Icon: RiAccountCircleLine },
] as const;

type Props = { open: boolean; onClose: () => void };

export default function DashboardSidebar({ open, onClose }: Props) {
  const locale = useLocale() as "ar" | "ur";
  const pathname = usePathname();
  const ui = UI[locale];
  const user = MOCK_USER_PROFILE;

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 end-0 z-50 w-60 bg-white border-s border-gray-100 flex flex-col
        transition-transform duration-300
        lg:static lg:translate-x-0 lg:z-auto
        ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>
        {/* Mobile close */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 lg:hidden">
          <span className="text-sm font-bold text-[var(--ink)]">{ui.nav}</span>
          <button onClick={onClose} className="text-gray-400 hover:text-[var(--ink)]">
            <RiCloseLine size={22} />
          </button>
        </div>

        {/* User card */}
        <div className="flex items-center gap-x-3 px-4 py-4 border-b border-gray-100">
          <Image
            src={user.avatar}
            alt="avatar"
            width={44}
            height={44}
            className="size-11 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-bold text-[var(--ink)] truncate">{user.name[locale]}</p>
            <p className="text-xs text-gray-400 truncate mt-0.5">{user.phone}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV.map(({ key, href, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={key}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-x-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors text-sm font-medium
                  ${active
                    ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[var(--ink)]"
                  }`}
              >
                {active && <span className="absolute end-2 w-0.5 h-5 bg-[var(--brand)] rounded-full" />}
                <Icon size={19} className={active ? "text-[var(--brand)]" : "text-gray-400"} />
                {ui[key]}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-4 border-t border-gray-100 pt-3">
          <button
            type="button"
            className="flex items-center gap-x-3 w-full px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
          >
            <RiLogoutBoxLine size={19} />
            {ui.logout}
          </button>
        </div>
      </aside>
    </>
  );
}
