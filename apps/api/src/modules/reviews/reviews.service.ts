import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { ReviewRecord, ReviewWithTarget, Paginated, CourseRatingSummary } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Review } from "./entities/review.entity";
import { Course } from "../courses/entities/course.entity";
import { Article } from "../articles/entities/article.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly repo: Repository<Review>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  // ── دوره‌ها ───────────────────────────────────────────────────────────────

  async createForCourse(courseSlug: string, userId: string, dto: CreateReviewDto): Promise<ReviewRecord> {
    const course = await this.courseBySlug(courseSlug);
    const existing = await this.repo.findOne({ where: { courseId: course.id, userId } });
    if (existing) throw new ConflictException("REVIEW_ALREADY_EXISTS");

    const saved = await this.repo.save(
      this.repo.create({ courseId: course.id, userId, rating: dto.rating, comment: dto.comment ?? null }),
    );
    return this.toContract(await this.withUser(saved.id));
  }

  async findByCourse(courseSlug: string, page: number, limit: number): Promise<Paginated<ReviewRecord>> {
    const course = await this.courseBySlug(courseSlug);
    return this.findPaginated({ courseId: course.id }, page, limit);
  }

  async updateCourseReview(courseSlug: string, reviewId: string, userId: string, dto: UpdateReviewDto): Promise<ReviewRecord> {
    const course = await this.courseBySlug(courseSlug);
    return this.updateOwnReview({ id: reviewId, courseId: course.id }, userId, dto);
  }

  async removeCourseReview(courseSlug: string, reviewId: string, userId: string, isAdmin: boolean): Promise<void> {
    const course = await this.courseBySlug(courseSlug);
    await this.removeOwnReview({ id: reviewId, courseId: course.id }, userId, isAdmin);
  }

  /** میانگین امتیاز و تعداد نظرات یک دوره — برای نمایش در CourseRecord. */
  async ratingSummary(courseId: string): Promise<CourseRatingSummary> {
    return this.summaryFor({ courseId });
  }

  /** میانگین امتیاز چند دوره با یک کوئری گروه‌بندی‌شده — برای لیست دوره‌ها (بدون N+1). */
  async ratingSummaries(courseIds: string[]): Promise<Map<string, CourseRatingSummary>> {
    return this.summariesFor("courseId", courseIds);
  }

  // ── مقالات ────────────────────────────────────────────────────────────────

  async createForArticle(articleSlug: string, userId: string, dto: CreateReviewDto): Promise<ReviewRecord> {
    const article = await this.articleBySlug(articleSlug);
    const existing = await this.repo.findOne({ where: { articleId: article.id, userId } });
    if (existing) throw new ConflictException("REVIEW_ALREADY_EXISTS");

    const saved = await this.repo.save(
      this.repo.create({ articleId: article.id, userId, rating: dto.rating, comment: dto.comment ?? null }),
    );
    return this.toContract(await this.withUser(saved.id));
  }

  async findByArticle(articleSlug: string, page: number, limit: number): Promise<Paginated<ReviewRecord>> {
    const article = await this.articleBySlug(articleSlug);
    return this.findPaginated({ articleId: article.id }, page, limit);
  }

  async updateArticleReview(articleSlug: string, reviewId: string, userId: string, dto: UpdateReviewDto): Promise<ReviewRecord> {
    const article = await this.articleBySlug(articleSlug);
    return this.updateOwnReview({ id: reviewId, articleId: article.id }, userId, dto);
  }

  async removeArticleReview(articleSlug: string, reviewId: string, userId: string, isAdmin: boolean): Promise<void> {
    const article = await this.articleBySlug(articleSlug);
    await this.removeOwnReview({ id: reviewId, articleId: article.id }, userId, isAdmin);
  }

  /** میانگین امتیاز و تعداد نظرات یک مقاله — برای نمایش در ArticleRecord. */
  async articleRatingSummary(articleId: string): Promise<CourseRatingSummary> {
    return this.summaryFor({ articleId });
  }

  /** میانگین امتیاز چند مقاله با یک کوئری گروه‌بندی‌شده — برای لیست مقالات (بدون N+1). */
  async articleRatingSummaries(articleIds: string[]): Promise<Map<string, CourseRatingSummary>> {
    return this.summariesFor("articleId", articleIds);
  }

  // ── همه‌ی نظرات (دوره + مقاله) ───────────────────────────────────────────

  /** کل نظرات (دوره و مقاله با هم) به‌همراه اطلاعات هدف هر نظر — صفحه‌بندی‌شده. */
  async findAll(page: number, limit: number): Promise<Paginated<ReviewWithTarget>> {
    const [items, total] = await this.repo.findAndCount({
      relations: { user: true, course: true, article: true },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((r) => this.toContractWithTarget(r)), total, page, limit);
  }

  // ── منطق مشترک ────────────────────────────────────────────────────────────

  private async findPaginated(
    where: { courseId: string } | { articleId: string },
    page: number,
    limit: number,
  ): Promise<Paginated<ReviewRecord>> {
    const [items, total] = await this.repo.findAndCount({
      where,
      relations: { user: true },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((r) => this.toContract(r)), total, page, limit);
  }

  private async updateOwnReview(
    where: { id: string; courseId: string } | { id: string; articleId: string },
    userId: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewRecord> {
    const review = await this.repo.findOne({ where, relations: { user: true } });
    if (!review) throw new NotFoundException("REVIEW_NOT_FOUND");
    if (review.userId !== userId) throw new ForbiddenException("NOT_REVIEW_OWNER");

    if (dto.rating !== undefined) review.rating = dto.rating;
    if (dto.comment !== undefined) review.comment = dto.comment ?? null;

    return this.toContract(await this.repo.save(review));
  }

  private async removeOwnReview(
    where: { id: string; courseId: string } | { id: string; articleId: string },
    userId: string,
    isAdmin: boolean,
  ): Promise<void> {
    const review = await this.repo.findOne({ where });
    if (!review) throw new NotFoundException("REVIEW_NOT_FOUND");
    if (review.userId !== userId && !isAdmin) throw new ForbiddenException("NOT_REVIEW_OWNER");
    await this.repo.remove(review);
  }

  private async summaryFor(where: { courseId: string } | { articleId: string }): Promise<CourseRatingSummary> {
    const reviews = await this.repo.find({ where });
    if (reviews.length === 0) return { averageRating: null, reviewCount: 0 };

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return {
      averageRating: Math.round((sum / reviews.length) * 10) / 10,
      reviewCount: reviews.length,
    };
  }

  private async summariesFor(
    column: "courseId" | "articleId",
    ids: string[],
  ): Promise<Map<string, CourseRatingSummary>> {
    const map = new Map<string, CourseRatingSummary>();
    if (ids.length === 0) return map;

    const dbColumn = column === "courseId" ? "review.courseId" : "review.articleId";
    const rows = await this.repo
      .createQueryBuilder("review")
      .select(dbColumn, "targetId")
      .addSelect("COUNT(*)", "reviewCount")
      .addSelect("AVG(review.rating)", "averageRating")
      .where(`${dbColumn} IN (:...ids)`, { ids })
      .groupBy(dbColumn)
      .getRawMany<{ targetId: string; reviewCount: string; averageRating: string }>();

    for (const row of rows) {
      map.set(row.targetId, {
        reviewCount: Number(row.reviewCount),
        averageRating: Math.round(Number(row.averageRating) * 10) / 10,
      });
    }
    return map;
  }

  private async withUser(id: string): Promise<Review> {
    return (await this.repo.findOne({ where: { id }, relations: { user: true } }))!;
  }

  private async courseBySlug(slug: string): Promise<Course> {
    const course = await this.courseRepo.findOne({ where: { slug } });
    if (!course) throw new NotFoundException("COURSE_NOT_FOUND");
    return course;
  }

  private async articleBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepo.findOne({ where: { slug } });
    if (!article) throw new NotFoundException("ARTICLE_NOT_FOUND");
    return article;
  }

  private toContract(review: Review): ReviewRecord {
    return {
      id: review.id,
      courseId: review.courseId,
      articleId: review.articleId,
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

  private toContractWithTarget(review: Review): ReviewWithTarget {
    const target = review.course
      ? { type: "course" as const, id: review.course.id, slug: review.course.slug, title: review.course.title }
      : { type: "article" as const, id: review.article!.id, slug: review.article!.slug, title: review.article!.title };

    return { ...this.toContract(review), target };
  }
}
