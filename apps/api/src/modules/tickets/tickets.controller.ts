import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiHeader,
  ApiBearerAuth,
  ApiCookieAuth,
} from "@nestjs/swagger";
import { TicketsService } from "./tickets.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { ReplyTicketDto } from "./dto/reply-ticket.dto";
import { Public } from "../auth/decorators/public.decorator";
import { OptionalJwtAuthGuard } from "../auth/guards/optional-jwt-auth.guard";
import { Roles } from "../../common/guards/roles.guard";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";
import { PaginationDto } from "../../common/dto/pagination.dto";

interface AuthedRequest {
  user?: { id: string; role: string };
}

@ApiTags("tickets")
@ApiCookieAuth("access_token")
@ApiBearerAuth()
@Controller("tickets")
export class TicketsController {
  constructor(private readonly svc: TicketsService) {}

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  @ApiHeader(LANG_HEADER)
  @ApiOperation({
    summary: "ثبت تیکت جدید",
    description: "کاربر لاگین‌شده یا مهمان (با guestEmail) می‌تواند تیکت بزند.",
  })
  @ApiResponse({ status: 201, description: "تیکت ثبت شد" })
  @ApiResponse({ status: 400, description: "GUEST_EMAIL_REQUIRED", type: ApiErrorSchema })
  create(@Body() dto: CreateTicketDto, @Request() req: AuthedRequest) {
    return this.svc.create(dto, req.user?.id ?? null);
  }

  @Get("mine")
  @ApiHeader(LANG_HEADER)
  @ApiOperation({ summary: "تیکت‌های من", description: "لیست صفحه‌بندی‌شده‌ی تیکت‌های کاربر لاگین‌شده." })
  @ApiResponse({ status: 200, description: "لیست صفحه‌بندی‌شده‌ی Ticket" })
  findMine(@Query() query: PaginationDto, @Request() req: AuthedRequest) {
    return this.svc.findMine(req.user!.id, query.page ?? 1, query.limit ?? 12);
  }

  @Roles("admin")
  @Get()
  @ApiHeader(LANG_HEADER)
  @ApiOperation({ summary: "[Admin] لیست همه تیکت‌ها" })
  @ApiResponse({ status: 200, description: "لیست صفحه‌بندی‌شده‌ی Ticket" })
  @ApiResponse({ status: 403, description: "فقط admin", type: ApiErrorSchema })
  findAllAdmin(@Query() query: PaginationDto) {
    return this.svc.findAllAdmin(query.page ?? 1, query.limit ?? 12);
  }

  @Get(":id")
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "id", description: "UUID تیکت" })
  @ApiOperation({ summary: "جزئیات یک تیکت", description: "صاحب تیکت یا admin می‌تواند ببیند." })
  @ApiResponse({ status: 200, description: "Ticket با تمام پیام‌ها" })
  @ApiResponse({ status: 403, description: "NOT_TICKET_OWNER", type: ApiErrorSchema })
  @ApiResponse({ status: 404, description: "TICKET_NOT_FOUND", type: ApiErrorSchema })
  findOne(@Param("id") id: string, @Request() req: AuthedRequest) {
    return this.svc.findOne(id, req.user?.id ?? null, req.user?.role === "admin");
  }

  @Post(":id/reply")
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "id", description: "UUID تیکت" })
  @ApiOperation({
    summary: "پاسخ به تیکت",
    description: "صاحب تیکت یا admin می‌تواند پاسخ بدهد. پاسخ admin وضعیت را به answered تغییر می‌دهد.",
  })
  @ApiResponse({ status: 201, description: "پاسخ ثبت شد" })
  @ApiResponse({ status: 400, description: "TICKET_CLOSED", type: ApiErrorSchema })
  @ApiResponse({ status: 403, description: "NOT_TICKET_OWNER", type: ApiErrorSchema })
  @ApiResponse({ status: 404, description: "TICKET_NOT_FOUND", type: ApiErrorSchema })
  reply(@Param("id") id: string, @Body() dto: ReplyTicketDto, @Request() req: AuthedRequest) {
    return this.svc.reply(id, dto, req.user?.id ?? null, req.user?.role === "admin");
  }

  @Post(":id/close")
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "id", description: "UUID تیکت" })
  @ApiOperation({ summary: "بستن تیکت", description: "صاحب تیکت یا admin می‌تواند تیکت را ببندد." })
  @ApiResponse({ status: 201, description: "تیکت بسته شد" })
  @ApiResponse({ status: 403, description: "NOT_TICKET_OWNER", type: ApiErrorSchema })
  @ApiResponse({ status: 404, description: "TICKET_NOT_FOUND", type: ApiErrorSchema })
  close(@Param("id") id: string, @Request() req: AuthedRequest) {
    return this.svc.close(id, req.user?.id ?? null, req.user?.role === "admin");
  }
}
