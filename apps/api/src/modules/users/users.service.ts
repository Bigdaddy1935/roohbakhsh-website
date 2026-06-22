import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { User as UserContract, UserDashboard, Paginated, Money } from "@roohbakhsh/shared";
import { User } from "../auth/entities/user.entity";
import { Order } from "../orders/entities/order.entity";
import { TicketsService } from "../tickets/tickets.service";
import { RecentlyViewedService } from "../recently-viewed/recently-viewed.service";
import { FavoritesService } from "../favorites/favorites.service";
import { ProgressService } from "../progress/progress.service";
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

    const [ticketsCount, recentTickets, recentViews, favorites, progressMap] = await Promise.all([
      this.ticketsService.countMine(userId),
      this.ticketsService.recentForUser(userId, 3),
      this.recentlyViewedService.findRecent(userId, 5),
      this.favoritesService.findMine(userId),
      this.progressService.progressForCourses(userId, courseIds),
    ]);

    return {
      totalSpent,
      myCoursesCount: courseIds.length,
      ticketsCount,
      recentTickets,
      recentViews,
      favorites,
      coursesProgress: [...progressMap.values()],
    };
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
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
