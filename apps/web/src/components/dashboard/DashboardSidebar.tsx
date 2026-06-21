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
  RiSettings4Line,
  RiLogoutBoxLine,
} from "react-icons/ri";
import { MOCK_USER_PROFILE } from "@/data/dashboard.mock";

const UI = {
  ar: {
    quickAccess: "دسترسی سریع",
    home: "الرئيسية",
    myCourses: "دوراتي",
    transactions: "المعاملات",
    tickets: "التيكيت",
    account: "تفاصيل الحساب",
  },
  ur: {
    quickAccess: "فوری رسائی",
    home: "ہوم",
    myCourses: "میرے کورسز",
    transactions: "لین دین",
    tickets: "ٹکٹس",
    account: "اکاؤنٹ کی تفصیلات",
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

function SidebarContent({ onClose }: { onClose: () => void }) {
  const locale = useLocale() as "ar" | "ur";
  const pathname = usePathname();
  const ui = UI[locale];
  const user = MOCK_USER_PROFILE;

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <>
      {/* User info */}
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-gray-100">
        <div className="flex items-center gap-x-2">
          <Image
            src={user.avatar}
            alt="avatar"
            width={44}
            height={44}
            className="size-11 rounded-full object-cover shrink-0"
          />
          <div className="flex flex-col text-sm">
            <span className="font-semibold max-w-28 truncate text-[var(--ink)]">
              {user.name[locale]}
            </span>
            <span className="text-gray-400 text-xs mt-0.5">{user.phone}</span>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <Link
            href="/dashboard/account"
            className="text-gray-400 hover:text-[var(--ink)] transition-colors"
            onClick={onClose}
          >
            <RiSettings4Line size={18} />
          </Link>
          <button type="button" className="text-gray-400 hover:text-red-500 transition-colors">
            <RiLogoutBoxLine size={18} />
          </button>
        </div>
      </div>

      {/* Quick access label */}
      <span className="text-xs text-gray-400 select-none mb-2.5 block">{ui.quickAccess}</span>

      {/* Nav items */}
      <div className="flex flex-col gap-y-0.5">
        {NAV.map(({ key, href, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={key}
              href={href}
              onClick={onClose}
              className="flex items-center gap-x-2.5 py-1.5 group"
            >
              {/* Active badge — first in DOM = rightmost in RTL flex */}
              <span
                className={`block w-0.5 h-5 ml-1 rounded-full transition-colors shrink-0 ${
                  active ? "bg-[var(--brand)]" : "bg-transparent"
                }`}
              />
              <Icon
                size={20}
                className={`transition-colors shrink-0 ${
                  active ? "text-[var(--brand)]" : "text-gray-400 group-hover:text-[var(--brand)]"
                }`}
              />
              <span
                className={`text-sm transition-colors ${
                  active
                    ? "text-[var(--ink)] font-semibold"
                    : "text-gray-600 group-hover:text-[var(--brand)]"
                }`}
              >
                {ui[key]}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

const BASE = "w-64 shrink-0 bg-white border-s border-gray-100 px-7 py-5 overflow-y-auto";

export default function DashboardSidebar({ open, onClose }: Props) {
  return (
    <>
      {/* Mobile: fixed drawer, hidden off-screen to the right when closed */}
      <aside
        className={`md:hidden fixed top-0 bottom-0 right-0 z-50 ${BASE} transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible translate-x-full"
        }`}
      >
        <SidebarContent onClose={onClose} />
      </aside>

      {/* Desktop: static in flex flow, sticky */}
      <aside className={`hidden md:block lg:sticky lg:top-5 lg:h-max lg:rounded-lg ${BASE}`}>
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
}
