import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { PaymentRecord, InitiatePaymentResponse, Paginated } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Payment } from "./entities/payment.entity";
import { OrdersService } from "../orders/orders.service";
import { EnvConfig } from "../../config/env";

const ZARINPAL_REQUEST_URL = "https://api.zarinpal.com/pg/v4/payment/request.json";
const ZARINPAL_VERIFY_URL  = "https://api.zarinpal.com/pg/v4/payment/verify.json";
const ZARINPAL_GATEWAY     = "https://www.zarinpal.com/pg/StartPay/";

const ZARINPAL_SANDBOX_REQUEST_URL = "https://sandbox.zarinpal.com/pg/v4/payment/request.json";
const ZARINPAL_SANDBOX_VERIFY_URL  = "https://sandbox.zarinpal.com/pg/v4/payment/verify.json";
const ZARINPAL_SANDBOX_GATEWAY     = "https://sandbox.zarinpal.com/pg/StartPay/";

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly repo: Repository<Payment>,
    private readonly ordersService: OrdersService,
    private readonly config: ConfigService<EnvConfig>,
  ) {}

  async initiate(orderId: string, userId: string): Promise<InitiatePaymentResponse> {
    const order = await this.ordersService.findOne(orderId, userId);

    if (order.status === "paid") {
      throw new BadRequestException("ORDER_ALREADY_PAID");
    }
    if (order.status === "cancelled" || order.status === "refunded") {
      throw new BadRequestException("ORDER_NOT_PAYABLE");
    }

    const merchantId = this.config.get("ZARINPAL_MERCHANT_ID", { infer: true })!;
    const isSandbox  = this.config.get("ZARINPAL_SANDBOX", { infer: true })!;
    const callbackBase = this.config.get("PAYMENT_CALLBACK_BASE_URL", { infer: true })!;

    const callbackUrl = `${callbackBase}/payments/verify`;
    const amount = order.total.amountMinor; // Must be in Rials for ZarinPal

    const requestUrl = isSandbox ? ZARINPAL_SANDBOX_REQUEST_URL : ZARINPAL_REQUEST_URL;
    const gatewayBase = isSandbox ? ZARINPAL_SANDBOX_GATEWAY : ZARINPAL_GATEWAY;

    // Create a pending payment log entry BEFORE calling ZarinPal
    const payment = this.repo.create({
      orderId,
      userId,
      amount: order.total,
      status: "pending",
      description: `Order ${orderId}`,
    });
    await this.repo.save(payment);

    let zarinpalRes: { data: { code: number; authority: string } };
    try {
      const res = await fetch(requestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          merchant_id: merchantId,
          amount,
          callback_url: callbackUrl,
          description: `Roohbakhsh Academy — order ${orderId}`,
          metadata: { order_id: orderId, payment_id: payment.id },
        }),
      });
      zarinpalRes = (await res.json()) as typeof zarinpalRes;
    } catch (err) {
      await this.repo.update(payment.id, { status: "failed", description: "ZarinPal request failed" });
      this.logger.error("ZarinPal request error", err);
      throw new InternalServerErrorException("PAYMENT_GATEWAY_ERROR");
    }

    if (zarinpalRes.data.code !== 100) {
      await this.repo.update(payment.id, {
        status: "failed",
        description: `ZarinPal error code: ${zarinpalRes.data.code}`,
      });
      throw new BadRequestException(`ZARINPAL_ERROR_${zarinpalRes.data.code}`);
    }

    const authority  = zarinpalRes.data.authority;
    const gatewayUrl = `${gatewayBase}${authority}`;

    await this.repo.update(payment.id, { authority, gatewayUrl });

    return { paymentId: payment.id, gatewayUrl };
  }

  async verify(authority: string, status: string): Promise<{ message: string; refId?: string }> {
    const payment = await this.repo.findOne({ where: { authority } });
    if (!payment) {
      this.logger.warn(`ZarinPal callback with unknown authority: ${authority}`);
      throw new NotFoundException("PAYMENT_NOT_FOUND");
    }

    if (payment.status !== "pending") {
      return { message: "ALREADY_PROCESSED", refId: payment.refId ?? undefined };
    }

    if (status !== "OK") {
      await this.repo.update(payment.id, { status: "failed" });
      await this.ordersService.updateStatus(payment.orderId, "failed");
      this.logger.log(`Payment ${payment.id} cancelled by user`);
      return { message: "PAYMENT_CANCELLED" };
    }

    const merchantId = this.config.get("ZARINPAL_MERCHANT_ID", { infer: true })!;
    const isSandbox  = this.config.get("ZARINPAL_SANDBOX", { infer: true })!;
    const verifyUrl  = isSandbox ? ZARINPAL_SANDBOX_VERIFY_URL : ZARINPAL_VERIFY_URL;

    let verifyRes: { data: { code: number; ref_id: string } };
    try {
      const res = await fetch(verifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          merchant_id: merchantId,
          amount: payment.amount.amountMinor,
          authority,
        }),
      });
      verifyRes = (await res.json()) as typeof verifyRes;
    } catch (err) {
      this.logger.error("ZarinPal verify error", err);
      throw new InternalServerErrorException("PAYMENT_GATEWAY_ERROR");
    }

    if (verifyRes.data.code === 100 || verifyRes.data.code === 101) {
      // 100 = paid, 101 = already verified (idempotent)
      const refId = String(verifyRes.data.ref_id);
      await this.repo.update(payment.id, { status: "paid", refId });
      await this.ordersService.updateStatus(payment.orderId, "paid");
      this.logger.log(`Payment ${payment.id} verified. RefID: ${refId}`);
      return { message: "PAYMENT_SUCCESS", refId };
    }

    await this.repo.update(payment.id, {
      status: "failed",
      description: `ZarinPal verify code: ${verifyRes.data.code}`,
    });
    await this.ordersService.updateStatus(payment.orderId, "failed");
    throw new BadRequestException(`ZARINPAL_VERIFY_ERROR_${verifyRes.data.code}`);
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
