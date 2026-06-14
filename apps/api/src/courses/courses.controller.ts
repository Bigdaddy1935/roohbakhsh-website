import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { CourseListItem, Paginated } from "@roohbakhsh/shared";

// ──────────────────────────────────────────────────────────────
// نمونه‌ی endpoint. توجه: خروجی دقیقاً از تایپ مشترک @roohbakhsh/shared است.
// همین تایپ را فرانت‌کار هم import می‌کند → فرانت و بک همیشه همگام.
//
// این داده فعلاً ساختگی است (اسکلت قدم ۱). بعداً به CMS/دیتابیس وصل می‌شود.
// ──────────────────────────────────────────────────────────────

@ApiTags("courses")
@Controller("courses")
export class CoursesController {
  @Get()
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

  @Get(":slug")
  getOne(@Param("slug") slug: string) {
    // TODO: از CMS/دیتابیس بخوان و CourseDetail برگردان
    return { slug };
  }
}
