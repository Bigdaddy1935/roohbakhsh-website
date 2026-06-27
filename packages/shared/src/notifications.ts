import type { ID, ISODate, Localized } from "./common";

export interface NotificationItem {
  id: ID;
  userId: ID;
  title: Localized;
  body: Localized;
  link: string | null;
  isRead: boolean;
  createdAt: ISODate;
}

export interface NotificationsSummary {
  unreadCount: number;
}
