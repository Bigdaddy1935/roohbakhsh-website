import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, HttpCode, HttpStatus,
} from "@nestjs/common";
import {
  ApiTags, ApiOperation, ApiResponse,
  ApiParam, ApiHeader, ApiBearerAuth, ApiCookieAuth,
} from "@nestjs/swagger";
import { SectionService } from "./section.service";
import { CreateSectionDto } from "./dto/create-section.dto";
import { UpdateSectionDto } from "./dto/update-section.dto";
import { Public } from "../auth/decorators/public.decorator";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("sections")
@ApiCookieAuth("access_token")
@ApiBearerAuth()
@Controller("courses/:courseSlug/sections")
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "سرفصل‌های یک دوره (با درس‌هایشان)",
    description:
      "تمام سرفصل‌های دوره را به‌ترتیب `order` برمی‌گرداند. " +
      "هر سرفصل شامل لیست درس‌هایش است. نیازی به احراز هویت نیست.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره", example: "tafsir-quran-mobtadi" })
  @ApiResponse({ status: 200, description: "لیست سرفصل‌ها — SectionRecord[]" })
  @ApiResponse({ status: 404, description: "دوره پیدا نشد — کد: COURSE_NOT_FOUND", type: ApiErrorSchema })
  findAll(@Param("courseSlug") courseSlug: string) {
    return this.sectionService.findByCourse(courseSlug);
  }

  @Public()
  @Get(":sectionId")
  @ApiOperation({
    summary: "مشخصات یک سرفصل",
    description: "یک سرفصل را با تمام درس‌هایش برمی‌گرداند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره" })
  @ApiParam({ name: "sectionId", description: "UUID سرفصل" })
  @ApiResponse({ status: 200, description: "سرفصل پیدا شد — SectionRecord" })
  @ApiResponse({ status: 404, description: "دوره یا سرفصل پیدا نشد — کد: COURSE_NOT_FOUND / SECTION_NOT_FOUND", type: ApiErrorSchema })
  findOne(
    @Param("courseSlug") courseSlug: string,
    @Param("sectionId") sectionId: string,
  ) {
    return this.sectionService.findOne(courseSlug, sectionId);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Post()
  @ApiOperation({
    summary: "ایجاد سرفصل جدید 🔒 admin",
    description: "سرفصل جدید به دوره اضافه می‌کند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره" })
  @ApiResponse({ status: 201, description: "سرفصل ساخته شد — SectionRecord" })
  @ApiResponse({ status: 404, description: "دوره پیدا نشد — کد: COURSE_NOT_FOUND", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "خطای اعتبارسنجی — کد: VALIDATION_ERROR", type: ApiErrorSchema })
  create(
    @Param("courseSlug") courseSlug: string,
    @Body() dto: CreateSectionDto,
  ) {
    return this.sectionService.create(courseSlug, dto);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Patch(":sectionId")
  @ApiOperation({
    summary: "ویرایش سرفصل 🔒 admin",
    description: "عنوان یا ترتیب سرفصل را آپدیت می‌کند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره" })
  @ApiParam({ name: "sectionId", description: "UUID سرفصل" })
  @ApiResponse({ status: 200, description: "سرفصل آپدیت شد — SectionRecord" })
  @ApiResponse({ status: 404, description: "دوره یا سرفصل پیدا نشد", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "خطای اعتبارسنجی — کد: VALIDATION_ERROR", type: ApiErrorSchema })
  update(
    @Param("courseSlug") courseSlug: string,
    @Param("sectionId") sectionId: string,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.sectionService.update(courseSlug, sectionId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":sectionId")
  @ApiOperation({
    summary: "حذف سرفصل 🔒 admin",
    description: "سرفصل و تمام درس‌های آن را حذف می‌کند (cascade).",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره" })
  @ApiParam({ name: "sectionId", description: "UUID سرفصل" })
  @ApiResponse({ status: 204, description: "سرفصل حذف شد" })
  @ApiResponse({ status: 404, description: "دوره یا سرفصل پیدا نشد", type: ApiErrorSchema })
  remove(
    @Param("courseSlug") courseSlug: string,
    @Param("sectionId") sectionId: string,
  ) {
    return this.sectionService.remove(courseSlug, sectionId);
  }
}
