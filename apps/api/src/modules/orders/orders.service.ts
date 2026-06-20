import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { OrderRecord, Money, Paginated } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import { CartService } from "../cart/cart.service";
import { CouponService } from "../coupon/coupon.service";
import { Course } from "../courses/entities/course.entity";
import { CreateOrderDto } from "./dto/create-order.dto";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    private readonly cartService: CartService,
    private readonly couponService: CouponService,
  ) {}

  async create(userId: string, dto: CreateOrderDto): Promise<OrderRecord> {
    const cartItems = await this.cartService.getCartItems(userId);
    if (cartItems.length === 0) throw new BadRequestException("CART_EMPTY");

    // Re-fetch courses to get fresh prices
    const courseIds = cartItems.map((i) => i.courseId);
    const courses = await this.courseRepo.findBy(
      courseIds.map((id) => ({ id })),
    );
    if (courses.length !== courseIds.length) {
      throw new NotFoundException("COURSE_NOT_FOUND");
    }

    // Compute subtotal (all items must share the same currency)
    const prices = courses.map((c) => this.effectivePrice(c));
    const paidPrices = prices.filter((p): p is Money => p !== null);
    const currencySet = new Set(paidPrices.map((p) => p.currency));
    const currencies = [...currencySet] as Money["currency"][];
    if (currencies.length > 1) throw new BadRequestException("MIXED_CURRENCIES");

    const currency: Money["currency"] = currencies[0] ?? "IRR";
    const subtotalAmount = prices.reduce((acc: number, p) => acc + (p?.amountMinor ?? 0), 0);
    const subtotal: Money = { amountMinor: subtotalAmount, currency };

    // Apply coupon
    let discountAmount: Money = { amountMinor: 0, currency };
    let couponId: string | null = null;
    let couponCode: string | null = null;

    if (dto.couponCode) {
      const coupon = await this.couponService.findByCode(dto.couponCode);
      if (!coupon || !this.couponService.isCouponUsable(coupon)) {
        throw new BadRequestException("COUPON_EXPIRED_OR_EXHAUSTED");
      }
      const discount = this.couponService.calcDiscount(coupon, subtotal);
      discountAmount = { amountMinor: discount, currency };
      couponId = coupon.id;
      couponCode = coupon.code;
    }

    const totalAmount = Math.max(0, subtotalAmount - discountAmount.amountMinor);
    const total: Money = { amountMinor: totalAmount, currency };

    // Build order items (snapshot prices at purchase time)
    const courseMap = new Map(courses.map((c: Course) => [c.id, c]));
    const orderItems = cartItems.map((ci) => {
      const course = courseMap.get(ci.courseId)!;
      const item = new OrderItem();
      item.courseId = ci.courseId;
      item.titleSnapshot = course.title;
      item.priceSnapshot = this.effectivePrice(course);
      return item;
    });

    const order = this.orderRepo.create({
      userId,
      status: "pending",
      subtotal,
      discountAmount,
      total,
      couponId,
      couponCode,
      items: orderItems,
    });

    const saved = await this.orderRepo.save(order);

    // Increment coupon usage after successful order creation
    if (couponId) {
      await this.couponService.incrementUsage(couponId);
    }

    // Clear the cart
    await this.cartService.clearCart(userId);

    return this.toContract(saved);
  }

  async findAll(page: number, limit: number): Promise<Paginated<OrderRecord>> {
    const [items, total] = await this.orderRepo.findAndCount({
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((o) => this.toContract(o)), total, page, limit);
  }

  async findMine(userId: string, page: number, limit: number): Promise<Paginated<OrderRecord>> {
    const [items, total] = await this.orderRepo.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((o) => this.toContract(o)), total, page, limit);
  }

  async findOne(id: string, userId?: string): Promise<OrderRecord> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException("ORDER_NOT_FOUND");
    if (userId && order.userId !== userId) throw new ForbiddenException("FORBIDDEN");
    return this.toContract(order);
  }

  /** Used by PaymentService to update order status */
  async updateStatus(id: string, status: Order["status"]): Promise<void> {
    await this.orderRepo.update(id, { status });
  }

  /** Used by InvoicesService — returns raw entity with items */
  async findEntity(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException("ORDER_NOT_FOUND");
    return order;
  }

  private effectivePrice(course: Course): Money | null {
    if (course.discountPrice) {
      const isActive =
        !course.discountExpiresAt || course.discountExpiresAt > new Date();
      if (isActive) return course.discountPrice;
    }
    return course.price;
  }

  private toContract(order: Order): OrderRecord {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      items: order.items.map((i) => ({
        id: i.id,
        courseId: i.courseId,
        titleSnapshot: i.titleSnapshot,
        priceSnapshot: i.priceSnapshot,
      })),
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      total: order.total,
      couponId: order.couponId,
      couponCode: order.couponCode,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}
