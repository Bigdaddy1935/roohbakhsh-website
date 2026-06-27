import { Controller, Post, Get, Param, Request, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiHeader, ApiBearerAuth, ApiCookieAuth } from "@nestjs/swagger";
import { ProgressService } from "./progress.service";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("progress")
@ApiCookieAuth("access_token")
@ApiBearerAuth()
@Controller()
export class ProgressController {
  constructor(private readonly svc: ProgressService) {}

  @Post("lessons/:lessonId/watch")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "lessonId", description: "UUID درس" })
  @ApiOperation({
    summary: "ثبت دیده‌شدن درس",
    description: "وقتی کاربر یک درس را به‌صورت آنلاین می‌بیند صدا زده می‌شود. idempotent.",
  })
  @ApiResponse({ status: 204, description: "ثبت شد" })
  @ApiResponse({ status: 404, description: "LESSON_NOT_FOUND", type: ApiErrorSchema })
  markWatched(@Param("lessonId") lessonId: string, @Request() req: { user: { id: string } }) {
    return this.svc.markWatched(req.user.id, lessonId);
  }

  @Get("courses/:courseSlug/progress")
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "courseSlug", description: "slug دوره" })
  @ApiOperation({
    summary: "درصد پیشرفت من در یک دوره",
    description: "بر اساس مدت‌زمان درس‌هایی که کاربر آنلاین دیده، نسبت به مدت‌زمان کل دوره.",
  })
  @ApiResponse({ status: 200, description: "CourseProgress" })
  @ApiResponse({ status: 404, description: "COURSE_NOT_FOUND", type: ApiErrorSchema })
  courseProgress(@Param("courseSlug") courseSlug: string, @Request() req: { user: { id: string } }) {
    return this.svc.courseProgress(req.user.id, courseSlug);
  }
}
