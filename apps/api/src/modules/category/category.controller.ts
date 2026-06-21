import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, HttpCode, HttpStatus,
} from "@nestjs/common";
import {
  ApiTags, ApiOperation, ApiResponse,
  ApiParam, ApiHeader, ApiBearerAuth, ApiCookieAuth,
} from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Public } from "../auth/decorators/public.decorator";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { CategorySchema, CategoryTreeSchema } from "../../common/swagger/category.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("categories")
@ApiCookieAuth("access_token")
@ApiBearerAuth()
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ── Read (public) ─────────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({
    summary: "لیست همه دسته‌بندی‌ها (flat)",
    description: "همه دسته‌ها را به‌صورت آرایه‌ی مسطح برمی‌گرداند. `parentId` نشان می‌دهد هر دسته زیر کدام والد است.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({ status: 200, description: "لیست دسته‌ها", type: [CategorySchema] })
  findAll() {
    return this.categoryService.findAll();
  }

  @Public()
  @Get("tree")
  @ApiOperation({
    summary: "درخت دسته‌بندی‌ها (nested)",
    description:
      "همه دسته‌ها را به‌صورت درخت تو در تو برمی‌گرداند. " +
      "هر دسته دارای فیلد `children` است که خود آرایه‌ای از `CategoryTree` است. " +
      "عمق نامحدود پشتیبانی می‌شود.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({ status: 200, description: "درخت کامل دسته‌ها", type: [CategoryTreeSchema] })
  findTree() {
    return this.categoryService.findTree();
  }

  @Public()
  @Get(":id")
  @ApiOperation({
    summary: "یک دسته با زیردسته‌هایش",
    description: "یک دسته‌بندی را به همراه تمام زیردسته‌های تو در توی آن برمی‌گرداند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "id", description: "UUID دسته‌بندی", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @ApiResponse({ status: 200, description: "دسته با زیردسته‌ها", type: CategoryTreeSchema })
  @ApiResponse({ status: 404, description: "دسته پیدا نشد — کد: CATEGORY_NOT_FOUND", type: ApiErrorSchema })
  findOne(@Param("id") id: string) {
    return this.categoryService.findOneWithChildren(id);
  }

  // ── Write (admin only) ────────────────────────────────────────────────────

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Post()
  @ApiOperation({
    summary: "ایجاد دسته‌بندی جدید 🔒 admin",
    description:
      "دسته‌بندی جدید می‌سازد. اگر `parentId` ارسال شود زیردسته‌ی آن می‌شود، " +
      "در غیر این صورت دسته‌ی ریشه خواهد بود. عمق نامحدود پشتیبانی می‌شود.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({ status: 201, description: "دسته ساخته شد", type: CategorySchema })
  @ApiResponse({ status: 409, description: "slug تکراری — کد: SLUG_TAKEN", type: ApiErrorSchema })
  @ApiResponse({ status: 404, description: "والد پیدا نشد — کد: PARENT_CATEGORY_NOT_FOUND", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "خطای اعتبارسنجی — کد: VALIDATION_ERROR", type: ApiErrorSchema })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Patch(":id")
  @ApiOperation({
    summary: "ویرایش دسته‌بندی 🔒 admin",
    description:
      "فیلدهای ارسال‌شده را آپدیت می‌کند. برای تغییر والد از `parentId` استفاده کن. " +
      "ارسال `parentId: null` دسته را به ریشه تبدیل می‌کند. " +
      "جلوگیری از حلقه (circular reference) و تنظیم خود به عنوان والد خودش.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "id", description: "UUID دسته‌بندی" })
  @ApiResponse({ status: 200, description: "دسته آپدیت شد", type: CategorySchema })
  @ApiResponse({ status: 404, description: "دسته یا والد پیدا نشد", type: ApiErrorSchema })
  @ApiResponse({ status: 409, description: "slug تکراری — کد: SLUG_TAKEN", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "حلقه در درخت یا self-parent — کد: CIRCULAR_PARENT_REFERENCE / CANNOT_SET_SELF_AS_PARENT", type: ApiErrorSchema })
  update(@Param("id") id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  @ApiOperation({
    summary: "حذف دسته‌بندی 🔒 admin",
    description:
      "دسته‌بندی را حذف می‌کند. " +
      "اگر دسته دارای زیردسته باشد حذف انجام نمی‌شود — ابتدا زیردسته‌ها را حذف کنید.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "id", description: "UUID دسته‌بندی" })
  @ApiResponse({ status: 204, description: "دسته حذف شد" })
  @ApiResponse({ status: 404, description: "دسته پیدا نشد — کد: CATEGORY_NOT_FOUND", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "دسته دارای زیردسته است — کد: CATEGORY_HAS_CHILDREN", type: ApiErrorSchema })
  remove(@Param("id") id: string) {
    return this.categoryService.remove(id);
  }
}
