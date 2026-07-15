import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import type { MediaCategory, MediaItem as MediaItemContract, MediaListResponse } from "@roohbakhsh/shared";
import { FtpUploaderService } from "../../common/ftp/ftp-uploader.service";
import { EnvConfig } from "../../config/env";
import { MediaItem } from "./entities/media-item.entity";
import { UploadMediaDto } from "./dto/upload-media.dto";

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaItem)
    private readonly repo: Repository<MediaItem>,
    private readonly ftpUploader: FtpUploaderService,
    private readonly config: ConfigService<EnvConfig>,
  ) {}

  async upload(file: Express.Multer.File, dto: UploadMediaDto): Promise<MediaItemContract> {
    const dir = this.config.get("FTP_MEDIA_DIR", { infer: true })!;
    // multer encodes non-ASCII filenames as latin1; convert back to utf-8
    const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
    const url = await this.ftpUploader.upload(file.buffer, originalName, dir);

    const item = this.repo.create({
      url,
      filename: url.split("/").pop()!,
      originalName,
      category: dto.category ?? "other",
      locale: dto.locale ?? "ar",
      size: file.size,
    });

    return this.toContract(await this.repo.save(item));
  }

  async findAll(category?: MediaCategory, locale?: "ar" | "ur"): Promise<MediaListResponse> {
    const where: Partial<MediaItem> = {};
    if (category) where.category = category;
    if (locale) where.locale = locale;

    const [items, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: "DESC" },
    });

    return { items: items.map(this.toContract), total };
  }

  async remove(id: string): Promise<void> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException("MEDIA_ITEM_NOT_FOUND");
    await this.repo.remove(item);
  }

  private toContract(item: MediaItem): MediaItemContract {
    return {
      id: item.id,
      url: item.url,
      filename: item.filename,
      originalName: item.originalName,
      category: item.category,
      locale: item.locale,
      size: item.size,
      createdAt: item.createdAt.toISOString(),
    };
  }
}
