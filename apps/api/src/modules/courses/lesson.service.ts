import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { Lesson as LessonContract } from "@roohbakhsh/shared";
import { Lesson } from "./entities/lesson.entity";
import { Course } from "./entities/course.entity";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async findByCourse(courseId: string): Promise<LessonContract[]> {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");

    const lessons = await this.lessonRepo.find({
      where: { courseId },
      order: { order: "ASC" },
    });
    return lessons.map(this.toContract);
  }

  async findOne(courseId: string, lessonId: string): Promise<LessonContract> {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId, courseId } });
    if (!lesson) throw new NotFoundException("LESSON_NOT_FOUND");
    return this.toContract(lesson);
  }

  async create(courseId: string, dto: CreateLessonDto): Promise<LessonContract> {
    const course = await this.courseRepo.findOne({ where: { id: courseId } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");

    const lesson = this.lessonRepo.create({
      title: dto.title,
      order: dto.order ?? 0,
      durationMinutes: dto.durationMinutes,
      isFreePreview: dto.isFreePreview ?? false,
      courseId,
    });

    const saved = await this.lessonRepo.save(lesson);

    // آپدیت تعداد درس‌ها و مدت زمان کل در دوره
    await this.syncCourseStats(courseId);

    return this.toContract(saved);
  }

  async update(courseId: string, lessonId: string, dto: UpdateLessonDto): Promise<LessonContract> {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId, courseId } });
    if (!lesson) throw new NotFoundException("LESSON_NOT_FOUND");

    if (dto.title !== undefined) lesson.title = dto.title;
    if (dto.order !== undefined) lesson.order = dto.order;
    if (dto.durationMinutes !== undefined) lesson.durationMinutes = dto.durationMinutes;
    if (dto.isFreePreview !== undefined) lesson.isFreePreview = dto.isFreePreview;

    const saved = await this.lessonRepo.save(lesson);
    await this.syncCourseStats(courseId);

    return this.toContract(saved);
  }

  async remove(courseId: string, lessonId: string): Promise<void> {
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId, courseId } });
    if (!lesson) throw new NotFoundException("LESSON_NOT_FOUND");

    await this.lessonRepo.remove(lesson);
    await this.syncCourseStats(courseId);
  }

  private async syncCourseStats(courseId: string): Promise<void> {
    const lessons = await this.lessonRepo.find({ where: { courseId } });
    const lessonCount = lessons.length;
    const durationMinutes = lessons.reduce((sum, l) => sum + l.durationMinutes, 0);
    await this.courseRepo.update(courseId, { lessonCount, durationMinutes });
  }

  private toContract(lesson: Lesson): LessonContract {
    return {
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      durationMinutes: lesson.durationMinutes,
      isFreePreview: lesson.isFreePreview,
      courseId: lesson.courseId,
      createdAt: lesson.createdAt.toISOString(),
      updatedAt: lesson.updatedAt.toISOString(),
    };
  }
}
