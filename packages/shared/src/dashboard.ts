import type { Money } from "./common";
import type { FavoriteItem } from "./favorites";
import type { RecentViewItem } from "./recently-viewed";
import type { Ticket } from "./ticket";

export interface CourseProgressSummary {
  courseId: string;
  progressPercent: number;
}

export interface UserDashboard {
  myCoursesCount: number;
  ticketsCount: number;
  totalSpent: Money;
  favorites: FavoriteItem[];
  coursesProgress: CourseProgressSummary[];
  recentViews: RecentViewItem[];
  recentTickets: Ticket[];
}
