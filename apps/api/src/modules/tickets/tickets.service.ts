import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { Ticket as TicketContract, Paginated } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Ticket } from "./entities/ticket.entity";
import { TicketMessage } from "./entities/ticket-message.entity";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { ReplyTicketDto } from "./dto/reply-ticket.dto";

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly repo: Repository<Ticket>,
    @InjectRepository(TicketMessage)
    private readonly messageRepo: Repository<TicketMessage>,
  ) {}

  async create(dto: CreateTicketDto, userId: string | null): Promise<TicketContract> {
    if (!userId && !dto.guestEmail) {
      throw new BadRequestException("GUEST_EMAIL_REQUIRED");
    }

    const ticket = this.repo.create({
      userId,
      guestEmail: userId ? null : dto.guestEmail ?? null,
      subject: dto.subject,
      status: "open",
      messages: [
        this.messageRepo.create({ body: dto.body, authorType: "user" }),
      ],
    });
    const saved = await this.repo.save(ticket);
    return this.toContract(await this.withMessages(saved.id));
  }

  async findMine(userId: string, page: number, limit: number): Promise<Paginated<TicketContract>> {
    const [items, total] = await this.repo.findAndCount({
      where: { userId },
      relations: { messages: true },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((t) => this.toContract(t)), total, page, limit);
  }

  async findAllAdmin(page: number, limit: number): Promise<Paginated<TicketContract>> {
    const [items, total] = await this.repo.findAndCount({
      relations: { messages: true },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((t) => this.toContract(t)), total, page, limit);
  }

  async findOne(id: string, userId: string | null, isAdmin: boolean): Promise<TicketContract> {
    const ticket = await this.withMessages(id);
    this.assertCanAccess(ticket, userId, isAdmin);
    return this.toContract(ticket);
  }

  async reply(id: string, dto: ReplyTicketDto, userId: string | null, isAdmin: boolean): Promise<TicketContract> {
    const ticket = await this.withMessages(id);
    this.assertCanAccess(ticket, userId, isAdmin);
    if (ticket.status === "closed") throw new BadRequestException("TICKET_CLOSED");

    await this.messageRepo.save(
      this.messageRepo.create({
        ticketId: ticket.id,
        body: dto.body,
        authorType: isAdmin ? "support" : "user",
      }),
    );
    await this.repo.update(ticket.id, { status: isAdmin ? "answered" : "open" });

    return this.toContract(await this.withMessages(id));
  }

  async close(id: string, userId: string | null, isAdmin: boolean): Promise<TicketContract> {
    const ticket = await this.withMessages(id);
    this.assertCanAccess(ticket, userId, isAdmin);
    await this.repo.update(ticket.id, { status: "closed" });
    return this.toContract(await this.withMessages(id));
  }

  /** تعداد کل تیکت‌های کاربر — برای داشبورد پروفایل. */
  async countMine(userId: string): Promise<number> {
    return this.repo.count({ where: { userId } });
  }

  /** آخرین N تیکت کاربر — برای داشبورد پروفایل. */
  async recentForUser(userId: string, limit: number): Promise<TicketContract[]> {
    const items = await this.repo.find({
      where: { userId },
      relations: { messages: true },
      order: { createdAt: "DESC" },
      take: limit,
    });
    return items.map((t) => this.toContract(t));
  }

  private assertCanAccess(ticket: Ticket, userId: string | null, isAdmin: boolean): void {
    if (isAdmin) return;
    if (!userId || ticket.userId !== userId) throw new ForbiddenException("NOT_TICKET_OWNER");
  }

  private async withMessages(id: string): Promise<Ticket> {
    const ticket = await this.repo.findOne({
      where: { id },
      relations: { messages: true },
      order: { messages: { createdAt: "ASC" } },
    });
    if (!ticket) throw new NotFoundException("TICKET_NOT_FOUND");
    return ticket;
  }

  private toContract(t: Ticket): TicketContract {
    return {
      id: t.id,
      userId: t.userId,
      guestEmail: t.guestEmail,
      subject: t.subject,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
      messages: (t.messages ?? [])
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((m) => ({
          id: m.id,
          body: m.body,
          authorType: m.authorType,
          createdAt: m.createdAt.toISOString(),
        })),
    };
  }
}
