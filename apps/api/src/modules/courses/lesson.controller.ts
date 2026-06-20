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
@Controller("courses/:courseSlug/lessons")
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "لیست صفحه‌بندی‌شده درس‌های یک دوره",
    description: "درس‌های یک دوره را صفحه‌بندی‌شده و به‌ترتیب `order` برمی‌گرداند. نیازی به احراز هویت نیست.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره", example: "tafsir-quran-mobtadi" })
  @ApiResponse({ status: 200, description: "لیست صفحه‌بندی‌شده درس‌ها — Paginated<Lesson>" })
  @ApiResponse({ status: 404, description: "دوره پیدا نشد — کد: COURSE_NOT_FOUND", type: ApiErrorSchema })
  findAll(@Param("courseSlug") courseSlug: string, @Query() query: PaginationDto) {
    return this.lessonService.findByCourse(courseSlug, query.page ?? 1, query.limit ?? 12);
  }

  @Public()
  @Get(":lessonId")
  @ApiOperation({
    summary: "مشخصات یک درس",
    description: "یک درس مشخص از یک دوره را برمی‌گرداند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره", example: "tafsir-quran-mobtadi" })
  @ApiParam({ name: "lessonId", description: "UUID درس" })
  @ApiResponse({ status: 200, description: "درس پیدا شد", type: LessonSchema })
  @ApiResponse({ status: 404, description: "دوره یا درس پیدا نشد — کد: COURSE_NOT_FOUND / LESSON_NOT_FOUND", type: ApiErrorSchema })
  findOne(
    @Param("courseSlug") courseSlug: string,
    @Param("lessonId") lessonId: string,
  ) {
    return this.lessonService.findOne(courseSlug, lessonId);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Post()
  @ApiOperation({
    summary: "افزودن درس به دوره 🔒 admin",
    description:
      "درس جدید به دوره اضافه می‌کند. پس از اضافه شدن، " +
      "`lessonCount` و `durationMinutes` دوره به‌صورت خودکار آپدیت می‌شوند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره", example: "tafsir-quran-mobtadi" })
  @ApiResponse({ status: 201, description: "درس ساخته شد", type: LessonSchema })
  @ApiResponse({ status: 404, description: "دوره پیدا نشد — کد: COURSE_NOT_FOUND", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "خطای اعتبارسنجی — کد: VALIDATION_ERROR", type: ApiErrorSchema })
  create(
    @Param("courseSlug") courseSlug: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.lessonService.create(courseSlug, dto);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Patch(":lessonId")
  @ApiOperation({
    summary: "ویرایش درس 🔒 admin",
    description: "فیلدهای ارسال‌شده را آپدیت می‌کند. آمار دوره خودکار sync می‌شود.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره", example: "tafsir-quran-mobtadi" })
  @ApiParam({ name: "lessonId", description: "UUID درس" })
  @ApiResponse({ status: 200, description: "درس آپدیت شد", type: LessonSchema })
  @ApiResponse({ status: 404, description: "دوره یا درس پیدا نشد", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "خطای اعتبارسنجی — کد: VALIDATION_ERROR", type: ApiErrorSchema })
  update(
    @Param("courseSlug") courseSlug: string,
    @Param("lessonId") lessonId: string,
    @Body() dto: UpdateLessonDto,
  ) {
    return this.lessonService.update(courseSlug, lessonId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":lessonId")
  @ApiOperation({
    summary: "حذف درس 🔒 admin",
    description: "درس را حذف می‌کند. `lessonCount` و `durationMinutes` دوره خودکار آپدیت می‌شوند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره", example: "tafsir-quran-mobtadi" })
  @ApiParam({ name: "lessonId", description: "UUID درس" })
  @ApiResponse({ status: 204, description: "درس حذف شد" })
  @ApiResponse({ status: 404, description: "دوره یا درس پیدا نشد", type: ApiErrorSchema })
  remove(
    @Param("courseSlug") courseSlug: string,
    @Param("lessonId") lessonId: string,
  ) {
    return this.lessonService.remove(courseSlug, lessonId);
  }
}
