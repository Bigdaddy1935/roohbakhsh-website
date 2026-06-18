import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiHeader } from "@nestjs/swagger";
import type { CourseListItem, Paginated } from "@roohbakhsh/shared";
import { Public } from "../auth/decorators/public.decorator";
import { ApiErrorSchema } from "../../common/swagger/api-error.schema";
import { LANG_HEADER } from "../../common/swagger/lang-header";

@ApiTags("courses")
@Controller("courses")
export class CoursesController {
  @Public()
  @Get()
  @ApiOperation({
    summary: "لیست دوره‌ها",
    description:
      "لیست دوره‌های منتشرشده را برمی‌گرداند. " +
      "داده از CMS می‌آید — این endpoint فعلاً stub است و در فاز ۲ به CMS وصل می‌شود.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiResponse({
    status: 200,
    description: "لیست دوره‌ها به‌صورت صفحه‌بندی‌شده (Paginated<CourseListItem>)",
  })
  list(): Paginated<CourseListItem> {
    const items: CourseListItem[] = [
      {
        id: "c_01",
        slug: "tafsir-quran-mobtadi",
        title: { ar: "تفسير القرآن للمبتدئين", ur: "ابتدائی قرآن کی تفسیر" },
        excerpt: { ar: "دورة تمهيدية", ur: "تعارفی کورس" },
        thumbnailUrl: "https://cdn.roohbakhsh.com/c01.webp",
        level: "beginner",
        price: { amountMinor: 0, currency: "USD" },
        instructor: {
          id: "i_01",
          slug: "seyed-kazem",
          name: { ar: "السيد كاظم", ur: "سید کاظم" },
          avatarUrl: "https://cdn.roohbakhsh.com/i01.webp",
        },
        hasFreePreview: true,
      },
    ];
    return { items, page: 1, pageSize: 12, total: items.length, totalPages: 1 };
  }

  @Public()
  @Get(":slug")
  @ApiOperation({
    summary: "جزئیات یک دوره",
    description:
      "اطلاعات کامل یک دوره را بر اساس slug برمی‌گرداند. " +
      "در فاز ۲ به CMS وصل می‌شود.",
  })
  @ApiHeader(LANG_HEADER)
  @ApiParam({ name: "slug", example: "tafsir-quran-mobtadi", description: "شناسه‌ی URL-friendly دوره" })
  @ApiResponse({ status: 200, description: "جزئیات دوره (CourseDetail)" })
  @ApiResponse({ status: 404, description: "دوره پیدا نشد — کد: COURSE_NOT_FOUND", type: ApiErrorSchema })
  getOne(@Param("slug") slug: string) {
    return { slug };
  }
}
