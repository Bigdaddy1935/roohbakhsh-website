import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { AdminStats } from "@roohbakhsh/shared";
import { User } from "../auth/entities/user.entity";
import { Course } from "../courses/entities/course.entity";
import { Article } from "../articles/entities/article.entity";
import { Order } from "../orders/entities/order.entity";
import { Ticket } from "../tickets/entities/ticket.entity";
import { Review } from "../reviews/entities/review.entity";

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
}
