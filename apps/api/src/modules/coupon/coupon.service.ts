import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type {
  CouponRecord,
  ValidateCouponResponse,
  Money,
  Paginated,
} from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Coupon } from "./entities/coupon.entity";
import { NotificationsService } from "../notifications/notifications.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { UpdateCouponDto } from "./dto/update-coupon.dto";
import { ValidateCouponDto } from "./dto/validate-coupon.dto";

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly repo: Repository<Coupon>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(page: number, limit: number): Promise<Paginated<CouponRecord>> {
    const [items, total] = await this.repo.findAndCount({
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((c) => this.toContract(c)), total, page, limit);
  }

  async findOne(id: string): Promise<CouponRecord> {
    const coupon = await this.repo.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException("COUPON_NOT_FOUND");
    return this.toContract(coupon);
  }

  async create(dto: CreateCouponDto): Promise<CouponRecord> {
    const existing = await this.repo.findOne({ where: { code: dto.code.toUpperCase() } });
    if (existing) throw new ConflictException("COUPON_CODE_TAKEN");

    if (dto.discountType === "fixed" && !dto.currency) {
      throw new BadRequestException("COUPON_CURRENCY_REQUIRED");
    }
    if (dto.discountType === "percentage" && dto.discountValue > 100) {
      throw new BadRequestException("COUPON_PERCENTAGE_MAX_100");
    }

    const coupon = this.repo.create({
      code: dto.code.toUpperCase(),
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      currency: dto.currency ?? null,
      maxUses: dto.maxUses ?? null,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      isActive: dto.isActive ?? true,
    });
    const saved = await this.repo.save(coupon);
    if (saved.isActive) {
      await this.notificationsService.create("coupon", saved.id);
    }
    return this.toContract(saved);
  }

  async update(id: string, dto: UpdateCouponDto): Promise<CouponRecord> {
    const coupon = await this.repo.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException("COUPON_NOT_FOUND");

    if (dto.maxUses !== undefined) coupon.maxUses = dto.maxUses;
    if (dto.expiresAt !== undefined) {
      coupon.expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : null;
    }
    if (dto.isActive !== undefined) coupon.isActive = dto.isActive;

    return this.toContract(await this.repo.save(coupon));
  }

  async remove(id: string): Promise<void> {
    const coupon = await this.repo.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException("COUPON_NOT_FOUND");
    await this.repo.remove(coupon);
  }

  async validate(dto: ValidateCouponDto): Promise<ValidateCouponResponse> {
    const coupon = await this.repo.findOne({
      where: { code: dto.code.toUpperCase(), isActive: true },
    });

    if (!coupon) throw new NotFoundException("COUPON_NOT_FOUND");
    if (!this.isCouponUsable(coupon)) {
      throw new BadRequestException("COUPON_EXPIRED_OR_EXHAUSTED");
    }

    const discount = this.calcDiscount(coupon, dto.orderTotal);
    const finalAmount = Math.max(0, dto.orderTotal.amountMinor - discount);

    return {
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountAmount: { amountMinor: discount, currency: dto.orderTotal.currency },
      finalTotal: { amountMinor: finalAmount, currency: dto.orderTotal.currency },
    };
  }

  /** used by OrderService — returns the entity so the order can reference it */
  async findByCode(code: string): Promise<Coupon | null> {
    return this.repo.findOne({ where: { code: code.toUpperCase(), isActive: true } });
  }

  async incrementUsage(id: string): Promise<void> {
    await this.repo.increment({ id }, "usedCount", 1);
  }

  isCouponUsable(coupon: Coupon): boolean {
    if (!coupon.isActive) return false;
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return false;
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) return false;
    return true;
  }

  calcDiscount(coupon: Coupon, total: Money): number {
    if (coupon.discountType === "percentage") {
      return Math.floor((total.amountMinor * coupon.discountValue) / 100);
    }
    // fixed — only applies if currency matches
    if (coupon.currency && coupon.currency !== total.currency) return 0;
    return Math.min(coupon.discountValue, total.amountMinor);
  }

  private toContract(c: Coupon): CouponRecord {
    return {
      id: c.id,
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      currency: c.currency,
      maxUses: c.maxUses,
      usedCount: c.usedCount,
      expiresAt: c.expiresAt?.toISOString() ?? null,
      isActive: c.isActive,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    };
  }
}
