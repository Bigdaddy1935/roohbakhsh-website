import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderItem } from "../orders/entities/order-item.entity";

@Injectable()
export class CourseAccessService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  /** آیا کاربر این دوره را با سفارش paid خریده است؟ */
  async hasPurchased(userId: string | undefined, courseId: string): Promise<boolean> {
    if (!userId) return false;
    const count = await this.orderItemRepo
      .createQueryBuilder("item")
      .innerJoin("item.order", "order")
      .where("item.courseId = :courseId", { courseId })
      .andWhere("order.userId = :userId", { userId })
      .andWhere("order.status = :status", { status: "paid" })
      .getCount();
    return count > 0;
  }

  /** آیا کاربر مجاز به دیدن ویدیوی کامل این درس است؟ (پیش‌نمایش رایگان، ادمین، یا خریدار) */
  async canSeeFullVideo(
    isFreePreview: boolean,
    userId: string | undefined,
    isAdmin: boolean | undefined,
    courseId: string,
  ): Promise<boolean> {
    if (isFreePreview || isAdmin) return true;
    return this.hasPurchased(userId, courseId);
  }
}
