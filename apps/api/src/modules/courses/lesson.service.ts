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

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Section)
    private readonly sectionRepo: Repository<Section>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async findBySection(
    courseSlug: string,
    sectionId: string,
    page: number,
    limit: number,
  ): Promise<Paginated<LessonContract>> {
    const section = await this.sectionByIdAndCourseSlug(courseSlug, sectionId);
    const [lessons, total] = await this.lessonRepo.findAndCount({
      where: { sectionId: section.id },
      order: { order: "ASC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(lessons.map(this.toContract), total, page, limit);
  }

  async findOne(courseSlug: string, sectionId: string, lessonId: string): Promise<LessonContract> {
    const section = await this.sectionByIdAndCourseSlug(courseSlug, sectionId);
    const lesson = await this.lessonRepo.findOne({ where: { id: lessonId, sectionId: section.id } });
    if (!lesson) throw new NotFoundException("LESSON_NOT_FOUND");
    return this.toContract(lesson);
  }

  async create(courseSlug: string, sectionId: string, dto: CreateLessonDto): Promise<LessonContract> {
    const section = await this.sectionByIdAndCourseSlug(courseSlug, sectionId);

    const lesson = this.lessonRepo.create({
      title: dto.title,
      order: dto.order ?? 0,
      durationMinutes: dto.durationMinutes,
      isFreePreview: dto.isFreePreview ?? false,
      sectionId: section.id,
      courseId: section.courseId,
    });

    const saved = await this.lessonRepo.save(lesson);

    return this.toContract(saved);
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
    if (dto.order !== undefined) lesson.order = dto.order;
    if (dto.durationMinutes !== undefined) lesson.durationMinutes = dto.durationMinutes;
    if (dto.isFreePreview !== undefined) lesson.isFreePreview = dto.isFreePreview;

    const saved = await this.lessonRepo.save(lesson);

    return this.toContract(saved);
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

  private toContract(lesson: Lesson): LessonContract {
    return {
      id: lesson.id,
      title: lesson.title,
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
