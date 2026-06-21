import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags, ApiOperation, ApiResponse,
  ApiHeader, ApiBearerAuth, ApiCookieAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";
import { PaginationDto } from "../../common/dto/pagination.dto";

@ApiTags("users")
@ApiCookieAuth("access_token")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Get()
  @ApiOperation({
    summary: "لیست صفحه‌بندی‌شده کاربران 🔒 admin",
    description:
      "همه کاربران سیستم را صفحه‌بندی‌شده برمی‌گرداند. " +
      "فقط برای `role: admin` در دسترس است. " +
      "مرتب‌سازی بر اساس تاریخ ثبت‌نام (جدیدترین اول).",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({ status: 200, description: "لیست صفحه‌بندی‌شده کاربران — Paginated<User>" })
  @ApiResponse({ status: 401, description: "احراز هویت نشده — کد: Unauthorized", type: ApiErrorSchema })
  @ApiResponse({ status: 403, description: "دسترسی ندارید — کد: FORBIDDEN", type: ApiErrorSchema })
  findAll(@Query() query: PaginationDto) {
    return this.usersService.findAll(query.page ?? 1, query.limit ?? 12);
  }
}
