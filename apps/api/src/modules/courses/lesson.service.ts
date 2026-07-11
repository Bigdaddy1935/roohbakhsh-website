import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { Lesson as LessonContract, Paginated } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Lesson } from "./entities/lesson.entity";
import { Section } from "./entities/section.entity";
import { Course } from "./entities/course.entity";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { CourseAccessService } from "./course-access.service";

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Section)
    private readonly sectionRepo: Repository<Section>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    private readonly courseAccess: CourseAccessService,
  ) {}

  async findBySection(
    courseSlug: string,
    sectionId: string,
    page: number,
    limit: number,
    userId?: string,
    isAdmin?: boolean,
  ): Promise<Paginated<LessonContract>> {
    const section = isAdmin
      ? await this.sectionByIdAndCourseSlug(courseSlug, sectionId)
      : await this.publishedSectionByIdAndCourseSlug(courseSlug, sectionId);
    const [lessons, total] = await this.lessonRepo.findAndCount({
      where: { sectionId: section.id },
      order: { order: "ASC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    const hasPurchased = isAdmin || (await this.courseAccess.hasPurchased(userId, section.courseId));
    return toPaginated(lessons.map((l) => this.toContract(l, hasPurchased)), total, page, limit);
  }

  async findOne(
    courseSlug: string,
    sectionId: string,
    lessonId: string,
    userId?: string,
    isAdmin?: boolean,
  ): Promise<LessonContract> {
    const section = isAdmin
      ? await this.sectionByIdAndCourseSlug(courseSlug, sectionId)
      : await this.publishedSectionByIdAndCourseSlug(courseSlug, sectionId);
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId, sectionId: section.id } });
    if (!lesson) throw new NotFoundException("LESSON_NOT_FOUND");
    const hasPurchased = isAdmin || (await this.courseAccess.hasPurchased(userId, section.courseId));
    return this.toContract(lesson, hasPurchased);
  }

  async create(courseSlug: string, sectionId: string, dto: CreateLessonDto): Promise<LessonContract> {
    const section = await this.sectionByIdAndCourseSlug(courseSlug, sectionId);

    const lesson = this.lessonRepo.create({
      title: dto.title,
      videoUrl: dto.videoUrl ?? null,
      order: dto.order ?? 0,
      durationMinutes: dto.durationMinutes,
      isFreePreview: dto.isFreePreview ?? false,
      sectionId: section.id,
      courseId: section.courseId,
    });

    const saved = await this.lessonRepo.save(lesson);

    return this.toContract(saved, true);
  }

  async update(
    courseSlug: string,
    sectionId: string,
    lessonId: string,
    dto: UpdateLessonDto,
  ): Promise<LessonContract> {
    const section = await this.sectionByIdAndCourseSlug(courseSlug, sectionId);
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId, sectionId: section.id } });
    if (!lesson) throw new NotFoundException("LESSON_NOT_FOUND");

    if (dto.title !== undefined) lesson.title = dto.title;
    if (dto.videoUrl !== undefined) lesson.videoUrl = dto.videoUrl ?? null;
    if (dto.order !== undefined) lesson.order = dto.order;
    if (dto.durationMinutes !== undefined) lesson.durationMinutes = dto.durationMinutes;
    if (dto.isFreePreview !== undefined) lesson.isFreePreview = dto.isFreePreview;

    const saved = await this.lessonRepo.save(lesson);

    return this.toContract(saved, true);
  }

  async remove(courseSlug: string, sectionId: string, lessonId: string): Promise<void> {
    const section = await this.sectionByIdAndCourseSlug(courseSlug, sectionId);
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId, sectionId: section.id } });
    if (!lesson) throw new NotFoundException("LESSON_NOT_FOUND");

    await this.lessonRepo.remove(lesson);
  }

  private async sectionByIdAndCourseSlug(courseSlug: string, sectionId: string): Promise<Section> {
    const course = await this.courseRepo.findOne({ where: { slug: courseSlug } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");

    const section = await this.sectionRepo.findOne({ where: { id: sectionId, courseId: course.id } });
    if (!section) throw new NotFoundException("SECTION_NOT_FOUND");

    return section;
  }

  /** برای مسیرهای عمومی — دوره‌ی پیش‌نویس هم مثل نبود آن ۴۰۴ برمی‌گرداند. */
  private async publishedSectionByIdAndCourseSlug(courseSlug: string, sectionId: string): Promise<Section> {
    const course = await this.courseRepo.findOne({ where: { slug: courseSlug, isPublished: true } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");

    const section = await this.sectionRepo.findOne({ where: { id: sectionId, courseId: course.id } });
    if (!section) throw new NotFoundException("SECTION_NOT_FOUND");

    return section;
  }

  private toContract(lesson: Lesson, hasPurchased = false): LessonContract {
    return {
      id: lesson.id,
      title: lesson.title,
      videoUrl: lesson.isFreePreview || hasPurchased ? (lesson.videoUrl ?? { ar: null, ur: null }) : { ar: null, ur: null },
      order: lesson.order,
      durationMinutes: lesson.durationMinutes,
      isFreePreview: lesson.isFreePreview,
      sectionId: lesson.sectionId,
      courseId: lesson.courseId,
      createdAt: lesson.createdAt.toISOString(),
      updatedAt: lesson.updatedAt.toISOString(),
    };
  }
}
