import { Controller, Get, Post, Param, Query, Request, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth, ApiCookieAuth } from "@nestjs/swagger";
import { NotificationsService } from "./notifications.service";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("notifications")
@ApiCookieAuth("access_token")
@ApiBearerAuth()
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Get()
  @ApiHeader(LANG_HEADER)
  @ApiOperation({
    summary: "اعلانات من (صفحه‌بندی‌شده)",
    description: "همه‌ی اعلانات — خبر/مقاله‌ی جدید، دوره‌ی جدید، کد تخفیف جدید — جدیدترین اول.",
  })
  @ApiResponse({ status: 200, description: "Paginated<NotificationItem>" })
  findMine(@Query() query: PaginationDto, @Request() req: { user: { id: string } }) {
    return this.svc.findMinePaginated(req.user.id, query.page ?? 1, query.limit ?? 12);
  }

  @Get("unread-count")
  @ApiHeader(LANG_HEADER)
  @ApiOperation({ summary: "تعداد اعلانات خوانده‌نشده" })
  @ApiResponse({ status: 200, description: "NotificationsSummary" })
  async unreadCount(@Request() req: { user: { id: string } }) {
    return { unreadCount: await this.svc.unreadCount(req.user.id) };
  }

  @Post(":id/read")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiHeader(LANG_HEADER)
  @ApiOperation({ summary: "خوانده‌شدن یک اعلان", description: "idempotent — اگر قبلاً خوانده شده بود تغییری نمی‌کند." })
  @ApiResponse({ status: 204, description: "ثبت شد" })
  @ApiResponse({ status: 404, description: "NOTIFICATION_NOT_FOUND", type: ApiErrorSchema })
  markRead(@Param("id") id: string, @Request() req: { user: { id: string } }) {
    return this.svc.markRead(req.user.id, id);
  }

  @Post("read-all")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiHeader(LANG_HEADER)
  @ApiOperation({ summary: "خوانده‌شدن همه‌ی اعلانات" })
  @ApiResponse({ status: 204, description: "ثبت شد" })
  markAllRead(@Request() req: { user: { id: string } }) {
    return this.svc.markAllRead(req.user.id);
  }
}
