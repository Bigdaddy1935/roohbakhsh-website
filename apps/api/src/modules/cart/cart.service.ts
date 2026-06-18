import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { CartRecord, Money } from "@roohbakhsh/shared";
import { CartItem } from "./entities/cart-item.entity";
import { Course } from "../courses/entities/course.entity";
import { AddToCartDto } from "./dto/add-to-cart.dto";

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly repo: Repository<CartItem>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async getCart(userId: string): Promise<CartRecord> {
    const items = await this.repo.find({
      where: { userId },
      order: { addedAt: "ASC" },
    });
    return this.toContract(items);
  }

  async addItem(userId: string, dto: AddToCartDto): Promise<CartRecord> {
    const course = await this.courseRepo.findOne({ where: { id: dto.courseId } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");

    const exists = await this.repo.findOne({ where: { userId, courseId: dto.courseId } });
    if (exists) throw new ConflictException("COURSE_ALREADY_IN_CART");

    const item = this.repo.create({ userId, courseId: dto.courseId, course });
    await this.repo.save(item);

    return this.getCart(userId);
  }

  async removeItem(userId: string, courseId: string): Promise<CartRecord> {
    const item = await this.repo.findOne({ where: { userId, courseId } });
    if (!item) throw new NotFoundException("CART_ITEM_NOT_FOUND");
    await this.repo.remove(item);
    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    await this.repo.delete({ userId });
  }

  /** Returns raw cart items for use by OrderService */
  async getCartItems(userId: string): Promise<CartItem[]> {
    return this.repo.find({ where: { userId } });
  }

  private effectivePrice(course: Course): Money | null {
    if (course.discountPrice) {
      const isActive =
        !course.discountExpiresAt || course.discountExpiresAt > new Date();
      if (isActive) return course.discountPrice;
    }
    return course.price;
  }

  private toContract(items: CartItem[]): CartRecord {
    const cartItems = items.map((item) => ({
      courseId: item.courseId,
      title: item.course.title,
      thumbnailUrl: item.course.thumbnailUrl,
      effectivePrice: this.effectivePrice(item.course),
      addedAt: item.addedAt.toISOString(),
    }));

    const priceItems = cartItems.filter((i) => i.effectivePrice !== null);
    let total: Money | null = null;
    if (priceItems.length > 0) {
      const currencies = [...new Set(priceItems.map((i) => i.effectivePrice!.currency))];
      if (currencies.length === 1) {
        const sum = priceItems.reduce((acc, i) => acc + i.effectivePrice!.amountMinor, 0);
        total = { amountMinor: sum, currency: currencies[0] as Money["currency"] };
      }
    }

    return { items: cartItems, total };
  }
}
