"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { useState } from "react";
import { RiBellLine, RiShoppingCartLine, RiMoonLine, RiMenu2Line, RiSearchLine } from "react-icons/ri";
import { MOCK_USER_PROFILE } from "@/data/dashboard.mock";

const UI = {
  ar: { search: "البحث في دوراتي، التيكيت، المالية...", today: "الإثنين ٢١ يونيو ٢٠٢٦" },
  ur: { search: "میرے کورسز، ٹکٹس، مالی...", today: "پیر ۲۱ جون ۲۰۲۶" },
};

type Props = { onMenuClick: () => void };

export default function DashboardHeader({ onMenuClick }: Props) {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];
  const user = MOCK_USER_PROFILE;
  const [search, setSearch] = useState("");

  return (
    <header className="bg-white border-b border-gray-100 h-[68px] flex items-center px-4 gap-x-3 shrink-0">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden text-gray-500 hover:text-[var(--ink)] transition-colors"
      >
        <RiMenu2Line size={22} />
      </button>

      {/* User info — visible on desktop, start side (right in RTL) */}
      <div className="hidden lg:flex items-center gap-x-2.5 shrink-0">
        <Image
          src={user.avatar}
          alt="avatar"
          width={36}
          height={36}
          className="size-9 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-bold text-[var(--ink)] leading-tight">{user.name[locale]}</p>
          <p className="text-xs text-gray-400">{user.phone}</p>
        </div>
      </div>

      <div className="hidden lg:block w-px h-8 bg-gray-100 mx-1" />

      {/* Search */}
      <div className="flex-1 relative max-w-md">
        <RiSearchLine size={16} className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ui.search}
          className="w-full h-9 rounded-lg border border-gray-200 bg-gray-50 ps-4 pe-9 text-sm text-[var(--ink)] placeholder:text-gray-400 outline-none focus:border-[var(--brand)] transition-colors"
        />
      </div>

      <div className="flex-1" />

      {/* Icons */}
      <div className="flex items-center gap-x-1.5">
        <button type="button" className="size-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors relative">
          <RiBellLine size={20} />
          <span className="absolute top-1.5 end-1.5 size-2 rounded-full bg-[var(--cta)]" />
        </button>
        <button type="button" className="size-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <RiShoppingCartLine size={20} />
        </button>
        <button type="button" className="size-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <RiMoonLine size={20} />
        </button>
      </div>

      {/* Date — end side (left in RTL) desktop only */}
      <div className="hidden lg:block w-px h-8 bg-gray-100 mx-1" />
      <p className="hidden lg:block text-xs text-gray-400 whitespace-nowrap shrink-0">{ui.today}</p>
    </header>
  );
}
