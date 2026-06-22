import { Controller, Post, Get, Body, Query, Request, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth, ApiCookieAuth, ApiQuery } from "@nestjs/swagger";
import { RecentlyViewedService } from "./recently-viewed.service";
import { RecordViewDto } from "./dto/record-view.dto";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("recently-viewed")
@ApiCookieAuth("access_token")
@ApiBearerAuth()
@Controller("recently-viewed")
export class RecentlyViewedController {
  constructor(private readonly svc: RecentlyViewedService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiHeader(LANG_HEADER)
  @ApiOperation({
    summary: "ثبت بازدید",
    description: "هنگام باز کردن صفحه‌ی یک دوره یا درس صدا زده می‌شود. idempotent — viewedAt را جلو می‌برد.",
  })
  @ApiResponse({ status: 204, description: "بازدید ثبت شد" })
  @ApiResponse({ status: 404, description: "COURSE_NOT_FOUND / LESSON_NOT_FOUND", type: ApiErrorSchema })
  record(@Body() dto: RecordViewDto, @Request() req: { user: { id: string } }) {
    return this.svc.record(req.user.id, dto);
  }

  @Get()
  @ApiHeader(LANG_HEADER)
  @ApiQuery({ name: "limit", required: false, example: 10 })
  @ApiOperation({ summary: "آخرین بازدیدهای من", description: "لیست آخرین دوره/درس‌هایی که کاربر دیده، جدیدترین اول." })
  @ApiResponse({ status: 200, description: "RecentViewItem[]" })
  findRecent(@Query("limit") limit: string | undefined, @Request() req: { user: { id: string } }) {
    return this.svc.findRecent(req.user.id, limit ? Number(limit) : 10);
  }

  @Get("paginated")
  @ApiHeader(LANG_HEADER)
  @ApiOperation({
    summary: "آخرین بازدیدها (صفحه‌بندی‌شده)",
    description: "همان لیست بازدیدها، اما صفحه‌بندی‌شده — برای صفحه‌ی کامل «بازدیدهای اخیر».",
  })
  @ApiResponse({ status: 200, description: "Paginated<RecentViewItem>" })
  findRecentPaginated(@Query() query: PaginationDto, @Request() req: { user: { id: string } }) {
    return this.svc.findRecentPaginated(req.user.id, query.page ?? 1, query.limit ?? 12);
  }
}
