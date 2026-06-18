import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { CourseRecord, CourseDiscount, Money, Paginated } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Course } from "./entities/course.entity";
import { Instructor } from "../instructor/entities/instructor.entity";
import { Category } from "../category/entities/category.entity";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly repo: Repository<Course>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(page: number, limit: number): Promise<Paginated<CourseRecord>> {
    const [items, total] = await this.repo.findAndCount({
      relations: { instructor: true },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((c) => this.toContract(c)), total, page, limit);
  }

  async findOne(id: string): Promise<CourseRecord> {
    const course = await this.repo.findOne({ where: { id }, relations: { instructor: true } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");
    return this.toContract(course);
  }

  async create(dto: CreateCourseDto): Promise<CourseRecord> {
    await this.assertSlugUnique(dto.slug);

    const instructor = await this.instructorRepo.findOne({ where: { id: dto.instructorId } });
    if (!instructor) throw new NotFoundException("INSTRUCTOR_NOT_FOUND");

    if (dto.categoryId) {
      const cat = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!cat) throw new NotFoundException("CATEGORY_NOT_FOUND");
    }

    const course = this.repo.create({
      title: dto.title,
      slug: dto.slug,
      description: dto.description,
      thumbnailUrl: dto.thumbnailUrl ?? null,
      price: dto.price ?? null,
      durationMinutes: 0,
      lessonCount: 0,
      level: dto.level ?? "beginner",
      instructorId: dto.instructorId,
      instructor,
      categoryId: dto.categoryId ?? null,
      discountPrice: dto.discountPrice ?? null,
      discountExpiresAt: dto.discountExpiresAt ? new Date(dto.discountExpiresAt) : null,
    });

    const saved = await this.repo.save(course);
    return this.toContract(saved);
  }

  async update(id: string, dto: UpdateCourseDto): Promise<CourseRecord> {
    const course = await this.repo.findOne({ where: { id }, relations: { instructor: true } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");

    if (dto.slug && dto.slug !== course.slug) {
      await this.assertSlugUnique(dto.slug);
    }

    if (dto.instructorId && dto.instructorId !== course.instructorId) {
      const instructor = await this.instructorRepo.findOne({ where: { id: dto.instructorId } });
      if (!instructor) throw new NotFoundException("INSTRUCTOR_NOT_FOUND");
      course.instructor = instructor;
      course.instructorId = dto.instructorId;
    }

    if (dto.categoryId !== undefined) {
      if (dto.categoryId) {
        const cat = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
        if (!cat) throw new NotFoundException("CATEGORY_NOT_FOUND");
      }
      course.categoryId = dto.categoryId ?? null;
    }

    if (dto.title !== undefined) course.title = dto.title;
    if (dto.slug !== undefined) course.slug = dto.slug;
    if (dto.description !== undefined) course.description = dto.description;
    if (dto.thumbnailUrl !== undefined) course.thumbnailUrl = dto.thumbnailUrl ?? null;
    if (dto.price !== undefined) course.price = dto.price ?? null;
    if (dto.level !== undefined) course.level = dto.level;
    if (dto.isPublished !== undefined) course.isPublished = dto.isPublished;
    if (dto.discountPrice !== undefined) course.discountPrice = dto.discountPrice ?? null;
    if (dto.discountExpiresAt !== undefined) {
      course.discountExpiresAt = dto.discountExpiresAt ? new Date(dto.discountExpiresAt) : null;
    }

    return this.toContract(await this.repo.save(course));
  }

  async remove(id: string): Promise<void> {
    const course = await this.repo.findOne({ where: { id } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");
    await this.repo.remove(course);
  }

  private async assertSlugUnique(slug: string): Promise<void> {
    const exists = await this.repo.findOne({ where: { slug } });
    if (exists) throw new ConflictException("COURSE_SLUG_TAKEN");
  }

  private buildDiscount(course: Course): CourseDiscount | null {
    if (!course.discountPrice) return null;
    const isActive =
      !course.discountExpiresAt || course.discountExpiresAt > new Date();
    return {
      price: course.discountPrice,
      expiresAt: course.discountExpiresAt?.toISOString() ?? null,
      isActive,
    };
  }

  private toContract(course: Course): CourseRecord {
    const discount = this.buildDiscount(course);
    const effectivePrice: Money | null =
      discount?.isActive ? discount.price : course.price;

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      price: course.price,
      discount,
      effectivePrice,
      durationMinutes: course.durationMinutes,
      lessonCount: course.lessonCount,
      level: course.level,
      isPublished: course.isPublished,
      instructorId: course.instructorId,
      instructor: {
        id: course.instructor.id,
        slug: course.instructor.slug,
        name: course.instructor.name,
        avatarUrl: course.instructor.avatarUrl,
      },
      categoryId: course.categoryId,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    };
  }
}
