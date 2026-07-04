import { Controller, Get, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader, ApiQuery } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles("admin")
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("stats")
  @ApiOperation({
    summary: "آمار کلی سیستم 🔒 admin",
    description: "تعداد کاربران، دوره‌ها، مقالات، سفارش‌ها، تیکت‌های باز و نظرات در انتظار تأیید.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({ status: 200, description: "AdminStats" })
  @ApiResponse({ status: 401, description: "احراز هویت نشده", type: ApiErrorSchema })
  @ApiResponse({ status: 403, description: "دسترسی ندارید", type: ApiErrorSchema })
  getStats() {
    return this.adminService.getStats();
  }

  @Get("stats/monthly")
  @ApiOperation({
    summary: "آمار ماهانه‌ی یک سال میلادی 🔒 admin",
    description:
      "تعداد سفارش‌های paid، کاربران ثبت‌نام‌شده، جمع درآمد به‌تفکیک ارز، و تعداد نظرات (چه تأییدشده چه نشده) — برای هر ماه از سال درخواستی. برای نمودار داشبورد.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiQuery({ name: "year", required: false, type: Number, example: 2026, description: "پیش‌فرض سال جاری میلادی" })
  @ApiResponse({ status: 200, description: "AdminMonthlyStats" })
  @ApiResponse({ status: 401, description: "احراز هویت نشده", type: ApiErrorSchema })
  @ApiResponse({ status: 403, description: "دسترسی ندارید", type: ApiErrorSchema })
  getMonthlyStats(
    @Query("year", new DefaultValuePipe(new Date().getUTCFullYear()), ParseIntPipe) year: number,
  ) {
    return this.adminService.getMonthlyStats(year);
  }
}
