import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { CourseRecord, CourseDiscount, Money, Paginated } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Course } from "./entities/course.entity";
import { Lesson } from "./entities/lesson.entity";
import { Instructor } from "../instructor/entities/instructor.entity";
import { Category } from "../category/entities/category.entity";
import { OrderItem } from "../orders/entities/order-item.entity";
import { Favorite } from "../favorites/entities/favorite.entity";
import { LessonProgress } from "../progress/entities/lesson-progress.entity";
import { ReviewsService } from "../reviews/reviews.service";
import { CourseAccessService } from "./course-access.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

interface CourseStats {
  lessonCount: number;
  durationMinutes: number;
  averageRating: number | null;
  reviewCount: number;
  participantCount: number;
}

const EMPTY_STATS: CourseStats = {
  lessonCount: 0,
  durationMinutes: 0,
  averageRating: null,
  reviewCount: 0,
  participantCount: 0,
};

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly repo: Repository<Course>,
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
    @InjectRepository(LessonProgress)
    private readonly lessonProgressRepo: Repository<LessonProgress>,
    private readonly reviewsService: ReviewsService,
    private readonly courseAccessService: CourseAccessService,
  ) {}

  async findAll(page: number, limit: number, q?: string): Promise<Paginated<CourseRecord>> {
    const search = q?.trim();
    if (search && search.length < 3) {
      throw new BadRequestException("SEARCH_QUERY_TOO_SHORT");
    }

    const qb = this.repo
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.instructor", "instructor")
      .where("course.isPublished = :isPublished", { isPublished: true })
      .orderBy("course.createdAt", "DESC")
      .take(limit)
      .skip((page - 1) * limit);

    if (search) {
      qb.andWhere(
        "(JSON_UNQUOTE(JSON_EXTRACT(course.title, '$.ar')) LIKE :q OR JSON_UNQUOTE(JSON_EXTRACT(course.title, '$.ur')) LIKE :q)",
        { q: `%${search}%` },
      );
    }

    const [items, total] = await qb.getManyAndCount();
    const courseIds = items.map((c) => c.id);
    const [lessonStats, ratingStats, participantStats] = await Promise.all([
      this.lessonStatsForCourses(courseIds),
      this.reviewsService.ratingSummaries(courseIds),
      this.participantCountsForCourses(courseIds),
    ]);
    return toPaginated(
      items.map((c) => this.toContract(c, this.mergeStats(c.id, lessonStats, ratingStats, participantStats), false)),
      total,
      page,
      limit,
    );
  }

  /** لیست کامل دوره‌ها (شامل پیش‌نویس) — فقط برای پنل ادمین. */
  async findAllAdmin(page: number, limit: number, q?: string): Promise<Paginated<CourseRecord>> {
    const search = q?.trim();
    if (search && search.length < 3) {
      throw new BadRequestException("SEARCH_QUERY_TOO_SHORT");
    }

    const qb = this.repo
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.instructor", "instructor")
      .orderBy("course.createdAt", "DESC")
      .take(limit)
      .skip((page - 1) * limit);

    if (search) {
      qb.andWhere(
        "(JSON_UNQUOTE(JSON_EXTRACT(course.title, '$.ar')) LIKE :q OR JSON_UNQUOTE(JSON_EXTRACT(course.title, '$.ur')) LIKE :q)",
        { q: `%${search}%` },
      );
    }

    const [items, total] = await qb.getManyAndCount();
    const courseIds = items.map((c) => c.id);
    const [lessonStats, ratingStats, participantStats] = await Promise.all([
      this.lessonStatsForCourses(courseIds),
      this.reviewsService.ratingSummaries(courseIds),
      this.participantCountsForCourses(courseIds),
    ]);
    return toPaginated(
      items.map((c) => this.toContract(c, this.mergeStats(c.id, lessonStats, ratingStats, participantStats), false)),
      total,
      page,
      limit,
    );
  }

  async findOne(slugOrId: string, userId?: string): Promise<CourseRecord> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
    const where = isUuid
      ? { id: slugOrId, isPublished: true }
      : { slug: slugOrId, isPublished: true };
    const course = await this.repo.findOne({ where, relations: { instructor: true } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");
    const stats = await this.statsForCourse(course.id);
    const hasPurchased = await this.courseAccessService.hasPurchased(userId, course.id);
    return this.toContract(course, stats, hasPurchased);
  }

  /** مشخصات یک دوره با slug — شامل پیش‌نویس. فقط برای پنل ادمین. */
  async findOneAdmin(slug: string): Promise<CourseRecord> {
    const course = await this.repo.findOne({ where: { slug }, relations: { instructor: true } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");
    const stats = await this.statsForCourse(course.id);
    return this.toContract(course, stats, false);
  }

  /** lessonCount/durationMinutes از lessons، averageRating/reviewCount از reviews، participantCount از سفارش‌های paid — هیچ‌کدام denormalize نشده. */
  private async statsForCourse(courseId: string): Promise<CourseStats> {
    const lessons = await this.lessonRepo.find({ where: { courseId } });
    const rating = await this.reviewsService.ratingSummary(courseId);
    const participantCount = await this.participantCountForCourse(courseId);
    return {
      lessonCount: lessons.length,
      durationMinutes: lessons.reduce((sum, l) => sum + l.durationMinutes, 0),
      averageRating: rating.averageRating,
      reviewCount: rating.reviewCount,
      participantCount,
    };
  }

  private async lessonStatsForCourses(
    courseIds: string[],
  ): Promise<Map<string, { lessonCount: number; durationMinutes: number }>> {
    const map = new Map<string, { lessonCount: number; durationMinutes: number }>();
    if (courseIds.length === 0) return map;

    const rows = await this.lessonRepo
      .createQueryBuilder("lesson")
      .select("lesson.courseId", "courseId")
      .addSelect("COUNT(*)", "lessonCount")
      .addSelect("SUM(lesson.durationMinutes)", "durationMinutes")
      .where("lesson.courseId IN (:...courseIds)", { courseIds })
      .groupBy("lesson.courseId")
      .getRawMany<{ courseId: string; lessonCount: string; durationMinutes: string }>();

    for (const row of rows) {
      map.set(row.courseId, {
        lessonCount: Number(row.lessonCount),
        durationMinutes: Number(row.durationMinutes),
      });
    }
    return map;
  }

  /** تعداد کاربران یکتایی که این دوره را با سفارش paid خریده‌اند. */
  private async participantCountForCourse(courseId: string): Promise<number> {
    const map = await this.participantCountsForCourses([courseId]);
    return map.get(courseId) ?? 0;
  }

  private async participantCountsForCourses(courseIds: string[]): Promise<Map<string, number>> {
    const map = new Map<string, number>();
    if (courseIds.length === 0) return map;

    const rows = await this.orderItemRepo
      .createQueryBuilder("item")
      .innerJoin("item.order", "order")
      .select("item.courseId", "courseId")
      .addSelect("COUNT(DISTINCT order.userId)", "participantCount")
      .where("item.courseId IN (:...courseIds)", { courseIds })
      .andWhere("order.status = :status", { status: "paid" })
      .groupBy("item.courseId")
      .getRawMany<{ courseId: string; participantCount: string }>();

    for (const row of rows) {
      map.set(row.courseId, Number(row.participantCount));
    }
    return map;
  }

  private mergeStats(
    courseId: string,
    lessonStats: Map<string, { lessonCount: number; durationMinutes: number }>,
    ratingStats: Map<string, { averageRating: number | null; reviewCount: number }>,
    participantStats: Map<string, number>,
  ): CourseStats {
    const lesson = lessonStats.get(courseId);
    const rating = ratingStats.get(courseId);
    return {
      lessonCount: lesson?.lessonCount ?? 0,
      durationMinutes: lesson?.durationMinutes ?? 0,
      averageRating: rating?.averageRating ?? null,
      reviewCount: rating?.reviewCount ?? 0,
      participantCount: participantStats.get(courseId) ?? 0,
    };
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
      introVideoUrl: dto.introVideoUrl ?? null,
      price: dto.price ?? null,
      level: dto.level ?? "beginner",
      runStatus: dto.runStatus ?? "upcoming",
      accessType: dto.accessType ?? "online_only",
      instructorId: dto.instructorId,
      instructor,
      categoryId: dto.categoryId ?? null,
      discountPrice: dto.discountPrice ?? null,
      discountExpiresAt: dto.discountExpiresAt ? new Date(dto.discountExpiresAt) : null,
    });

    const saved = await this.repo.save(course);
    return this.toContract(saved, EMPTY_STATS, false);
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
    if (dto.introVideoUrl !== undefined) course.introVideoUrl = dto.introVideoUrl ?? null;
    if (dto.price !== undefined) course.price = dto.price ?? null;
    if (dto.level !== undefined) course.level = dto.level;
    if (dto.runStatus !== undefined) course.runStatus = dto.runStatus;
    if (dto.accessType !== undefined) course.accessType = dto.accessType;
    if (dto.isPublished !== undefined) course.isPublished = dto.isPublished;
    if (dto.discountPrice !== undefined) course.discountPrice = dto.discountPrice ?? null;
    if (dto.discountExpiresAt !== undefined) {
      course.discountExpiresAt = dto.discountExpiresAt ? new Date(dto.discountExpiresAt) : null;
    }

    const saved = await this.repo.save(course);
    const stats = await this.statsForCourse(saved.id);
    return this.toContract(saved, stats, false);
  }

  async remove(id: string): Promise<void> {
    const course = await this.repo.findOne({ where: { id } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");

    const hasOrders = await this.orderItemRepo.exists({ where: { courseId: id } });
    if (hasOrders) throw new BadRequestException("COURSE_HAS_ORDERS");

    const hasFavorite = await this.favoriteRepo.exists({ where: { type: "course", targetId: id } });
    if (hasFavorite) throw new BadRequestException("COURSE_IN_FAVORITES");

    const lessonIds = (await this.lessonRepo.find({ where: { courseId: id }, select: ["id"] })).map((l) => l.id);
    if (lessonIds.length > 0) {
      const hasProgress = await this.lessonProgressRepo.exists({ where: lessonIds.map((lid) => ({ courseId: id, lessonId: lid })) });
      if (hasProgress) throw new BadRequestException("COURSE_HAS_LESSON_PROGRESS");

      const hasLessonFavorite = await this.favoriteRepo.exists({ where: lessonIds.map((lid) => ({ type: "lesson" as const, targetId: lid })) });
      if (hasLessonFavorite) throw new BadRequestException("COURSE_HAS_LESSON_IN_FAVORITES");
    }

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

  private toContract(course: Course, stats: CourseStats, hasPurchased: boolean): CourseRecord {
    const discount = this.buildDiscount(course);
    const effectivePrice: Money | null =
      discount?.isActive ? discount.price : course.price;

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl ?? { ar: null, ur: null },
      introVideoUrl: course.introVideoUrl ?? { ar: null, ur: null },
      price: course.price,
      discount,
      effectivePrice,
      durationMinutes: stats.durationMinutes,
      lessonCount: stats.lessonCount,
      averageRating: stats.averageRating,
      reviewCount: stats.reviewCount,
      participantCount: stats.participantCount,
      level: course.level,
      runStatus: course.runStatus,
      accessType: course.accessType,
      isPublished: course.isPublished,
      instructorId: course.instructorId,
      instructor: {
        id: course.instructor.id,
        slug: course.instructor.slug,
        name: course.instructor.name,
        avatarUrl: course.instructor.avatarUrl,
      },
      categoryId: course.categoryId,
      hasPurchased,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    };
  }
}
