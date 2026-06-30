"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  RiHome3Line,
  RiPlayCircleLine,
  RiHeart3Line,
  RiBankCardLine,
  RiMessage2Line,
  RiBellLine,
  RiUser3Line,
  RiShutDownLine,
  RiUserLine,
} from "react-icons/ri";
import { useMe, useLogout } from "@/hooks/queries/use-auth";
import { useUnreadCount } from "@/hooks/queries/use-notifications";

const UI = {
  ar: {
    quickAccess: "القائمة",
    home: "الرئيسية",
    myCourses: "دوراتي",
    favorites: "المفضلة",
    transactions: "المعاملات",
    tickets: "الدعم الفني",
    notifications: "الإشعارات",
    account: "الحساب",
    logout: "تسجيل الخروج",
  },
  ur: {
    quickAccess: "مینو",
    home: "ہوم",
    myCourses: "میرے کورسز",
    favorites: "پسندیدہ",
    transactions: "لین دین",
    tickets: "سپورٹ",
    notifications: "اطلاعات",
    account: "اکاؤنٹ",
    logout: "لاگ آؤٹ",
  },
};

const NAV = [
  { key: "home",          href: "/dashboard",               Icon: RiHome3Line },
  { key: "myCourses",     href: "/dashboard/my-courses",    Icon: RiPlayCircleLine },
  { key: "favorites",     href: "/dashboard/favorites",     Icon: RiHeart3Line },
  { key: "transactions",  href: "/dashboard/transactions",  Icon: RiBankCardLine },
  { key: "tickets",       href: "/dashboard/tickets",       Icon: RiMessage2Line },
  { key: "notifications", href: "/dashboard/notifications", Icon: RiBellLine },
  { key: "account",       href: "/dashboard/account",       Icon: RiUser3Line },
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
    logout.mutate(undefined, { onSettled: () => router.replace("/signin") });
  }

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <>
      {/* User card */}
      <div className="flex items-center gap-x-3 p-3 mb-5 rounded-2xl bg-gradient-to-l from-[var(--brand)]/8 to-[var(--brand)]/4">
        <div className="size-10 rounded-xl bg-[var(--brand)] flex items-center justify-center shrink-0 shadow-md shadow-[var(--brand)]/30">
          <RiUserLine size={20} className="text-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-[var(--ink)] truncate">
            {user?.fullName ?? "—"}
          </span>
          <span className="text-xs text-gray-400 truncate mt-0.5">{user?.phone ?? user?.email ?? ""}</span>
        </div>
      </div>

      {/* Label */}
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">
        {ui.quickAccess}
      </p>

      {/* Nav */}
      <nav className="flex flex-col gap-y-0.5">
        {NAV.map(({ key, href, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={key}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[var(--ink)]"
              }`}
            >
              <span className="relative shrink-0">
                <Icon size={20} />
                {key === "notifications" && hasUnread && (
                  <span className="absolute -top-0.5 -end-0.5 size-2 rounded-full bg-[var(--cta)]" />
                )}
              </span>
              <span className={`text-sm ${active ? "font-bold" : "font-medium"}`}>
                {ui[key]}
              </span>
              {active && (
                <span className="ms-auto size-1.5 rounded-full bg-[var(--brand)] shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleLogout}
          disabled={logout.isPending}
          className="flex items-center gap-x-3 px-3 py-2.5 w-full rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 disabled:opacity-60 cursor-pointer"
        >
          <RiShutDownLine size={20} />
          <span className="text-sm font-medium">
            {logout.isPending ? `${ui.logout}...` : ui.logout}
          </span>
        </button>
      </div>
    </>
  );
}

const BASE = "w-64 shrink-0 bg-white px-4 py-5 overflow-y-auto";

export default function DashboardSidebar({ open, onClose }: Props) {
  return (
    <>
      <aside
        className={`md:hidden fixed top-0 bottom-0 right-0 z-50 ${BASE} shadow-2xl transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible translate-x-full"
        }`}
      >
        <SidebarContent onClose={onClose} />
      </aside>

      <aside className={`hidden md:block lg:sticky lg:top-5 lg:h-max lg:rounded-2xl ${BASE}`}>
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
}
