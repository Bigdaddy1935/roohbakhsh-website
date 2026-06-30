"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { RiBell3Line, RiCheckDoubleLine, RiNotification3Line } from "react-icons/ri";
import { NotificationsPageSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useNotificationItems, useUnreadCount, useMarkRead, useMarkAllRead } from "@/hooks/queries/use-notifications";
import type { NotificationItem } from "@roohbakhsh/shared";

const UI = {
  ar: {
    title: "الإشعارات",
    subtitle: "جميع إشعاراتك في مكان واحد",
    markAllRead: "تعليم الكل كمقروء",
    empty: "لا توجد إشعارات",
  },
  ur: {
    title: "اطلاعات",
    subtitle: "آپ کی تمام اطلاعات ایک جگہ",
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
  const unreadCount = unread?.unreadCount ?? 0;

  function handleClick(n: NotificationItem) {
    if (!n.isRead) markRead.mutate(n.id);
  }

  return (
    <div className="bg-white p-4 sm:p-5 lg:rounded-2xl lg:p-7 min-h-full">
      <div className="flex items-start justify-between mb-6 gap-x-4">
        <div>
          <h1 className="text-lg font-bold text-[var(--ink)]">{ui.title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{ui.subtitle}</p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
            className="shrink-0 flex items-center gap-x-1.5 h-9 px-4 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-semibold hover:bg-[var(--brand)]/20 transition-colors disabled:opacity-60 cursor-pointer"
          >
            <RiCheckDoubleLine size={15} />
            {ui.markAllRead}
          </button>
        )}
      </div>

      {isLoading ? (
        <NotificationsPageSkeleton />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-y-4">
          <div className="size-20 rounded-2xl bg-[var(--brand)]/10 flex items-center justify-center">
            <RiNotification3Line size={36} className="text-[var(--brand)]" />
          </div>
          <p className="font-bold text-[var(--ink)]">{ui.empty}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-2">
          {items.map((n) => {
            const content = (
              <>
                <div
                  className={`size-10 sm:size-11 shrink-0 rounded-xl flex items-center justify-center ${
                    n.isRead ? "bg-gray-100 text-gray-400" : "bg-[var(--brand)]/10 text-[var(--brand)]"
                  }`}
                >
                  <RiBell3Line size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-x-2">
                    <p
                      className={`text-sm leading-snug ${
                        n.isRead ? "text-gray-500" : "text-[var(--ink)] font-semibold"
                      }`}
                    >
                      {n.title[locale]}
                    </p>
                    {!n.isRead && (
                      <span className="size-2 shrink-0 rounded-full bg-[var(--cta)] mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                    {n.body[locale]}
                  </p>
                  <p className="text-[11px] text-gray-300 mt-2">{n.createdAt.slice(0, 10)}</p>
                </div>
              </>
            );

            const cls = `flex items-start gap-x-3 p-3 sm:p-4 rounded-xl transition-all cursor-pointer ${
              n.isRead ? "hover:bg-gray-50" : "bg-[var(--brand)]/5 hover:bg-[var(--brand)]/10"
            }`;

            return n.link ? (
              <Link key={n.id} href={n.link} onClick={() => handleClick(n)} className={cls}>
                {content}
              </Link>
            ) : (
              <button key={n.id} type="button" onClick={() => handleClick(n)} className={`${cls} text-start w-full`}>
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
