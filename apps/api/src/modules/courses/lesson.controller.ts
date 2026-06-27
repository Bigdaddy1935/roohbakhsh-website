import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, HttpCode, HttpStatus,
} from "@nestjs/common";
import {
  ApiTags, ApiOperation, ApiResponse,
  ApiParam, ApiHeader, ApiBearerAuth, ApiCookieAuth,
} from "@nestjs/swagger";
import { LessonService } from "./lesson.service";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { Public } from "../auth/decorators/public.decorator";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LessonSchema } from "../../common/swagger/course.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";
import { PaginationDto } from "../../common/dto/pagination.dto";

@ApiTags("lessons")
@ApiCookieAuth("access_token")
@ApiBearerAuth()
@Controller("courses/:courseSlug/sections/:sectionId/lessons")
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "درس‌های یک سرفصل",
    description: "درس‌های یک سرفصل را صفحه‌بندی‌شده و به‌ترتیب `order` برمی‌گرداند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره", example: "tafsir-quran-mobtadi" })
  @ApiParam({ name: "sectionId", description: "UUID سرفصل" })
  @ApiResponse({ status: 200, description: "لیست صفحه‌بندی‌شده درس‌ها — Paginated<Lesson>" })
  @ApiResponse({ status: 404, description: "دوره یا سرفصل پیدا نشد — کد: COURSE_NOT_FOUND / SECTION_NOT_FOUND", type: ApiErrorSchema })
  findAll(
    @Param("courseSlug") courseSlug: string,
    @Param("sectionId") sectionId: string,
    @Query() query: PaginationDto,
  ) {
    return this.lessonService.findBySection(courseSlug, sectionId, query.page ?? 1, query.limit ?? 50);
  }

  @Public()
  @Get(":lessonId")
  @ApiOperation({
    summary: "مشخصات یک درس",
    description: "یک درس مشخص از یک سرفصل را برمی‌گرداند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره" })
  @ApiParam({ name: "sectionId", description: "UUID سرفصل" })
  @ApiParam({ name: "lessonId", description: "UUID درس" })
  @ApiResponse({ status: 200, description: "درس پیدا شد", type: LessonSchema })
  @ApiResponse({ status: 404, description: "دوره / سرفصل / درس پیدا نشد", type: ApiErrorSchema })
  findOne(
    @Param("courseSlug") courseSlug: string,
    @Param("sectionId") sectionId: string,
    @Param("lessonId") lessonId: string,
  ) {
    return this.lessonService.findOne(courseSlug, sectionId, lessonId);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Post()
  @ApiOperation({
    summary: "افزودن درس به سرفصل 🔒 admin",
    description:
      "درس جدید به سرفصل اضافه می‌کند. " +
      "`lessonCount` و `durationMinutes` دوره مستقیماً از روی درس‌های موجود محاسبه می‌شوند (ستون مجزا ندارند).",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره" })
  @ApiParam({ name: "sectionId", description: "UUID سرفصل" })
  @ApiResponse({ status: 201, description: "درس ساخته شد", type: LessonSchema })
  @ApiResponse({ status: 404, description: "دوره یا سرفصل پیدا نشد", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "خطای اعتبارسنجی — کد: VALIDATION_ERROR", type: ApiErrorSchema })
  create(
    @Param("courseSlug") courseSlug: string,
    @Param("sectionId") sectionId: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.lessonService.create(courseSlug, sectionId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Patch(":lessonId")
  @ApiOperation({
    summary: "ویرایش درس 🔒 admin",
    description: "فیلدهای ارسال‌شده را آپدیت می‌کند. آمار دوره خودکار sync می‌شود.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره" })
  @ApiParam({ name: "sectionId", description: "UUID سرفصل" })
  @ApiParam({ name: "lessonId", description: "UUID درس" })
  @ApiResponse({ status: 200, description: "درس آپدیت شد", type: LessonSchema })
  @ApiResponse({ status: 404, description: "دوره / سرفصل / درس پیدا نشد", type: ApiErrorSchema })
  update(
    @Param("courseSlug") courseSlug: string,
    @Param("sectionId") sectionId: string,
    @Param("lessonId") lessonId: string,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.lessonService.update(courseSlug, sectionId, lessonId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":lessonId")
  @ApiOperation({
    summary: "حذف درس 🔒 admin",
    description: "درس را حذف می‌کند. `lessonCount` و `durationMinutes` دوره بلافاصله از روی درس‌های باقی‌مانده محاسبه می‌شوند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره" })
  @ApiParam({ name: "sectionId", description: "UUID سرفصل" })
  @ApiParam({ name: "lessonId", description: "UUID درس" })
  @ApiResponse({ status: 204, description: "درس حذف شد" })
  @ApiResponse({ status: 404, description: "دوره / سرفصل / درس پیدا نشد", type: ApiErrorSchema })
  remove(
    @Param("courseSlug") courseSlug: string,
    @Param("sectionId") sectionId: string,
    @Param("lessonId") lessonId: string,
  ) {
    return this.lessonService.remove(courseSlug, sectionId, lessonId);
  }
}
