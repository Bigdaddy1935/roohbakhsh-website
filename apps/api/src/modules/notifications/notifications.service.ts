import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import type { NotificationItem, NotificationType, Paginated } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Notification } from "./entities/notification.entity";
import { NotificationRead } from "./entities/notification-read.entity";
import { Course } from "../courses/entities/course.entity";
import { Article } from "../articles/entities/article.entity";
import { Coupon } from "../coupon/entities/coupon.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
    @InjectRepository(NotificationRead)
    private readonly readRepo: Repository<NotificationRead>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
  ) {}

  /** صدا زده می‌شود وقتی دوره/مقاله منتشر یا کد تخفیف جدیدی ساخته می‌شود. */
  async create(type: NotificationType, targetId: string): Promise<void> {
    await this.repo.save(this.repo.create({ type, targetId }));
  }

  /** لیست صفحه‌بندی‌شده‌ی همه‌ی اعلانات — برای صفحه‌ی کامل «اعلانات». */
  async findMinePaginated(userId: string, page: number, limit: number): Promise<Paginated<NotificationItem>> {
    const [rows, total] = await this.repo.findAndCount({
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    const items = await this.toItems(rows, userId);
    return toPaginated(items, total, page, limit);
  }

  /** آخرین N اعلان — برای داشبورد (بدون صفحه‌بندی). */
  async recentForUser(userId: string, limit: number): Promise<NotificationItem[]> {
    const rows = await this.repo.find({ order: { createdAt: "DESC" }, take: limit });
    return this.toItems(rows, userId);
  }

  async unreadCount(userId: string): Promise<number> {
    const total = await this.repo.count();
    const readCount = await this.readRepo.count({ where: { userId } });
    return Math.max(0, total - readCount);
  }

  async markRead(userId: string, notificationId: string): Promise<void> {
    const notification = await this.repo.findOne({ where: { id: notificationId } });
    if (!notification) throw new NotFoundException("NOTIFICATION_NOT_FOUND");

    const existing = await this.readRepo.findOne({ where: { userId, notificationId } });
    if (existing) return;
    await this.readRepo.save(this.readRepo.create({ userId, notificationId }));
  }

  async markAllRead(userId: string): Promise<void> {
    const all = await this.repo.find();
    if (all.length === 0) return;

    const existingReads = await this.readRepo.find({ where: { userId } });
    const readIds = new Set(existingReads.map((r) => r.notificationId));
    const toInsert = all.filter((n) => !readIds.has(n.id));
    if (toInsert.length === 0) return;

    await this.readRepo.save(toInsert.map((n) => this.readRepo.create({ userId, notificationId: n.id })));
  }

  private async toItems(rows: Notification[], userId: string): Promise<NotificationItem[]> {
    if (rows.length === 0) return [];

    const courseIds = rows.filter((r) => r.type === "course").map((r) => r.targetId);
    const articleIds = rows.filter((r) => r.type === "article").map((r) => r.targetId);
    const couponIds = rows.filter((r) => r.type === "coupon").map((r) => r.targetId);

    const [courses, articles, coupons, reads] = await Promise.all([
      courseIds.length ? this.courseRepo.find({ where: courseIds.map((id) => ({ id })) }) : Promise.resolve([]),
      articleIds.length ? this.articleRepo.find({ where: articleIds.map((id) => ({ id })) }) : Promise.resolve([]),
      couponIds.length ? this.couponRepo.find({ where: couponIds.map((id) => ({ id })) }) : Promise.resolve([]),
      this.readRepo.find({ where: { userId, notificationId: In(rows.map((r) => r.id)) } }),
    ]);
    const courseMap = new Map(courses.map((c) => [c.id, c]));
    const articleMap = new Map(articles.map((a) => [a.id, a]));
    const couponMap = new Map(coupons.map((c) => [c.id, c]));
    const readSet = new Set(reads.map((r) => r.notificationId));

    const items: NotificationItem[] = [];
    for (const row of rows) {
      if (row.type === "course") {
        const course = courseMap.get(row.targetId);
        if (!course) continue;
        items.push({
          id: row.id,
          type: "course",
          targetId: course.id,
          title: course.title,
          slug: course.slug,
          createdAt: row.createdAt.toISOString(),
          isRead: readSet.has(row.id),
        });
      } else if (row.type === "article") {
        const article = articleMap.get(row.targetId);
        if (!article) continue;
        items.push({
          id: row.id,
          type: "article",
          targetId: article.id,
          title: article.title,
          slug: article.slug,
          createdAt: row.createdAt.toISOString(),
          isRead: readSet.has(row.id),
        });
      } else {
        const coupon = couponMap.get(row.targetId);
        if (!coupon) continue;
        items.push({
          id: row.id,
          type: "coupon",
          targetId: coupon.id,
          title: {
            ar: `كود خصم جديد: ${coupon.code}`,
            ur: `نیا ڈسکاؤنٹ کوڈ: ${coupon.code}`,
          },
          slug: coupon.code,
          createdAt: row.createdAt.toISOString(),
          isRead: readSet.has(row.id),
        });
      }
    }
    return items;
  }
}
