import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import type { NotificationItem, Paginated } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Notification } from "./entities/notification.entity";
import { NotificationRead } from "./entities/notification-read.entity";
import { CreateNotificationDto } from "./dto/create-notification.dto";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
    @InjectRepository(NotificationRead)
    private readonly readRepo: Repository<NotificationRead>,
  ) {}

  /** ادمین یک پیام دلخواه برای همه‌ی کاربران ارسال می‌کند. */
  async create(dto: CreateNotificationDto): Promise<NotificationItem> {
    const saved = await this.repo.save(
      this.repo.create({ title: dto.title, body: dto.body, link: dto.link ?? null }),
    );
    return { ...this.toItem(saved), isRead: false };
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

  private toItem(row: Notification): Omit<NotificationItem, "isRead"> {
    return {
      id: row.id,
      title: row.title,
      body: row.body,
      link: row.link,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private async toItems(rows: Notification[], userId: string): Promise<NotificationItem[]> {
    if (rows.length === 0) return [];

    const reads = await this.readRepo.find({ where: { userId, notificationId: In(rows.map((r) => r.id)) } });
    const readSet = new Set(reads.map((r) => r.notificationId));

    return rows.map((row) => ({ ...this.toItem(row), isRead: readSet.has(row.id) }));
  }
}
