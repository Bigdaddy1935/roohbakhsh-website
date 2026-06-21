import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TreeRepository } from "typeorm";
import type { Category as CategoryContract, CategoryTree } from "@roohbakhsh/shared";
import { Category } from "./entities/category.entity";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: TreeRepository<Category>,
  ) {}

  // ── Read ──────────────────────────────────────────────────────────────────

  async findAll(): Promise<CategoryContract[]> {
    const all = await this.repo.find({ order: { order: "ASC" } });
    return all.map(this.toContract);
  }

  async findTree(): Promise<CategoryTree[]> {
    const roots = await this.repo.findTrees({ relations: [] });
    return roots.map(this.toTree.bind(this));
  }

  async findOne(id: string): Promise<CategoryContract> {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException("CATEGORY_NOT_FOUND");
    return this.toContract(cat);
  }

  async findOneWithChildren(id: string): Promise<CategoryTree> {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException("CATEGORY_NOT_FOUND");
    const tree = await this.repo.findDescendantsTree(cat);
    return this.toTree(tree);
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
      order: dto.order ?? 0,
      parent,
      parentId: parent?.id ?? null,
    });
    return this.toContract(await this.repo.save(cat));
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
    if (dto.order !== undefined) cat.order = dto.order;

    return this.toContract(await this.repo.save(cat));
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

  private toContract(cat: Category): CategoryContract {
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      parentId: cat.parentId,
      order: cat.order,
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString(),
    };
  }

  private toTree(cat: Category): CategoryTree {
    return {
      ...this.toContract(cat),
      children: (cat.children ?? [])
        .sort((a, b) => a.order - b.order)
        .map(this.toTree.bind(this)),
    };
  }
}
