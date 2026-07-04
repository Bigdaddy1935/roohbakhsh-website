export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  publishedCourses: number;
  totalArticles: number;
  paidOrders: number;
  pendingTickets: number;
  pendingReviews: number;
}

/** آمار ماهانه‌ی یک سال میلادی — برای نمودار داشبورد ادمین. هر آرایه دقیقاً ۱۲ عضو دارد (فروردین تا اسفند بر اساس ترتیب ماه میلادی، از ژانویه). */
export interface AdminMonthlyStats {
  year: number;
  /** نام ماه‌ها به فارسی، به ترتیب ژانویه تا دسامبر — طول ۱۲ */
  months: string[];
  /** تعداد سفارش‌های paid در هر ماه — طول ۱۲ */
  paidOrdersCount: number[];
  /** تعداد کاربران ثبت‌نام‌شده در هر ماه — طول ۱۲ */
  newUsersCount: number[];
  /** جمع مبلغ سفارش‌های paid در هر ماه، به تفکیک واحد پول (چون سفارش‌ها می‌توانند ارزهای مختلف داشته باشند) — هر آرایه طول ۱۲ */
  revenueByCurrency: Record<string, number[]>;
  /** تعداد کل نظرات ثبت‌شده در هر ماه (چه تأییدشده چه نشده) — طول ۱۲ */
  reviewsCount: number[];
}
