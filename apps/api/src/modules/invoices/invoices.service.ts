import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { InvoiceRecord, Paginated } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Invoice } from "./entities/invoice.entity";
import { Order } from "../orders/entities/order.entity";

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly repo: Repository<Invoice>,
  ) {}

  /** Called by PaymentsService after successful verify */
  async createFromOrder(order: Order, paymentRefId: string | null): Promise<Invoice> {
    const date = new Date();
    const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
    const count = await this.repo.count();
    const seq = String(count + 1).padStart(4, "0");
    const invoiceNumber = `INV-${datePart}-${seq}`;

    const invoice = this.repo.create({
      invoiceNumber,
      orderId: order.id,
      userId: order.userId,
      items: order.items.map((i) => ({
        courseId: i.courseId,
        titleSnapshot: i.titleSnapshot,
        priceSnapshot: i.priceSnapshot,
      })),
      subtotal: order.subtotal,
      discountAmount: order.discountAmount,
      total: order.total,
      couponCode: order.couponCode,
      paymentRefId,
    });

    return this.repo.save(invoice);
  }

  async findMine(userId: string, page: number, limit: number): Promise<Paginated<InvoiceRecord>> {
    const [items, total] = await this.repo.findAndCount({
      where: { userId },
      order: { issuedAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((i) => this.toContract(i)), total, page, limit);
  }

  async findOneByNumber(invoiceNumber: string, userId: string): Promise<InvoiceRecord> {
    const invoice = await this.repo.findOne({ where: { invoiceNumber } });
    if (!invoice) throw new NotFoundException("INVOICE_NOT_FOUND");
    if (invoice.userId !== userId) throw new NotFoundException("INVOICE_NOT_FOUND");
    return this.toContract(invoice);
  }

  private toContract(i: Invoice): InvoiceRecord {
    return {
      id: i.id,
      invoiceNumber: i.invoiceNumber,
      orderId: i.orderId,
      userId: i.userId,
      items: i.items,
      subtotal: i.subtotal,
      discountAmount: i.discountAmount,
      total: i.total,
      couponCode: i.couponCode,
      paymentRefId: i.paymentRefId,
      issuedAt: i.issuedAt.toISOString(),
    };
  }
}
