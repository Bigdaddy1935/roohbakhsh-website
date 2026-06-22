import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { ArticleRecord, Paginated } from "@roohbakhsh/shared";
import { toPaginated } from "../../common/utils/paginate";
import { Article } from "./entities/article.entity";
import { Instructor } from "../instructor/entities/instructor.entity";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly repo: Repository<Article>,
    @InjectRepository(Instructor)
    private readonly instructorRepo: Repository<Instructor>,
  ) {}

  async create(dto: CreateArticleDto): Promise<ArticleRecord> {
    const existing = await this.repo.findOne({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException("SLUG_ALREADY_EXISTS");

    const instructor = await this.instructorRepo.findOne({ where: { id: dto.instructorId } });
    if (!instructor) throw new NotFoundException("INSTRUCTOR_NOT_FOUND");

    const article = this.repo.create({
      title: dto.title,
      slug: dto.slug,
      summary: dto.summary,
      bodyAr: dto.body.ar,
      bodyUr: dto.body.ur,
      thumbnailUrl: dto.thumbnailUrl ?? null,
      instructorId: dto.instructorId,
      instructor,
      status: dto.status ?? "draft",
      publishedAt: dto.status === "published" ? new Date() : null,
    });

    const saved = await this.repo.save(article);
    return this.toContract(saved);
  }

  async findAll(page: number, limit: number): Promise<Paginated<ArticleRecord>> {
    const [items, total] = await this.repo.findAndCount({
      where: { status: "published" },
      relations: { instructor: true },
      order: { publishedAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((a) => this.toContract(a)), total, page, limit);
  }

  async findAllAdmin(page: number, limit: number): Promise<Paginated<ArticleRecord>> {
    const [items, total] = await this.repo.findAndCount({
      relations: { instructor: true },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    return toPaginated(items.map((a) => this.toContract(a)), total, page, limit);
  }

  async findBySlug(slug: string): Promise<ArticleRecord> {
    const article = await this.repo.findOne({
      where: { slug, status: "published" },
      relations: { instructor: true },
    });
    if (!article) throw new NotFoundException("ARTICLE_NOT_FOUND");
    return this.toContract(article);
  }

  async findOne(id: string): Promise<ArticleRecord> {
    const article = await this.repo.findOne({ where: { id }, relations: { instructor: true } });
    if (!article) throw new NotFoundException("ARTICLE_NOT_FOUND");
    return this.toContract(article);
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

    if (dto.title) article.title = dto.title;
    if (dto.summary) article.summary = dto.summary;
    if (dto.body) {
      article.bodyAr = dto.body.ar;
      article.bodyUr = dto.body.ur;
    }
    if (dto.thumbnailUrl !== undefined) article.thumbnailUrl = dto.thumbnailUrl ?? null;
    if (dto.status && dto.status !== article.status) {
      article.status = dto.status;
      if (dto.status === "published" && !article.publishedAt) {
        article.publishedAt = new Date();
      }
    }

    const saved = await this.repo.save(article);
    return this.toContract(saved);
  }

  async remove(id: string): Promise<void> {
    const article = await this.repo.findOne({ where: { id } });
    if (!article) throw new NotFoundException("ARTICLE_NOT_FOUND");
    await this.repo.remove(article);
  }

  private toContract(a: Article): ArticleRecord {
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
      status: a.status,
      publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    };
  }
}
