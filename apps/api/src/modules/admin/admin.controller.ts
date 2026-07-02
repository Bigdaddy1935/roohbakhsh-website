import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from "@nestjs/swagger";
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
}
