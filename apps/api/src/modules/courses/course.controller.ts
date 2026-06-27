import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, HttpCode, HttpStatus,
} from "@nestjs/common";
import {
  ApiTags, ApiOperation, ApiResponse,
  ApiParam, ApiQuery, ApiHeader, ApiBearerAuth, ApiCookieAuth,
} from "@nestjs/swagger";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { Public } from "../auth/decorators/public.decorator";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { CourseSchema } from "../../common/swagger/course.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";
import { PaginationDto } from "../../common/dto/pagination.dto";

@ApiTags("courses")
@ApiCookieAuth("access_token")
@ApiBearerAuth()
@Controller("courses")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "لیست صفحه‌بندی‌شده دوره‌ها / سرچ بر اساس عنوان",
    description:
      "دوره‌ها را صفحه‌بندی‌شده برمی‌گرداند. " +
      "هر دوره شامل اطلاعات خلاصه استاد است. نیازی به احراز هویت نیست. " +
      "با پارامتر `q` می‌توان بر اساس عنوان دوره (عربی یا اردو) سرچ کرد — حداقل ۳ کاراکتر لازم است.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiQuery({ name: "q", required: false, type: String, description: "متن سرچ روی عنوان دوره — حداقل ۳ کاراکتر", example: "تفسیر" })
  @ApiResponse({ status: 200, description: "لیست صفحه‌بندی‌شده دوره‌ها — Paginated<CourseRecord>" })
  @ApiResponse({ status: 400, description: "طول q کمتر از ۳ کاراکتر — کد: SEARCH_QUERY_TOO_SHORT", type: ApiErrorSchema })
  findAll(@Query() query: PaginationDto, @Query("q") q?: string) {
    return this.courseService.findAll(query.page ?? 1, query.limit ?? 12, q);
  }

  @Public()
  @Get(":slug")
  @ApiOperation({
    summary: "مشخصات یک دوره",
    description: "یک دوره را با slug آن برمی‌گرداند. شامل اطلاعات استاد.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "slug", description: "slug دوره", example: "tafsir-quran-mobtadi" })
  @ApiResponse({ status: 200, description: "دوره پیدا شد", type: CourseSchema })
  @ApiResponse({ status: 404, description: "دوره پیدا نشد — کد: COURSE_NOT_FOUND", type: ApiErrorSchema })
  findOne(@Param("slug") slug: string) {
    return this.courseService.findOne(slug);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Post()
  @ApiOperation({
    summary: "ایجاد دوره جدید 🔒 admin",
    description:
      "دوره جدید می‌سازد. `instructorId` باید UUID یک استاد موجود باشد. " +
      "`slug` باید یکتا باشد. دوره در حالت پنهان (`isPublished: false`) ایجاد می‌شود.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({ status: 201, description: "دوره ساخته شد", type: CourseSchema })
  @ApiResponse({ status: 409, description: "slug تکراری — کد: COURSE_SLUG_TAKEN", type: ApiErrorSchema })
  @ApiResponse({ status: 404, description: "استاد یا دسته‌بندی پیدا نشد — کد: INSTRUCTOR_NOT_FOUND / CATEGORY_NOT_FOUND", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "خطای اعتبارسنجی — کد: VALIDATION_ERROR", type: ApiErrorSchema })
  create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Patch(":id")
  @ApiOperation({
    summary: "ویرایش دوره 🔒 admin",
    description:
      "فیلدهای ارسال‌شده را آپدیت می‌کند. " +
      "برای انتشار دوره `isPublished: true` بفرست. " +
      "برای حذف thumbnail مقدار null بفرست.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "id", description: "UUID دوره" })
  @ApiResponse({ status: 200, description: "دوره آپدیت شد", type: CourseSchema })
  @ApiResponse({ status: 404, description: "دوره / استاد / دسته‌بندی پیدا نشد", type: ApiErrorSchema })
  @ApiResponse({ status: 409, description: "slug تکراری — کد: COURSE_SLUG_TAKEN", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "خطای اعتبارسنجی — کد: VALIDATION_ERROR", type: ApiErrorSchema })
  update(@Param("id") id: string, @Body() dto: UpdateCourseDto) {
    return this.courseService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  @ApiOperation({
    summary: "حذف دوره 🔒 admin",
    description: "دوره و تمام درس‌های آن را حذف می‌کند (cascade delete).",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "id", description: "UUID دوره" })
  @ApiResponse({ status: 204, description: "دوره حذف شد" })
  @ApiResponse({ status: 404, description: "دوره پیدا نشد — کد: COURSE_NOT_FOUND", type: ApiErrorSchema })
  remove(@Param("id") id: string) {
    return this.courseService.remove(id);
  }
}
