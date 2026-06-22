import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { User as UserContract, UserDashboard, Paginated, Money } from "@roohbakhsh/shared";
import { User } from "../auth/entities/user.entity";
import { Order } from "../orders/entities/order.entity";
import { TicketsService } from "../tickets/tickets.service";
import { toPaginated } from "../../common/utils/paginate";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly ticketsService: TicketsService,
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

    const courseIds = new Set(paidOrders.flatMap((o) => o.items.map((i) => i.courseId)));

    const [ticketsCount, recentTickets] = await Promise.all([
      this.ticketsService.countMine(userId),
      this.ticketsService.recentForUser(userId, 3),
    ]);

    return {
      totalSpent,
      myCoursesCount: courseIds.size,
      ticketsCount,
      recentTickets,
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
