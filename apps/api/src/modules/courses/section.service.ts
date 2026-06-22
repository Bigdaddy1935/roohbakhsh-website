import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { SectionRecord } from "@roohbakhsh/shared";
import { Section } from "./entities/section.entity";
import { Course } from "./entities/course.entity";
import { CreateSectionDto } from "./dto/create-section.dto";
import { UpdateSectionDto } from "./dto/update-section.dto";

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepo: Repository<Section>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async findByCourse(courseSlug: string): Promise<SectionRecord[]> {
    const course = await this.courseBySlug(courseSlug);
    const sections = await this.sectionRepo.find({
      where: { courseId: course.id },
      relations: { lessons: true },
      order: { order: "ASC", lessons: { order: "ASC" } },
    });
    return sections.map((s) => this.toContract(s));
  }

  async findOne(courseSlug: string, sectionId: string): Promise<SectionRecord> {
    const course = await this.courseBySlug(courseSlug);
    const section = await this.sectionRepo.findOne({
      where: { id: sectionId, courseId: course.id },
      relations: { lessons: true },
      order: { lessons: { order: "ASC" } },
    });
    if (!section) throw new NotFoundException("SECTION_NOT_FOUND");
    return this.toContract(section);
  }

  async create(courseSlug: string, dto: CreateSectionDto): Promise<SectionRecord> {
    const course = await this.courseBySlug(courseSlug);
    const section = this.sectionRepo.create({
      courseId: course.id,
      title: dto.title,
      order: dto.order ?? 0,
    });
    const saved = await this.sectionRepo.save(section);
    saved.lessons = [];
    return this.toContract(saved);
  }

  async update(courseSlug: string, sectionId: string, dto: UpdateSectionDto): Promise<SectionRecord> {
    const course = await this.courseBySlug(courseSlug);
    const section = await this.sectionRepo.findOne({
      where: { id: sectionId, courseId: course.id },
      relations: { lessons: true },
      order: { lessons: { order: "ASC" } },
    });
    if (!section) throw new NotFoundException("SECTION_NOT_FOUND");

    if (dto.title !== undefined) section.title = dto.title;
    if (dto.order !== undefined) section.order = dto.order;

    return this.toContract(await this.sectionRepo.save(section));
  }

  async remove(courseSlug: string, sectionId: string): Promise<void> {
    const course = await this.courseBySlug(courseSlug);
    const section = await this.sectionRepo.findOne({ where: { id: sectionId, courseId: course.id } });
    if (!section) throw new NotFoundException("SECTION_NOT_FOUND");
    await this.sectionRepo.remove(section);
    await this.reorderSections(course.id);
  }

  private async reorderSections(courseId: string): Promise<void> {
    const remaining = await this.sectionRepo.find({
      where: { courseId },
      order: { order: "ASC" },
    });
    await Promise.all(
      remaining.map((s, i) => this.sectionRepo.update(s.id, { order: i + 1 })),
    );
  }

  private async courseBySlug(slug: string): Promise<Course> {
    const course = await this.courseRepo.findOne({ where: { slug } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");
    return course;
  }

  private toContract(section: Section): SectionRecord {
    return {
      id: section.id,
      courseId: section.courseId,
      title: section.title,
      order: section.order,
      lessons: (section.lessons ?? []).map((l) => ({
        id: l.id,
        title: l.title,
        order: l.order,
        durationMinutes: l.durationMinutes,
        isFreePreview: l.isFreePreview,
        sectionId: l.sectionId,
        courseId: l.courseId,
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      })),
      createdAt: section.createdAt.toISOString(),
      updatedAt: section.updatedAt.toISOString(),
    };
  }
}
