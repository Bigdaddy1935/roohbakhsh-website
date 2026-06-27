"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  RiHomeLine,
  RiBookmarkLine,
  RiHeartLine,
  RiExchangeDollarLine,
  RiCustomerService2Line,
  RiAccountCircleLine,
  RiLogoutBoxLine,
  RiUserLine,
  RiNotification3Line,
} from "react-icons/ri";
import { useMe, useLogout } from "@/hooks/queries/use-auth";
import { useUnreadCount } from "@/hooks/queries/use-notifications";

const UI = {
  ar: {
    quickAccess: "دسترسی سریع",
    home: "الرئيسية",
    myCourses: "دوراتي",
    favorites: "المفضلة",
    transactions: "المعاملات",
    tickets: "التيكيت",
    notifications: "الإشعارات",
    account: "تفاصيل الحساب",
    logout: "تسجيل الخروج",
  },
  ur: {
    quickAccess: "فوری رسائی",
    home: "ہوم",
    myCourses: "میرے کورسز",
    favorites: "پسندیدہ",
    transactions: "لین دین",
    tickets: "ٹکٹس",
    notifications: "اطلاعات",
    account: "اکاؤنٹ کی تفصیلات",
    logout: "لاگ آؤٹ",
  },
};

const NAV = [
  { key: "home",          href: "/dashboard",              Icon: RiHomeLine },
  { key: "myCourses",     href: "/dashboard/my-courses",   Icon: RiBookmarkLine },
  { key: "favorites",     href: "/dashboard/favorites",    Icon: RiHeartLine },
  { key: "transactions",  href: "/dashboard/transactions", Icon: RiExchangeDollarLine },
  { key: "tickets",       href: "/dashboard/tickets",      Icon: RiCustomerService2Line },
  { key: "notifications", href: "/dashboard/notifications", Icon: RiNotification3Line },
  { key: "account",       href: "/dashboard/account",      Icon: RiAccountCircleLine },
] as const;

type Props = { open: boolean; onClose: () => void };

function SidebarContent({ onClose }: { onClose: () => void }) {
  const locale = useLocale() as "ar" | "ur";
  const pathname = usePathname();
  const ui = UI[locale];
  const { data: user } = useMe();
  const { data: unread } = useUnreadCount();
  const hasUnread = (unread?.unreadCount ?? 0) > 0;
  const router = useRouter();
  const logout = useLogout();

  function handleLogout() {
    onClose();
    logout.mutate(undefined, {
      onSettled: () => router.replace("/signin"),
    });
  }

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <>
      {/* User info */}
      <div className="flex items-center justify-between pb-5 mb-5 border-b border-gray-100">
        <div className="flex items-center gap-x-2">
          <div className="size-11 rounded-full bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
            <RiUserLine size={22} className="text-[var(--brand)]" />
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-semibold max-w-28 truncate text-[var(--ink)]">
              {user?.fullName ?? "—"}
            </span>
            <span className="text-gray-400 text-xs mt-0.5">{user?.phone ?? user?.email ?? ""}</span>
          </div>
        </div>
      </div>

      {/* Quick access label */}
      <span className="text-xs text-gray-400 select-none mb-3 block">{ui.quickAccess}</span>

      {/* Nav items */}
      <div className="flex flex-col gap-y-1">
        {NAV.map(({ key, href, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={key}
              href={href}
              onClick={onClose}
              className="flex items-center gap-x-2.5 py-2.5 group"
            >
              {/* Active badge — first in DOM = rightmost in RTL flex */}
              <span
                className={`block w-0.5 h-5 ml-1 rounded-full transition-colors shrink-0 ${
                  active ? "bg-[var(--brand)]" : "bg-transparent"
                }`}
              />
              <span className="relative shrink-0">
                <Icon
                  size={20}
                  className={`transition-colors ${
                    active ? "text-[var(--brand)]" : "text-gray-400 group-hover:text-[var(--brand)]"
                  }`}
                />
                {key === "notifications" && hasUnread && (
                  <span className="absolute -top-0.5 -end-0.5 size-1.5 rounded-full bg-[var(--cta)]" />
                )}
              </span>
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

      {/* Logout — below nav */}
      <div className="mt-6 pt-5 border-t border-gray-100">
        <button
          type="button"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="flex items-center gap-x-2.5 py-2 w-full group cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="block w-0.5 h-5 ml-1 rounded-full bg-transparent shrink-0" />
          <RiLogoutBoxLine
            size={20}
            className="text-red-400 group-hover:text-red-500 transition-colors shrink-0"
          />
          <span className="text-sm text-red-400 group-hover:text-red-500 transition-colors">
            {logout.isPending ? `${ui.logout}...` : ui.logout}
          </span>
        </button>
      </div>
    </>
  );
}

const BASE = "w-64 shrink-0 bg-white border-s border-gray-100 px-7 py-5 overflow-y-auto";

export default function DashboardSidebar({ open, onClose }: Props) {
  return (
    <>
      {/* Mobile: fixed drawer */}
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
