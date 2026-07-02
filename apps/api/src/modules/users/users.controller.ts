import { Controller, Get, Patch, Post, Query, Param, Body, Request, UseGuards } from "@nestjs/common";
import {
  ApiTags, ApiOperation, ApiResponse,
  ApiHeader, ApiBearerAuth, ApiCookieAuth, ApiParam,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Public } from "../auth/decorators/public.decorator";

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

  @Public()
  @Post("bootstrap-admin")
  @ApiOperation({
    summary: "ساخت اولین ادمین — فقط یک‌بار",
    description:
      "اگر هیچ ادمینی در سیستم وجود نداشته باشد، role کاربر با id داده‌شده را به admin تغییر می‌دهد. " +
      "به محض اینکه یک ادمین وجود داشته باشد، این endpoint برای همیشه 403 برمی‌گرداند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({ status: 201, description: "کاربر به ادمین تبدیل شد — User" })
  @ApiResponse({ status: 403, description: "ادمین از قبل وجود دارد — کد: ADMIN_ALREADY_EXISTS", type: ApiErrorSchema })
  @ApiResponse({ status: 404, description: "کاربر یافت نشد — کد: USER_NOT_FOUND", type: ApiErrorSchema })
  bootstrapAdmin(@Body() body: { id: string }) {
    return this.usersService.bootstrapAdmin(body.id);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Patch(":id/role")
  @ApiOperation({
    summary: "تغییر role کاربر 🔒 admin",
    description: "role یک کاربر را به user / instructor / admin تغییر می‌دهد.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "id", description: "UUID کاربر" })
  @ApiResponse({ status: 200, description: "role به‌روز شد — User" })
  @ApiResponse({ status: 403, description: "دسترسی ندارید", type: ApiErrorSchema })
  @ApiResponse({ status: 404, description: "کاربر یافت نشد — کد: USER_NOT_FOUND", type: ApiErrorSchema })
  updateRole(@Param("id") id: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.updateRole(id, dto.role);
  }

  @Get("me/dashboard")
  @ApiOperation({
    summary: "داشبورد پروفایل من",
    description:
      "آماری که در صفحه‌ی داشبورد کاربر نمایش داده می‌شود: مجموع پرداختی، تعداد دوره‌های خریداری‌شده، " +
      "تعداد تیکت‌ها و آخرین ۳ تیکت، آخرین بازدیدها (دوره/درس)، علاقه‌مندی‌ها (دوره/مقاله)، " +
      "درصد پیشرفت دوره‌هایی که خریده، و تعداد/آخرین اعلانات (خبر/دوره/کد تخفیف جدید).",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({ status: 200, description: "UserDashboard" })
  @ApiResponse({ status: 401, description: "احراز هویت نشده", type: ApiErrorSchema })
  dashboard(@Request() req: { user: { id: string } }) {
    return this.usersService.dashboard(req.user.id);
  }
}
