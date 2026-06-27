"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiNotification3Line, RiShoppingCartLine, RiMenu2Line } from "react-icons/ri";
import { useCart } from "@/hooks/queries/use-cart";
import { useUnreadCount } from "@/hooks/queries/use-notifications";

const UI = {
  ar: { today: () => new Date().toLocaleDateString("ar-SA-u-ca-gregory", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
  ur: { today: () => new Date().toLocaleDateString("ur", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
};

type Props = { onMenuClick: () => void };

export default function DashboardHeader({ onMenuClick }: Props) {
  const locale = useLocale() as "ar" | "ur";
  const { data: cart } = useCart();
  const cartCount = cart?.items?.length ?? 0;
  const { data: unread } = useUnreadCount();
  const hasUnread = (unread?.unreadCount ?? 0) > 0;

  return (
    <header className="flex items-center justify-between shrink-0 w-full h-[88px] px-5 sm:px-7 bg-white max-lg:border-b max-lg:border-b-gray-100 lg:rounded-lg">
      {/* Hamburger — mobile only */}
      <button
        type="button"
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
      >
        <RiMenu2Line size={24} />
      </button>

      {/* Logo — desktop */}
      <div className="hidden md:flex items-center">
        <Image src="/logo.svg" alt="روح‌بخش" width={130} height={44} className="h-11 w-auto" />
      </div>

      {/* End side: icons + date */}
      <div className="flex items-center gap-x-3">
        {/* Cart — navigates to cart page */}
        <Link
          href="/cart"
          className="size-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative"
        >
          <RiShoppingCartLine size={22} />
          {cartCount > 0 && (
            <span className="absolute top-1.5 end-1.5 size-4 flex items-center justify-center rounded-full bg-[var(--cta)] text-white text-[10px] font-bold">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Bell */}
        <Link
          href="/dashboard/notifications"
          className="size-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative"
        >
          <RiNotification3Line size={22} />
          {hasUnread && (
            <span className="absolute top-2 end-2 size-2 rounded-full bg-[var(--cta)]" />
          )}
        </Link>

        <div className="hidden lg:block w-px h-6 bg-gray-100 mx-1" />
        <time className="hidden lg:block text-sm text-gray-400 select-none whitespace-nowrap">
          {UI[locale].today()}
        </time>
      </div>
    </header>
  );
}
