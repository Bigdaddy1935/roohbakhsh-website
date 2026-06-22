import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { ArticleRecord, Paginated, CourseRatingSummary } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Article } from "./entities/article.entity";
import { Instructor } from "../instructor/entities/instructor.entity";
import { Category } from "../category/entities/category.entity";
import { ReviewsService } from "../reviews/reviews.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";

const EMPTY_RATING: CourseRatingSummary = { averageRating: null, reviewCount: 0 };

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly repo: Repository<Article>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly reviewsService: ReviewsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateArticleDto): Promise<ArticleRecord> {
    const existing = await this.repo.findOne({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException("SLUG_ALREADY_EXISTS");

    const instructor = await this.instructorRepo.findOne({ where: { id: dto.instructorId } });
    if (!instructor) throw new NotFoundException("INSTRUCTOR_NOT_FOUND");

    if (dto.categoryId) {
      const cat = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!cat) throw new NotFoundException("CATEGORY_NOT_FOUND");
    }

    const article = this.repo.create({
      title: dto.title,
      slug: dto.slug,
      summary: dto.summary,
      bodyAr: dto.body.ar,
      bodyUr: dto.body.ur,
      thumbnailUrl: dto.thumbnailUrl ?? null,
      instructorId: dto.instructorId,
      instructor,
      categoryId: dto.categoryId ?? null,
      status: dto.status ?? "draft",
      publishedAt: dto.status === "published" ? new Date() : null,
    });

    const saved = await this.repo.save(article);
    if (saved.status === "published") {
      await this.notificationsService.create("article", saved.id);
    }
    return this.toContract(saved, EMPTY_RATING);
  }

  async findAll(page: number, limit: number): Promise<Paginated<ArticleRecord>> {
    const [items, total] = await this.repo.findAndCount({
      where: { status: "published" },
      relations: { instructor: true },
      order: { publishedAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    const ratings = await this.reviewsService.articleRatingSummaries(items.map((a) => a.id));
    return toPaginated(
      items.map((a) => this.toContract(a, ratings.get(a.id) ?? EMPTY_RATING)),
      total,
      page,
      limit,
    );
  }

  async findAllAdmin(page: number, limit: number): Promise<Paginated<ArticleRecord>> {
    const [items, total] = await this.repo.findAndCount({
      relations: { instructor: true },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    const ratings = await this.reviewsService.articleRatingSummaries(items.map((a) => a.id));
    return toPaginated(
      items.map((a) => this.toContract(a, ratings.get(a.id) ?? EMPTY_RATING)),
      total,
      page,
      limit,
    );
  }

  async findBySlug(slug: string): Promise<ArticleRecord> {
    const article = await this.repo.findOne({
      where: { slug, status: "published" },
      relations: { instructor: true },
    });
    if (!article) throw new NotFoundException("ARTICLE_NOT_FOUND");
    const rating = await this.reviewsService.articleRatingSummary(article.id);
    return this.toContract(article, rating);
  }

  async findOne(id: string): Promise<ArticleRecord> {
    const article = await this.repo.findOne({ where: { id }, relations: { instructor: true } });
    if (!article) throw new NotFoundException("ARTICLE_NOT_FOUND");
    const rating = await this.reviewsService.articleRatingSummary(article.id);
    return this.toContract(article, rating);
  }

  async update(id: string, dto: UpdateArticleDto): Promise<ArticleRecord> {
    const article = await this.repo.findOne({ where: { id }, relations: { instructor: true } });
    if (!article) throw new NotFoundException("ARTICLE_NOT_FOUND");

    if (dto.slug && dto.slug !== article.slug) {
      const conflict = await this.repo.findOne({ where: { slug: dto.slug } });
      if (conflict) throw new ConflictException("SLUG_ALREADY_EXISTS");
      article.slug = dto.slug;
    }

    if (dto.instructorId && dto.instructorId !== article.instructorId) {
      const instructor = await this.instructorRepo.findOne({ where: { id: dto.instructorId } });
      if (!instructor) throw new NotFoundException("INSTRUCTOR_NOT_FOUND");
      article.instructor = instructor;
      article.instructorId = dto.instructorId;
    }

    if (dto.categoryId !== undefined) {
      if (dto.categoryId) {
        const cat = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
        if (!cat) throw new NotFoundException("CATEGORY_NOT_FOUND");
      }
      article.categoryId = dto.categoryId ?? null;
    }

    if (dto.title) article.title = dto.title;
    if (dto.summary) article.summary = dto.summary;
    if (dto.body) {
      article.bodyAr = dto.body.ar;
      article.bodyUr = dto.body.ur;
    }
    if (dto.thumbnailUrl !== undefined) article.thumbnailUrl = dto.thumbnailUrl ?? null;
    const wasPublished = article.status === "published";
    if (dto.status && dto.status !== article.status) {
      article.status = dto.status;
      if (dto.status === "published" && !article.publishedAt) {
        article.publishedAt = new Date();
      }
    }

    const saved = await this.repo.save(article);
    if (!wasPublished && saved.status === "published") {
      await this.notificationsService.create("article", saved.id);
    }
    const rating = await this.reviewsService.articleRatingSummary(saved.id);
    return this.toContract(saved, rating);
  }

  async remove(id: string): Promise<void> {
    const article = await this.repo.findOne({ where: { id } });
    if (!article) throw new NotFoundException("ARTICLE_NOT_FOUND");
    await this.repo.remove(article);
  }

  private toContract(a: Article, rating: CourseRatingSummary): ArticleRecord {
    return {
      id: a.id,
      title: a.title,
      slug: a.slug,
      summary: a.summary,
      body: { ar: a.bodyAr, ur: a.bodyUr },
      thumbnailUrl: a.thumbnailUrl ?? { ar: null, ur: null },
      instructorId: a.instructorId,
      instructor: {
        id: a.instructor.id,
        slug: a.instructor.slug,
        name: a.instructor.name,
        avatarUrl: a.instructor.avatarUrl,
      },
      categoryId: a.categoryId,
      averageRating: rating.averageRating,
      reviewCount: rating.reviewCount,
      status: a.status,
      publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    };
  }
}
