import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TreeRepository, Repository } from "typeorm";
import type { Category as CategoryContract, CategoryTree } from "@roohbakhsh/shared";
import { Category } from "./entities/category.entity";
import { Course } from "../courses/entities/course.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: TreeRepository<Category>,
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
  ) {}

  // ── Read ──────────────────────────────────────────────────────────────────

  async findAll(): Promise<CategoryContract[]> {
    const all = await this.repo.find({ order: { order: "ASC" } });
    const counts = await this.courseCounts();
    return all.map((c) => this.toContract(c, counts));
  }

  async findTree(): Promise<CategoryTree[]> {
    const roots = await this.repo.findTrees({ relations: [] });
    const counts = await this.courseCounts();
    return roots.map((r) => this.toTree(r, counts));
  }

  async findOne(id: string): Promise<CategoryContract> {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException("CATEGORY_NOT_FOUND");
    const counts = await this.courseCounts();
    return this.toContract(cat, counts);
  }

  async findOneWithChildren(id: string): Promise<CategoryTree> {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException("CATEGORY_NOT_FOUND");
    const tree = await this.repo.findDescendantsTree(cat);
    const counts = await this.courseCounts();
    return this.toTree(tree, counts);
  }

  // ── Write ─────────────────────────────────────────────────────────────────

  async create(dto: CreateCategoryDto): Promise<CategoryContract> {
    await this.assertSlugUnique(dto.slug);

    let parent: Category | null = null;
    if (dto.parentId) {
      parent = await this.repo.findOne({ where: { id: dto.parentId } });
      if (!parent) throw new NotFoundException("PARENT_CATEGORY_NOT_FOUND");
    }

    const cat = this.repo.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description ?? null,
      thumbnailUrl: dto.thumbnailUrl ?? null,
      order: dto.order ?? 0,
      parent,
      parentId: parent?.id ?? null,
    });
    const saved = await this.repo.save(cat);
    return this.toContract(saved, new Map());
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryContract> {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException("CATEGORY_NOT_FOUND");

    if (dto.slug && dto.slug !== cat.slug) {
      await this.assertSlugUnique(dto.slug);
    }

    if (dto.parentId !== undefined) {
      if (dto.parentId === id) throw new BadRequestException("CANNOT_SET_SELF_AS_PARENT");
      if (dto.parentId) {
        const parent = await this.repo.findOne({ where: { id: dto.parentId } });
        if (!parent) throw new NotFoundException("PARENT_CATEGORY_NOT_FOUND");
        // جلوگیری از حلقه: بررسی اینکه والد جدید زیردسته‌ی فعلی نباشد
        const descendants = await this.repo.findDescendants(cat);
        if (descendants.some((d) => d.id === dto.parentId)) {
          throw new BadRequestException("CIRCULAR_PARENT_REFERENCE");
        }
        cat.parent = parent;
        cat.parentId = parent.id;
      } else {
        cat.parent = null;
        cat.parentId = null;
      }
    }

    if (dto.name) cat.name = dto.name;
    if (dto.slug) cat.slug = dto.slug;
    if (dto.description !== undefined) cat.description = dto.description ?? null;
    if (dto.thumbnailUrl !== undefined) cat.thumbnailUrl = dto.thumbnailUrl ?? null;
    if (dto.order !== undefined) cat.order = dto.order;

    const saved = await this.repo.save(cat);
    const counts = await this.courseCounts();
    return this.toContract(saved, counts);
  }

  async remove(id: string): Promise<void> {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException("CATEGORY_NOT_FOUND");

    const children = await this.repo.findDescendants(cat);
    // findDescendants شامل خود cat هم میشه — بیشتر از ۱ یعنی فرزند داره
    if (children.length > 1) throw new BadRequestException("CATEGORY_HAS_CHILDREN");

    await this.repo.remove(cat);
  }

  // ── helpers ───────────────────────────────────────────────────────────────

  private async assertSlugUnique(slug: string): Promise<void> {
    const exists = await this.repo.findOne({ where: { slug } });
    if (exists) throw new ConflictException("SLUG_TAKEN");
  }

  /** تعداد دوره‌های هر دسته را مستقیماً از جدول courses محاسبه می‌کند (denormalize نشده). */
  private async courseCounts(): Promise<Map<string, number>> {
    const rows = await this.courseRepo
      .createQueryBuilder("course")
      .select("course.categoryId", "categoryId")
      .addSelect("COUNT(*)", "courseCount")
      .where("course.categoryId IS NOT NULL")
      .groupBy("course.categoryId")
      .getRawMany<{ categoryId: string; courseCount: string }>();

    const map = new Map<string, number>();
    for (const row of rows) {
      map.set(row.categoryId, Number(row.courseCount));
    }
    return map;
  }

  private toContract(cat: Category, counts: Map<string, number>): CategoryContract {
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      thumbnailUrl: cat.thumbnailUrl ?? { ar: null, ur: null },
      parentId: cat.parentId,
      order: cat.order,
      courseCount: counts.get(cat.id) ?? 0,
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString(),
    };
  }

  private toTree(cat: Category, counts: Map<string, number>): CategoryTree {
    return {
      ...this.toContract(cat, counts),
      children: (cat.children ?? [])
        .sort((a, b) => a.order - b.order)
        .map((c) => this.toTree(c, counts)),
    };
  }
}
