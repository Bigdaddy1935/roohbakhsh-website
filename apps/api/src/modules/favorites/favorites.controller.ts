import { Controller, Post, Get, Body, Query, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth, ApiCookieAuth, ApiQuery } from "@nestjs/swagger";
import { FavoritesService } from "./favorites.service";
import { ToggleFavoriteDto } from "./dto/toggle-favorite.dto";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("favorites")
@ApiCookieAuth("access_token")
@ApiBearerAuth()
@Controller("favorites")
export class FavoritesController {
  constructor(private readonly svc: FavoritesService) {}

  @Post("toggle")
  @ApiHeader(LANG_HEADER)
  @ApiOperation({
    summary: "اضافه/حذف علاقه‌مندی",
    description: "اگر دوره/مقاله قبلاً علاقه‌مندی بود حذف می‌کند، در غیر این صورت اضافه می‌کند.",
  })
  @ApiResponse({ status: 201, description: "FavoriteStatus" })
  @ApiResponse({ status: 404, description: "COURSE_NOT_FOUND / ARTICLE_NOT_FOUND", type: ApiErrorSchema })
  toggle(@Body() dto: ToggleFavoriteDto, @Request() req: { user: { id: string } }) {
    return this.svc.toggle(req.user.id, dto);
  }

  @Get("mine")
  @ApiHeader(LANG_HEADER)
  @ApiQuery({ name: "limit", required: false, example: 20 })
  @ApiOperation({ summary: "علاقه‌مندی‌های من", description: "لیست دوره/مقاله‌های علاقه‌مندی کاربر، جدیدترین اول." })
  @ApiResponse({ status: 200, description: "FavoriteItem[]" })
  findMine(@Query("limit") limit: string | undefined, @Request() req: { user: { id: string } }) {
    return this.svc.findMine(req.user.id, limit ? Number(limit) : undefined);
  }
}
