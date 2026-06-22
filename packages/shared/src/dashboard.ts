// ──────────────────────────────────────────────────────────────
// داشبورد کاربری — NestJS API
// ──────────────────────────────────────────────────────────────

export interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  totalWatchedMinutes: number;
  openTickets: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
}
