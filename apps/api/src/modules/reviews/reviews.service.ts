import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { ReviewRecord, Paginated, CourseRatingSummary } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Review } from "./entities/review.entity";
import { Course } from "../courses/entities/course.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly repo: Repository<Review>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  async create(courseSlug: string, userId: string, dto: CreateReviewDto): Promise<ReviewRecord> {
    const course = await this.courseBySlug(courseSlug);

    const existing = await this.repo.findOne({ where: { courseId: course.id, userId } });
    if (existing) throw new ConflictException("REVIEW_ALREADY_EXISTS");

    const review = this.repo.create({
      courseId: course.id,
      userId,
      rating: dto.rating,
      comment: dto.comment ?? null,
    });
    const saved = await this.repo.save(review);
    const withUser = await this.repo.findOne({ where: { id: saved.id }, relations: { user: true } });
    return this.toContract(withUser!);
  }

  async findByCourse(courseSlug: string, page: number, limit: number): Promise<Paginated<ReviewRecord>> {
    const course = await this.courseBySlug(courseSlug);
    const [items, total] = await this.repo.findAndCount({
      where: { courseId: course.id },
      relations: { user: true },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((r) => this.toContract(r)), total, page, limit);
  }

  async update(courseSlug: string, reviewId: string, userId: string, dto: UpdateReviewDto): Promise<ReviewRecord> {
    const course = await this.courseBySlug(courseSlug);
    const review = await this.repo.findOne({
      where: { id: reviewId, courseId: course.id },
      relations: { user: true },
    });
    if (!review) throw new NotFoundException("REVIEW_NOT_FOUND");
    if (review.userId !== userId) throw new ForbiddenException("NOT_REVIEW_OWNER");

    if (dto.rating !== undefined) review.rating = dto.rating;
    if (dto.comment !== undefined) review.comment = dto.comment ?? null;

    const saved = await this.repo.save(review);
    return this.toContract(saved);
  }

  async remove(courseSlug: string, reviewId: string, userId: string, isAdmin: boolean): Promise<void> {
    const course = await this.courseBySlug(courseSlug);
    const review = await this.repo.findOne({ where: { id: reviewId, courseId: course.id } });
    if (!review) throw new NotFoundException("REVIEW_NOT_FOUND");
    if (review.userId !== userId && !isAdmin) throw new ForbiddenException("NOT_REVIEW_OWNER");

    await this.repo.remove(review);
  }

  /** میانگین امتیاز و تعداد نظرات یک دوره — برای نمایش در CourseRecord. */
  async ratingSummary(courseId: string): Promise<CourseRatingSummary> {
    const reviews = await this.repo.find({ where: { courseId } });
    if (reviews.length === 0) return { averageRating: null, reviewCount: 0 };

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      averageRating: Math.round((sum / reviews.length) * 10) / 10,
      reviewCount: reviews.length,
    };
  }

  /** میانگین امتیاز چند دوره با یک کوئری گروه‌بندی‌شده — برای لیست دوره‌ها (بدون N+1). */
  async ratingSummaries(courseIds: string[]): Promise<Map<string, CourseRatingSummary>> {
    const map = new Map<string, CourseRatingSummary>();
    if (courseIds.length === 0) return map;

    const rows = await this.repo
      .createQueryBuilder("review")
      .select("review.courseId", "courseId")
      .addSelect("COUNT(*)", "reviewCount")
      .addSelect("AVG(review.rating)", "averageRating")
      .where("review.courseId IN (:...courseIds)", { courseIds })
      .groupBy("review.courseId")
      .getRawMany<{ courseId: string; reviewCount: string; averageRating: string }>();

    for (const row of rows) {
      map.set(row.courseId, {
        reviewCount: Number(row.reviewCount),
        averageRating: Math.round(Number(row.averageRating) * 10) / 10,
      });
    }
    return map;
  }

  private async courseBySlug(slug: string): Promise<Course> {
    const course = await this.courseRepo.findOne({ where: { slug } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");
    return course;
  }

  private toContract(review: Review): ReviewRecord {
    return {
      id: review.id,
      courseId: review.courseId,
      userId: review.userId,
      user: {
        id: review.user.id,
        fullName: review.user.fullName,
        avatarUrl: review.user.avatarUrl,
      },
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    };
  }
}
