import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { User as UserContract, UserDashboard, Paginated, Money, UserRole } from "@roohbakhsh/shared";
import { User } from "../auth/entities/user.entity";
import { Order } from "../orders/entities/order.entity";
import { TicketsService } from "../tickets/tickets.service";
import { RecentlyViewedService } from "../recently-viewed/recently-viewed.service";
import { FavoritesService } from "../favorites/favorites.service";
import { ProgressService } from "../progress/progress.service";
import { NotificationsService } from "../notifications/notifications.service";
import { toPaginated } from "../../common/utils/paginate";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly ticketsService: TicketsService,
    private readonly recentlyViewedService: RecentlyViewedService,
    private readonly favoritesService: FavoritesService,
    private readonly progressService: ProgressService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(page: number, limit: number): Promise<Paginated<UserContract>> {
    const [users, total] = await this.repo.findAndCount({
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(users.map(this.toContract), total, page, limit);
  }

  /** خروجی داشبورد پروفایل کاربر — هزینه کل، تعداد دوره، تیکت‌ها. */
  async dashboard(userId: string): Promise<UserDashboard> {
    const paidOrders = await this.orderRepo.find({ where: { userId, status: "paid" } });

    const totalSpent: Money | null =
      paidOrders.length === 0
        ? null
        : {
            amountMinor: paidOrders.reduce((sum, o) => sum + o.total.amountMinor, 0),
            currency: paidOrders[0]!.total.currency,
          };

    const courseIds = [...new Set(paidOrders.flatMap((o) => o.items.map((i) => i.courseId)))];

    const [ticketsCount, recentTickets, recentViews, favorites, progressMap, unreadNotificationsCount, recentNotifications] =
      await Promise.all([
        this.ticketsService.countMine(userId),
        this.ticketsService.recentForUser(userId, 3),
        this.recentlyViewedService.findRecent(userId, 5),
        this.favoritesService.findMine(userId),
        this.progressService.progressForCourses(userId, courseIds),
        this.notificationsService.unreadCount(userId),
        this.notificationsService.recentForUser(userId, 5),
      ]);

    return {
      totalSpent,
      myCoursesCount: courseIds.length,
      ticketsCount,
      recentTickets,
      recentViews,
      favorites,
      coursesProgress: [...progressMap.values()],
      unreadNotificationsCount,
      recentNotifications,
    };
  }

  async updateRole(id: string, role: UserRole): Promise<UserContract> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException("USER_NOT_FOUND");
    user.role = role;
    await this.repo.save(user);
    return this.toContract(user);
  }

  /** فقط وقتی صفر admin در DB هست کار می‌کند — bootstrap اولین ادمین */
  async bootstrapAdmin(id: string): Promise<UserContract> {
    const adminCount = await this.repo.count({ where: { role: "admin" } });
    if (adminCount > 0) throw new ForbiddenException("ADMIN_ALREADY_EXISTS");
    return this.updateRole(id, "admin");
  }

  private toContract(user: User): UserContract {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      preferredLocale: user.preferredLocale,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
