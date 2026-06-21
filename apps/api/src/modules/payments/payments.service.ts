import {
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { PaymentRecord, InitiatePaymentResponse, Paginated } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Payment } from "./entities/payment.entity";

// ──────────────────────────────────────────────────────────────
// درگاه پرداخت فعلاً غیرفعال است.
// ZarinPal حذف شد چون درگاه ایرانی (ریال) است و آکادمی بین‌المللی به
// درگاه پرداخت ارزی نیاز دارد. تا انتخاب و پیاده‌سازی درگاه ارزی
// (مثل Stripe/PayPal)، پرداخت خنثی است و خطای روشن برمی‌گرداند.
//
// نقطه‌ی اتصال درگاه جدید = همین دو متد initiate و verify.
// تاریخچه‌ی پرداخت (findLogs/findMyPayments) دست‌نخورده کار می‌کند.
// ──────────────────────────────────────────────────────────────

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
  ) {}

  async initiate(_orderId: string, _userId: string): Promise<InitiatePaymentResponse> {
    // TODO: اتصال به درگاه پرداخت ارزی (Stripe/PayPal/...). فعلاً غیرفعال.
    throw new ServiceUnavailableException("PAYMENT_GATEWAY_NOT_CONFIGURED");
  }

  async verify(_authority: string, _status: string): Promise<{ message: string; refId?: string }> {
    // TODO: تأیید پرداخت با درگاه ارزی پس از بازگشت کاربر. فعلاً غیرفعال.
    throw new ServiceUnavailableException("PAYMENT_GATEWAY_NOT_CONFIGURED");
  }

  async findLogs(page: number, limit: number): Promise<Paginated<PaymentRecord>> {
    const [items, total] = await this.repo.findAndCount({
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((p) => this.toContract(p)), total, page, limit);
  }

  async findMyPayments(userId: string, page: number, limit: number): Promise<Paginated<PaymentRecord>> {
    const [items, total] = await this.repo.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((p) => this.toContract(p)), total, page, limit);
  }

  private toContract(p: Payment): PaymentRecord {
    return {
      id: p.id,
      orderId: p.orderId,
      userId: p.userId,
      amount: p.amount,
      status: p.status,
      authority: p.authority,
      refId: p.refId,
      gatewayUrl: p.gatewayUrl,
      description: p.description,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }
}
