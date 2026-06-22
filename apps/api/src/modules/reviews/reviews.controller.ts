import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiHeader,
  ApiBearerAuth,
  ApiCookieAuth,
} from "@nestjs/swagger";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { Public } from "../auth/decorators/public.decorator";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("reviews")
@ApiCookieAuth("access_token")
@ApiBearerAuth()
@Controller("courses/:courseSlug/reviews")
export class ReviewsController {
  constructor(private readonly svc: ReviewsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "نظرات یک دوره",
    description: "لیست صفحه‌بندی‌شده‌ی نظرات و امتیازهای ثبت‌شده روی دوره — نیازی به احراز هویت نیست.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره", example: "intro-to-fiqh-course" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 12 })
  @ApiResponse({ status: 200, description: "لیست صفحه‌بندی‌شده‌ی ReviewRecord" })
  @ApiResponse({ status: 404, description: "COURSE_NOT_FOUND", type: ApiErrorSchema })
  findAll(
    @Param("courseSlug") courseSlug: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ) {
    return this.svc.findByCourse(courseSlug, page, limit);
  }

  @Post()
  @ApiOperation({
    summary: "ثبت نظر و امتیاز روی دوره",
    description: "هر کاربر فقط یک‌بار می‌تواند روی هر دوره نظر بدهد. برای ویرایش از PATCH استفاده کنید.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره", example: "intro-to-fiqh-course" })
  @ApiResponse({ status: 201, description: "نظر ثبت شد" })
  @ApiResponse({ status: 404, description: "COURSE_NOT_FOUND", type: ApiErrorSchema })
  @ApiResponse({ status: 409, description: "REVIEW_ALREADY_EXISTS — این کاربر قبلاً نظر داده", type: ApiErrorSchema })
  create(
    @Param("courseSlug") courseSlug: string,
    @Body() dto: CreateReviewDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.svc.create(courseSlug, req.user.id, dto);
  }

  @Patch(":reviewId")
  @ApiOperation({ summary: "ویرایش نظر خودم", description: "فقط صاحب نظر می‌تواند آن را ویرایش کند." })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره" })
  @ApiParam({ name: "reviewId", description: "UUID نظر" })
  @ApiResponse({ status: 200, description: "نظر ویرایش شد" })
  @ApiResponse({ status: 403, description: "NOT_REVIEW_OWNER", type: ApiErrorSchema })
  @ApiResponse({ status: 404, description: "REVIEW_NOT_FOUND یا COURSE_NOT_FOUND", type: ApiErrorSchema })
  update(
    @Param("courseSlug") courseSlug: string,
    @Param("reviewId") reviewId: string,
    @Body() dto: UpdateReviewDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.svc.update(courseSlug, reviewId, req.user.id, dto);
  }

  @Delete(":reviewId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "حذف نظر",
    description: "صاحب نظر یا admin می‌تواند نظر را حذف کند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره" })
  @ApiParam({ name: "reviewId", description: "UUID نظر" })
  @ApiResponse({ status: 204, description: "نظر حذف شد" })
  @ApiResponse({ status: 403, description: "NOT_REVIEW_OWNER", type: ApiErrorSchema })
  @ApiResponse({ status: 404, description: "REVIEW_NOT_FOUND یا COURSE_NOT_FOUND", type: ApiErrorSchema })
  remove(
    @Param("courseSlug") courseSlug: string,
    @Param("reviewId") reviewId: string,
    @Request() req: { user: { id: string; role: string } },
  ) {
    return this.svc.remove(courseSlug, reviewId, req.user.id, req.user.role === "admin");
  }
}
