import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { InstructorRecord } from "@roohbakhsh/shared";
import { Instructor } from "./entities/instructor.entity";
import { CreateInstructorDto } from "./dto/create-instructor.dto";
import { UpdateInstructorDto } from "./dto/update-instructor.dto";

@Injectable()
export class InstructorService {
  constructor(
    @InjectRepository(Instructor)
    private readonly repo: Repository<Instructor>,
  ) {}

  async findAll(): Promise<InstructorRecord[]> {
    const all = await this.repo.find({ order: { createdAt: "DESC" } });
    return all.map(this.toContract);
  }

  async findOne(id: string): Promise<InstructorRecord> {
    const inst = await this.repo.findOne({ where: { id } });
    if (!inst) throw new NotFoundException("INSTRUCTOR_NOT_FOUND");
    return this.toContract(inst);
  }

  async create(dto: CreateInstructorDto): Promise<InstructorRecord> {
    await this.assertSlugUnique(dto.slug);
    const inst = this.repo.create({
      name: dto.name,
      slug: dto.slug,
      avatarUrl: dto.avatarUrl,
      bio: dto.bio ?? null,
    });
    return this.toContract(await this.repo.save(inst));
  }

  async update(id: string, dto: UpdateInstructorDto): Promise<InstructorRecord> {
    const inst = await this.repo.findOne({ where: { id } });
    if (!inst) throw new NotFoundException("INSTRUCTOR_NOT_FOUND");

    if (dto.slug && dto.slug !== inst.slug) {
      await this.assertSlugUnique(dto.slug);
    }

    if (dto.name !== undefined) inst.name = dto.name;
    if (dto.slug !== undefined) inst.slug = dto.slug;
    if (dto.avatarUrl !== undefined) inst.avatarUrl = dto.avatarUrl;
    if (dto.bio !== undefined) inst.bio = dto.bio ?? null;

    return this.toContract(await this.repo.save(inst));
  }

  async remove(id: string): Promise<void> {
    const inst = await this.repo.findOne({ where: { id } });
    if (!inst) throw new NotFoundException("INSTRUCTOR_NOT_FOUND");
    await this.repo.remove(inst);
  }

  private async assertSlugUnique(slug: string): Promise<void> {
    const exists = await this.repo.findOne({ where: { slug } });
    if (exists) throw new ConflictException("INSTRUCTOR_SLUG_TAKEN");
  }

  private toContract(inst: Instructor): InstructorRecord {
    return {
      id: inst.id,
      name: inst.name,
      slug: inst.slug,
      avatarUrl: inst.avatarUrl,
      bio: inst.bio,
      createdAt: inst.createdAt.toISOString(),
      updatedAt: inst.updatedAt.toISOString(),
    };
  }
}
