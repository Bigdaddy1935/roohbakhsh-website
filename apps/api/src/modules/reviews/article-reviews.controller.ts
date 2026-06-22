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
@Controller("articles/:articleSlug/reviews")
export class ArticleReviewsController {
  constructor(private readonly svc: ReviewsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "نظرات یک مقاله",
    description: "لیست صفحه‌بندی‌شده‌ی نظرات و امتیازهای ثبت‌شده روی مقاله — نیازی به احراز هویت نیست.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "articleSlug", description: "slug مقاله", example: "intro-to-fiqh" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 12 })
  @ApiResponse({ status: 200, description: "لیست صفحه‌بندی‌شده‌ی ReviewRecord" })
  @ApiResponse({ status: 404, description: "ARTICLE_NOT_FOUND", type: ApiErrorSchema })
  findAll(
    @Param("articleSlug") articleSlug: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ) {
    return this.svc.findByArticle(articleSlug, page, limit);
  }

  @Post()
  @ApiOperation({
    summary: "ثبت نظر و امتیاز روی مقاله",
    description: "هر کاربر فقط یک‌بار می‌تواند روی هر مقاله نظر بدهد. برای ویرایش از PATCH استفاده کنید.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "articleSlug", description: "slug مقاله", example: "intro-to-fiqh" })
  @ApiResponse({ status: 201, description: "نظر ثبت شد" })
  @ApiResponse({ status: 404, description: "ARTICLE_NOT_FOUND", type: ApiErrorSchema })
  @ApiResponse({ status: 409, description: "REVIEW_ALREADY_EXISTS — این کاربر قبلاً نظر داده", type: ApiErrorSchema })
  create(
    @Param("articleSlug") articleSlug: string,
    @Body() dto: CreateReviewDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.svc.createForArticle(articleSlug, req.user.id, dto);
  }

  @Patch(":reviewId")
  @ApiOperation({ summary: "ویرایش نظر خودم", description: "فقط صاحب نظر می‌تواند آن را ویرایش کند." })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "articleSlug", description: "slug مقاله" })
  @ApiParam({ name: "reviewId", description: "UUID نظر" })
  @ApiResponse({ status: 200, description: "نظر ویرایش شد" })
  @ApiResponse({ status: 403, description: "NOT_REVIEW_OWNER", type: ApiErrorSchema })
  @ApiResponse({ status: 404, description: "REVIEW_NOT_FOUND یا ARTICLE_NOT_FOUND", type: ApiErrorSchema })
  update(
    @Param("articleSlug") articleSlug: string,
    @Param("reviewId") reviewId: string,
    @Body() dto: UpdateReviewDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.svc.updateArticleReview(articleSlug, reviewId, req.user.id, dto);
  }

  @Delete(":reviewId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "حذف نظر",
    description: "صاحب نظر یا admin می‌تواند نظر را حذف کند.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "articleSlug", description: "slug مقاله" })
  @ApiParam({ name: "reviewId", description: "UUID نظر" })
  @ApiResponse({ status: 204, description: "نظر حذف شد" })
  @ApiResponse({ status: 403, description: "NOT_REVIEW_OWNER", type: ApiErrorSchema })
  @ApiResponse({ status: 404, description: "REVIEW_NOT_FOUND یا ARTICLE_NOT_FOUND", type: ApiErrorSchema })
  remove(
    @Param("articleSlug") articleSlug: string,
    @Param("reviewId") reviewId: string,
    @Request() req: { user: { id: string; role: string } },
  ) {
    return this.svc.removeArticleReview(articleSlug, reviewId, req.user.id, req.user.role === "admin");
  }
}
