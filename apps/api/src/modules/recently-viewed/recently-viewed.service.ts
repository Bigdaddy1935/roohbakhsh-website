import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { RecentViewItem, Paginated } from "@roohbakhsh/shared";
import { RecentView } from "./entities/recent-view.entity";
import { Course } from "../courses/entities/course.entity";
import { Lesson } from "../courses/entities/lesson.entity";
import { RecordViewDto } from "./dto/record-view.dto";
import { toPaginated } from "../../common/utils/paginate";

@Injectable()
export class RecentlyViewedService {
  constructor(
    @InjectRepository(RecentView)
    private readonly repo: Repository<RecentView>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
  ) {}

  /** ثبت/به‌روزرسانی بازدید — idempotent، هر بار viewedAt را جلو می‌برد. */
  async record(userId: string, dto: RecordViewDto): Promise<void> {
    if (dto.type === "course") {
      const exists = await this.courseRepo.findOne({ where: { id: dto.id } });
      if (!exists) throw new NotFoundException("COURSE_NOT_FOUND");
    } else {
      const exists = await this.lessonRepo.findOne({ where: { id: dto.id } });
      if (!exists) throw new NotFoundException("LESSON_NOT_FOUND");
    }

    const existing = await this.repo.findOne({
      where: { userId, type: dto.type, targetId: dto.id },
    });
    if (existing) {
      await this.repo.save(existing); // فقط viewedAt را آپدیت می‌کند
      return;
    }
    await this.repo.save(this.repo.create({ userId, type: dto.type, targetId: dto.id }));
  }

  /** آخرین N بازدید کاربر — برای داشبورد (بدون صفحه‌بندی). */
  async findRecent(userId: string, limit: number): Promise<RecentViewItem[]> {
    const views = await this.repo.find({
      where: { userId },
      order: { viewedAt: "DESC" },
      take: limit,
    });
    return this.toItems(views);
  }

  /** لیست صفحه‌بندی‌شده‌ی بازدیدها — برای صفحه‌ی کامل «بازدیدهای اخیر». */
  async findRecentPaginated(userId: string, page: number, limit: number): Promise<Paginated<RecentViewItem>> {
    const [views, total] = await this.repo.findAndCount({
      where: { userId },
      order: { viewedAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    const items = await this.toItems(views);
    return toPaginated(items, total, page, limit);
  }

  private async toItems(views: RecentView[]): Promise<RecentViewItem[]> {
    if (views.length === 0) return [];

    const courseIds = views.filter((v) => v.type === "course").map((v) => v.targetId);
    const lessonIds = views.filter((v) => v.type === "lesson").map((v) => v.targetId);

    const [courses, lessons] = await Promise.all([
      courseIds.length
        ? this.courseRepo.find({ where: courseIds.map((id) => ({ id })) })
        : Promise.resolve([]),
      lessonIds.length
        ? this.lessonRepo.find({ where: lessonIds.map((id) => ({ id })), relations: { course: true } })
        : Promise.resolve([]),
    ]);
    const courseMap = new Map(courses.map((c) => [c.id, c]));
    const lessonMap = new Map(lessons.map((l) => [l.id, l]));

    const items: RecentViewItem[] = [];
    for (const view of views) {
      if (view.type === "course") {
        const course = courseMap.get(view.targetId);
        if (!course) continue;
        items.push({
          type: "course",
          id: course.id,
          title: course.title,
          thumbnailUrl: course.thumbnailUrl ?? { ar: null, ur: null },
          courseId: course.id,
          courseSlug: course.slug,
          viewedAt: view.viewedAt.toISOString(),
        });
      } else {
        const lesson = lessonMap.get(view.targetId);
        if (!lesson) continue;
        items.push({
          type: "lesson",
          id: lesson.id,
          title: lesson.title,
          thumbnailUrl: lesson.course.thumbnailUrl ?? { ar: null, ur: null },
          courseId: lesson.course.id,
          courseSlug: lesson.course.slug,
          viewedAt: view.viewedAt.toISOString(),
        });
      }
    }
    return items;
  }
}
