import {
  Controller,
  Get,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiHeader } from "@nestjs/swagger";
import { ReviewsService } from "./reviews.service";
import { Public } from "../auth/decorators/public.decorator";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("reviews")
@ApiHeader(LANG_HEADER)
@Controller("reviews")
export class AllReviewsController {
  constructor(private readonly svc: ReviewsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "همه‌ی نظرات (دوره + مقاله)",
    description:
      "لیست صفحه‌بندی‌شده‌ی تمام نظرات ثبت‌شده روی دوره‌ها و مقالات با هم، جدیدترین اول. " +
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
}
