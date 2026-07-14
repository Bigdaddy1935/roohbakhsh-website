import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { In } from "typeorm";
import type { OrderRecord, AdminOrderRecord, Money, Paginated } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import { CartService } from "../cart/cart.service";
import { CouponService } from "../coupon/coupon.service";
import { Course } from "../courses/entities/course.entity";
import { User } from "../auth/entities/user.entity";
import { CourseAccessService } from "../courses/course-access.service";
import { MailService } from "../mail/mail.service";
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
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly cartService: CartService,
    private readonly couponService: CouponService,
    private readonly courseAccessService: CourseAccessService,
    private readonly mailService: MailService,
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

    // دفاع در عمق — حتی اگر از مسیر دیگری غیر از addItem به سبد اضافه شده باشد
    for (const courseId of courseIds) {
      if (await this.courseAccessService.hasPurchased(userId, courseId)) {
        throw new BadRequestException("COURSE_ALREADY_PURCHASED");
      }
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

    // Send order confirmation email (fire-and-forget — don't block the response)
    this.sendOrderConfirmationEmail(userId, saved).catch(() => undefined);

    return this.toContract(saved);
  }

  async findAll(page: number, limit: number): Promise<Paginated<AdminOrderRecord>> {
    const [items, total] = await this.orderRepo.findAndCount({
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    const userIds = [...new Set(items.map((o) => o.userId).filter(Boolean))];
    const users = userIds.length
      ? await this.userRepo.find({ where: { id: In(userIds) } })
      : [];
    const userMap = new Map(users.map((u) => [u.id, u]));
    const contracts = items.map((o) => {
      const user = userMap.get(o.userId);
      return {
        ...this.toContract(o),
        user: user ? { id: user.id, fullName: user.fullName, email: user.email } : null,
      };
    });
    return toPaginated(contracts, total, page, limit);
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

  private async sendOrderConfirmationEmail(userId: string, order: Order): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return;

    const courseList = order.items
      .map((i) => `<li>${i.titleSnapshot?.ar ?? i.titleSnapshot?.ur ?? ""}</li>`)
      .join("");

    const totalFormatted = new Intl.NumberFormat("fa-IR").format(
      order.total.amountMinor / 100,
    );

    await this.mailService.send({
      to: user.email,
      subject: "تأیید سفارش — آکادمی روح‌بخش",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif;">
          <h2>سفارش شما ثبت شد</h2>
          <p>با سلام ${user.fullName}،</p>
          <p>سفارش شما با موفقیت ثبت گردید. لطفاً مبلغ را واریز کرده و رسید پرداخت را ارسال نمایید.</p>
          <p><strong>شماره سفارش:</strong> ${order.id}</p>
          <ul>${courseList}</ul>
          <p><strong>مبلغ کل:</strong> ${totalFormatted} تومان</p>
          <p>پس از تأیید پرداخت، دسترسی به دوره‌ها فعال می‌شود.</p>
        </div>
      `,
    });
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
