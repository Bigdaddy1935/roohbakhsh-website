import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { Public } from "../auth/decorators/public.decorator";
import { Roles } from "../../common/guards/roles.guard";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("Articles")
@ApiHeader(LANG_HEADER)
@Controller("articles")
export class ArticlesController {
  constructor(private readonly svc: ArticlesService) {}

  // ────────────────────────── Public ──────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: "لیست مقالات منتشرشده", description: "فقط مقالات با status=published برمی‌گردند." })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 12 })
  @ApiResponse({ status: 200, description: "لیست صفحه‌بندی‌شده مقالات" })
  findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ) {
    return this.svc.findAll(page, limit);
  }

  @Public()
  @Get(":slug")
  @ApiOperation({ summary: "دریافت مقاله با slug", description: "فقط مقالات published. اگر draft باشد یا نباشد 404 برمی‌گردد." })
  @ApiParam({ name: "slug", description: "اسلاگ یکتای مقاله", example: "intro-to-fiqh" })
  @ApiResponse({ status: 200, description: "مقاله پیدا شد" })
  @ApiResponse({ status: 404, description: "ARTICLE_NOT_FOUND" })
  findBySlug(@Param("slug") slug: string) {
    return this.svc.findBySlug(slug);
  }

  // ────────────────────────── Admin ───────────────────────────

  @Roles("admin")
  @Get("admin/all")
  @ApiBearerAuth()
  @ApiOperation({ summary: "[Admin] لیست همه مقالات (draft + published)", description: "فقط admin دسترسی دارد." })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 12 })
  @ApiResponse({ status: 200, description: "لیست کامل مقالات" })
  @ApiResponse({ status: 403, description: "فقط admin" })
  findAllAdmin(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ) {
    return this.svc.findAllAdmin(page, limit);
  }

  @Roles("admin")
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "[Admin] ایجاد مقاله جدید" })
  @ApiResponse({ status: 201, description: "مقاله ایجاد شد" })
  @ApiResponse({ status: 409, description: "SLUG_ALREADY_EXISTS — اسلاگ تکراری است" })
  @ApiResponse({ status: 404, description: "INSTRUCTOR_NOT_FOUND" })
  @ApiResponse({ status: 403, description: "فقط admin" })
  create(@Body() dto: CreateArticleDto) {
    return this.svc.create(dto);
  }

  @Roles("admin")
  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "[Admin] ویرایش مقاله با ID" })
  @ApiParam({ name: "id", description: "UUID مقاله" })
  @ApiResponse({ status: 200, description: "مقاله ویرایش شد" })
  @ApiResponse({ status: 404, description: "ARTICLE_NOT_FOUND" })
  @ApiResponse({ status: 409, description: "SLUG_ALREADY_EXISTS" })
  update(@Param("id") id: string, @Body() dto: UpdateArticleDto) {
    return this.svc.update(id, dto);
  }

  @Roles("admin")
  @Delete(":id")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "[Admin] حذف مقاله با ID" })
  @ApiParam({ name: "id", description: "UUID مقاله" })
  @ApiResponse({ status: 204, description: "مقاله حذف شد" })
  @ApiResponse({ status: 404, description: "ARTICLE_NOT_FOUND" })
  remove(@Param("id") id: string) {
    return this.svc.remove(id);
  }
}
