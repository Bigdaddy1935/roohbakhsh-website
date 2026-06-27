import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiHeader,
  ApiBearerAuth,
  ApiCookieAuth,
} from "@nestjs/swagger";
import { ReviewsService } from "./reviews.service";
import { Public } from "../auth/decorators/public.decorator";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("reviews")
@ApiHeader(LANG_HEADER)
@Controller("reviews")
export class AllReviewsController {
  constructor(private readonly svc: ReviewsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "همه‌ی نظرات تأیید‌شده (دوره + مقاله)",
    description:
      "لیست صفحه‌بندی‌شده‌ی نظرات **تأیید‌شده** روی دوره‌ها و مقالات با هم، جدیدترین اول. " +
      "نظری که هنوز توسط admin تأیید نشده (`isApproved: false`) در این لیست نمایش داده نمی‌شود. " +
      "هر آیتم فیلد `target` دارد که نشان می‌دهد نظر متعلق به کدام دوره یا مقاله است " +
      "(`{ type: \"course\"|\"article\", id, slug, title }`).",
  })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 12 })
  @ApiResponse({ status: 200, description: "لیست صفحه‌بندی‌شده‌ی ReviewWithTarget" })
  findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ) {
    return this.svc.findAll(page, limit);
  }

  @Get("pending")
  @ApiBearerAuth()
  @ApiCookieAuth("access_token")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({
    summary: "صف نظرات در انتظار تأیید — فقط admin",
    description: "لیست صفحه‌بندی‌شده‌ی نظراتی که هنوز تأیید نشده‌اند (`isApproved: false`)، قدیمی‌ترین اول.",
  })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 12 })
  @ApiResponse({ status: 200, description: "لیست صفحه‌بندی‌شده‌ی ReviewWithTarget" })
  @ApiResponse({ status: 403, description: "دسترسی فقط برای admin", type: ApiErrorSchema })
  findPending(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(12), ParseIntPipe) limit: number,
  ) {
    return this.svc.findPending(page, limit);
  }

  @Post(":id/approve")
  @ApiBearerAuth()
  @ApiCookieAuth("access_token")
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({
    summary: "تأیید یک نظر — فقط admin",
    description: "پس از تأیید، نظر در لیست‌های عمومی (`GET /reviews`, `GET /courses/:slug/reviews`, ...) نمایش داده می‌شود.",
  })
  @ApiParam({ name: "id", description: "UUID نظر" })
  @ApiResponse({ status: 200, description: "نظر تأیید شد" })
  @ApiResponse({ status: 403, description: "دسترسی فقط برای admin", type: ApiErrorSchema })
  @ApiResponse({ status: 404, description: "REVIEW_NOT_FOUND", type: ApiErrorSchema })
  approve(@Param("id") id: string) {
    return this.svc.approve(id);
  }
}
