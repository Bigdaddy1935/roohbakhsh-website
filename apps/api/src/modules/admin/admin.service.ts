import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import type { AdminStats, AdminMonthlyStats } from "@roohbakhsh/shared";
import { User } from "../auth/entities/user.entity";
import { Course } from "../courses/entities/course.entity";
import { Article } from "../articles/entities/article.entity";
import { Order } from "../orders/entities/order.entity";
import { Ticket } from "../tickets/entities/ticket.entity";
import { Review } from "../reviews/entities/review.entity";

const PERSIAN_MONTHS = [
  "ژانویه", "فوریه", "مارس", "آوریل", "می", "ژوئن",
  "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر",
];

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Article) private readonly articleRepo: Repository<Article>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
  ) {}

  async getStats(): Promise<AdminStats> {
    const [
      totalUsers,
      totalCourses,
      publishedCourses,
      totalArticles,
      paidOrders,
      pendingTickets,
      pendingReviews,
    ] = await Promise.all([
      this.userRepo.count(),
      this.courseRepo.count(),
      this.courseRepo.count({ where: { isPublished: true } }),
      this.articleRepo.count(),
      this.orderRepo.count({ where: { status: "paid" } }),
      this.ticketRepo.count({ where: { status: "open" } }),
      this.reviewRepo.count({ where: { isApproved: false } }),
    ]);

    return {
      totalUsers,
      totalCourses,
      publishedCourses,
      totalArticles,
      paidOrders,
      pendingTickets,
      pendingReviews,
    };
  }

  /** آمار ماهانه‌ی یک سال میلادی — سفارش‌های paid، کاربران جدید، درآمد به‌تفکیک ارز، تعداد نظرات. */
  async getMonthlyStats(year: number): Promise<AdminMonthlyStats> {
    const startDate = new Date(Date.UTC(year, 0, 1));
    const endDate = new Date(Date.UTC(year + 1, 0, 1));

    const [paidOrders, users, reviews] = await Promise.all([
      this.orderRepo.find({
        where: { status: "paid", createdAt: Between(startDate, endDate) },
        select: { total: true, createdAt: true },
      }),
      this.userRepo.find({
        where: { createdAt: Between(startDate, endDate) },
        select: { createdAt: true },
      }),
      this.reviewRepo.find({
        where: { createdAt: Between(startDate, endDate) },
        select: { createdAt: true },
      }),
    ]);

    const paidOrdersCount = Array(12).fill(0) as number[];
    const newUsersCount = Array(12).fill(0) as number[];
    const reviewsCount = Array(12).fill(0) as number[];
    const revenueByCurrency: Record<string, number[]> = {};

    for (const order of paidOrders) {
      const month = order.createdAt.getUTCMonth();
      paidOrdersCount[month]!++;
      const currency = order.total.currency;
      const series = revenueByCurrency[currency] ?? (revenueByCurrency[currency] = Array(12).fill(0));
      series[month] += order.total.amountMinor;
    }

    for (const user of users) {
      newUsersCount[user.createdAt.getUTCMonth()]!++;
    }

    for (const review of reviews) {
      reviewsCount[review.createdAt.getUTCMonth()]!++;
    }

    return {
      year,
      months: PERSIAN_MONTHS,
      paidOrdersCount,
      newUsersCount,
      revenueByCurrency,
      reviewsCount,
    };
  }
}
