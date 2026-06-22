import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { CourseProgress } from "@roohbakhsh/shared";
import { LessonProgress } from "./entities/lesson-progress.entity";
import { Lesson } from "../courses/entities/lesson.entity";
import { Course } from "../courses/entities/course.entity";

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private readonly repo: Repository<LessonProgress>,
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  /** درس را به‌عنوان دیده‌شده ثبت می‌کند — idempotent. */
  async markWatched(userId: string, lessonId: string): Promise<void> {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException("LESSON_NOT_FOUND");

    const existing = await this.repo.findOne({ where: { userId, lessonId } });
    if (existing) return;

    await this.repo.save(this.repo.create({ userId, lessonId, courseId: lesson.courseId }));
  }

  async courseProgress(userId: string, courseSlug: string): Promise<CourseProgress> {
    const course = await this.courseRepo.findOne({ where: { slug: courseSlug } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");

    const map = await this.progressForCourses(userId, [course.id]);
    return map.get(course.id) ?? this.emptyProgress(course.id, course.slug);
  }

  /** پیشرفت برای چند دوره با هم — برای داشبورد (دوره‌هایی که کاربر خریده). */
  async progressForCourses(userId: string, courseIds: string[]): Promise<Map<string, CourseProgress>> {
    const map = new Map<string, CourseProgress>();
    if (courseIds.length === 0) return map;

    const courses = await this.courseRepo.find({ where: courseIds.map((id) => ({ id })) });
    const totalRows = await this.lessonRepo
      .createQueryBuilder("lesson")
      .select("lesson.courseId", "courseId")
      .addSelect("SUM(lesson.durationMinutes)", "totalMinutes")
      .where("lesson.courseId IN (:...courseIds)", { courseIds })
      .groupBy("lesson.courseId")
      .getRawMany<{ courseId: string; totalMinutes: string }>();
    const totalMap = new Map(totalRows.map((r) => [r.courseId, Number(r.totalMinutes)]));

    const watchedRows = await this.repo
      .createQueryBuilder("progress")
      .innerJoin(Lesson, "lesson", "lesson.id = progress.lessonId")
      .select("progress.courseId", "courseId")
      .addSelect("SUM(lesson.durationMinutes)", "watchedMinutes")
      .where("progress.userId = :userId", { userId })
      .andWhere("progress.courseId IN (:...courseIds)", { courseIds })
      .groupBy("progress.courseId")
      .getRawMany<{ courseId: string; watchedMinutes: string }>();
    const watchedMap = new Map(watchedRows.map((r) => [r.courseId, Number(r.watchedMinutes)]));

    for (const course of courses) {
      const totalMinutes = totalMap.get(course.id) ?? 0;
      const watchedMinutes = Math.min(watchedMap.get(course.id) ?? 0, totalMinutes);
      const progressPercent = totalMinutes === 0 ? 0 : Math.round((watchedMinutes / totalMinutes) * 100);
      map.set(course.id, { courseId: course.id, courseSlug: course.slug, watchedMinutes, totalMinutes, progressPercent });
    }
    return map;
  }

  private emptyProgress(courseId: string, courseSlug: string): CourseProgress {
    return { courseId, courseSlug, watchedMinutes: 0, totalMinutes: 0, progressPercent: 0 };
  }
}
