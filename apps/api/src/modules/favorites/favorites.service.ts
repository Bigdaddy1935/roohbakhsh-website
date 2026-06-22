import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { FavoriteItem, FavoriteStatus, Paginated } from "@roohbakhsh/shared";
import { Favorite } from "./entities/favorite.entity";
import { Course } from "../courses/entities/course.entity";
import { Article } from "../articles/entities/article.entity";
import { ToggleFavoriteDto } from "./dto/toggle-favorite.dto";
import { toPaginated } from "../../common/utils/paginate";

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly repo: Repository<Favorite>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  /** اضافه/حذف از علاقه‌مندی‌ها — هر بار صدا زدن وضعیت را toggle می‌کند. */
  async toggle(userId: string, dto: ToggleFavoriteDto): Promise<FavoriteStatus> {
    if (dto.type === "course") {
      const exists = await this.courseRepo.findOne({ where: { id: dto.id } });
      if (!exists) throw new NotFoundException("COURSE_NOT_FOUND");
    } else {
      const exists = await this.articleRepo.findOne({ where: { id: dto.id } });
      if (!exists) throw new NotFoundException("ARTICLE_NOT_FOUND");
    }

    const existing = await this.repo.findOne({
      where: { userId, type: dto.type, targetId: dto.id },
    });
    if (existing) {
      await this.repo.remove(existing);
      return { isFavorite: false };
    }
    await this.repo.save(this.repo.create({ userId, type: dto.type, targetId: dto.id }));
    return { isFavorite: true };
  }

  /** لیست علاقه‌مندی‌های کاربر — برای داشبورد (بدون صفحه‌بندی، فقط حداکثر N مورد). */
  async findMine(userId: string, limit?: number): Promise<FavoriteItem[]> {
    const favorites = await this.repo.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
    });
    return this.toItems(favorites);
  }

  /** لیست صفحه‌بندی‌شده‌ی علاقه‌مندی‌ها — برای صفحه‌ی «علاقه‌مندی‌های من». */
  async findMinePaginated(userId: string, page: number, limit: number): Promise<Paginated<FavoriteItem>> {
    const [favorites, total] = await this.repo.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
      skip: (page - 1) * limit,
    });
    const items = await this.toItems(favorites);
    return toPaginated(items, total, page, limit);
  }

  private async toItems(favorites: Favorite[]): Promise<FavoriteItem[]> {
    if (favorites.length === 0) return [];

    const courseIds = favorites.filter((f) => f.type === "course").map((f) => f.targetId);
    const articleIds = favorites.filter((f) => f.type === "article").map((f) => f.targetId);

    const [courses, articles] = await Promise.all([
      courseIds.length
        ? this.courseRepo.find({ where: courseIds.map((id) => ({ id })) })
        : Promise.resolve([]),
      articleIds.length
        ? this.articleRepo.find({ where: articleIds.map((id) => ({ id })) })
        : Promise.resolve([]),
    ]);
    const courseMap = new Map(courses.map((c) => [c.id, c]));
    const articleMap = new Map(articles.map((a) => [a.id, a]));

    const items: FavoriteItem[] = [];
    for (const fav of favorites) {
      if (fav.type === "course") {
        const course = courseMap.get(fav.targetId);
        if (!course) continue;
        items.push({
          type: "course",
          id: course.id,
          slug: course.slug,
          title: course.title,
          thumbnailUrl: course.thumbnailUrl ?? { ar: null, ur: null },
          createdAt: fav.createdAt.toISOString(),
        });
      } else {
        const article = articleMap.get(fav.targetId);
        if (!article) continue;
        items.push({
          type: "article",
          id: article.id,
          slug: article.slug,
          title: article.title,
          thumbnailUrl: article.thumbnailUrl ?? { ar: null, ur: null },
          createdAt: fav.createdAt.toISOString(),
        });
      }
    }
    return items;
  }
}
