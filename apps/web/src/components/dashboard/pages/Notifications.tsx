"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiLoader4Line, RiNotification3Line, RiCheckDoubleLine } from "react-icons/ri";
import { useNotificationItems, useUnreadCount, useMarkRead, useMarkAllRead } from "@/hooks/queries/use-notifications";
import type { NotificationItem } from "@roohbakhsh/shared";

const UI = {
  ar: {
    title: "الإشعارات",
    markAllRead: "تعليم الكل كمقروء",
    empty: "لا توجد إشعارات بعد",
  },
  ur: {
    title: "اطلاعات",
    markAllRead: "سب کو پڑھا گیا نشان زد کریں",
    empty: "ابھی کوئی اطلاع نہیں",
  },
};

export default function Notifications() {
  const locale = useLocale() as "ar" | "ur";
  const ui = UI[locale];

  const { data, isLoading } = useNotificationItems({ limit: 50 });
  const { data: unread } = useUnreadCount();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const items = data?.items ?? [];

  function handleClick(n: NotificationItem) {
    if (!n.isRead) markRead.mutate(n.id);
  }

  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-md lg:p-7 min-h-full">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-base font-bold text-[var(--ink)]">{ui.title}</h1>
        {(unread?.unreadCount ?? 0) > 0 && (
          <button
            type="button"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="flex items-center gap-x-1.5 text-xs font-semibold text-[var(--brand)] hover:underline disabled:opacity-60"
          >
            <RiCheckDoubleLine size={15} />
            {ui.markAllRead}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RiLoader4Line size={32} className="text-[var(--brand)] animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-y-3 text-gray-400">
          <RiNotification3Line size={48} className="opacity-30" />
          <p className="font-semibold">{ui.empty}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-2">
          {items.map((n) => {
            const content = (
              <>
                {/* unread dot */}
                <span
                  className={`size-2 shrink-0 rounded-full ${n.isRead ? "bg-transparent" : "bg-[var(--cta)]"}`}
                />
                <div className="size-12 shrink-0 rounded-md flex items-center justify-center bg-[var(--brand)]/10 text-[var(--brand)]">
                  <RiNotification3Line size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm line-clamp-1 ${n.isRead ? "text-gray-500" : "text-[var(--ink)] font-semibold"}`}>
                    {n.title[locale]}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-3 mt-1">{n.body[locale]}</p>
                  <p className="text-[11px] text-gray-300 mt-1.5">{n.createdAt.slice(0, 10)}</p>
                </div>
              </>
            );

            const rowCls = `flex items-start gap-x-3 rounded-md border px-4 py-4 min-h-[92px] transition-colors w-full ${
              n.isRead ? "border-gray-100" : "border-[var(--brand)]/20 bg-[var(--brand)]/5"
            } hover:border-gray-300`;

            return n.link ? (
              <Link key={n.id} href={n.link} onClick={() => handleClick(n)} className={rowCls}>
                {content}
              </Link>
            ) : (
              <button key={n.id} type="button" onClick={() => handleClick(n)} className={`${rowCls} text-start`}>
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
