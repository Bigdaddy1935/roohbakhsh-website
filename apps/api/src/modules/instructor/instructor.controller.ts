import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, HttpCode, HttpStatus,
} from "@nestjs/common";
import {
  ApiTags, ApiOperation, ApiResponse,
  ApiParam, ApiHeader, ApiBearerAuth, ApiCookieAuth,
} from "@nestjs/swagger";
import { InstructorService } from "./instructor.service";
import { CreateInstructorDto } from "./dto/create-instructor.dto";
import { UpdateInstructorDto } from "./dto/update-instructor.dto";
import { Public } from "../auth/decorators/public.decorator";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { InstructorSchema } from "../../common/swagger/instructor.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("instructors")
@ApiCookieAuth("access_token")
@ApiBearerAuth()
@Controller("instructors")
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "لیست همه اساتید",
    description: "همه اساتید را به‌صورت آرایه برمی‌گرداند. نیازی به احراز هویت نیست.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({ status: 200, description: "لیست اساتید", type: [InstructorSchema] })
  findAll() {
    return this.instructorService.findAll();
  }

  @Public()
  @Get(":id")
  @ApiOperation({
    summary: "مشخصات یک استاد",
    description: "یک استاد را با UUID آن برمی‌گرداند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "id", description: "UUID استاد", example: "3fa85f64-5717-4562-b3fc-2c963f66afa6" })
  @ApiResponse({ status: 200, description: "استاد پیدا شد", type: InstructorSchema })
  @ApiResponse({ status: 404, description: "استاد پیدا نشد — کد: INSTRUCTOR_NOT_FOUND", type: ApiErrorSchema })
  findOne(@Param("id") id: string) {
    return this.instructorService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Post()
  @ApiOperation({
    summary: "ایجاد استاد جدید 🔒 admin",
    description: "استاد جدید می‌سازد. `slug` باید یکتا باشد.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({ status: 201, description: "استاد ساخته شد", type: InstructorSchema })
  @ApiResponse({ status: 409, description: "slug تکراری — کد: INSTRUCTOR_SLUG_TAKEN", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "خطای اعتبارسنجی — کد: VALIDATION_ERROR", type: ApiErrorSchema })
  create(@Body() dto: CreateInstructorDto) {
    return this.instructorService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @Patch(":id")
  @ApiOperation({
    summary: "ویرایش استاد 🔒 admin",
    description: "فیلدهای ارسال‌شده را آپدیت می‌کند. برای حذف bio مقدار null بفرست.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "id", description: "UUID استاد" })
  @ApiResponse({ status: 200, description: "استاد آپدیت شد", type: InstructorSchema })
  @ApiResponse({ status: 404, description: "استاد پیدا نشد — کد: INSTRUCTOR_NOT_FOUND", type: ApiErrorSchema })
  @ApiResponse({ status: 409, description: "slug تکراری — کد: INSTRUCTOR_SLUG_TAKEN", type: ApiErrorSchema })
  @ApiResponse({ status: 400, description: "خطای اعتبارسنجی — کد: VALIDATION_ERROR", type: ApiErrorSchema })
  update(@Param("id") id: string, @Body() dto: UpdateInstructorDto) {
    return this.instructorService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles("admin")
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  @ApiOperation({
    summary: "حذف استاد 🔒 admin",
    description: "استاد را حذف می‌کند. اگر دوره‌ای به این استاد وصل باشد، ابتدا آن دوره را جابجا کنید.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "id", description: "UUID استاد" })
  @ApiResponse({ status: 204, description: "استاد حذف شد" })
  @ApiResponse({ status: 404, description: "استاد پیدا نشد — کد: INSTRUCTOR_NOT_FOUND", type: ApiErrorSchema })
  remove(@Param("id") id: string) {
    return this.instructorService.remove(id);
  }
}
