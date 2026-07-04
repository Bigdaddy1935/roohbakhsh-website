import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { MediaUploadResponse } from "@roohbakhsh/shared";
import { FtpUploaderService } from "../../common/ftp/ftp-uploader.service";
import { EnvConfig } from "../../config/env";

@Injectable()
export class MediaService {
  constructor(
    private readonly ftpUploader: FtpUploaderService,
    private readonly config: ConfigService<EnvConfig>,
  ) {}

  /** آپلود تصویر عمومی (کاور دوره، آواتار استاد و...) روی FTP — لینک عمومی برمی‌گرداند. */
  async upload(file: Express.Multer.File): Promise<MediaUploadResponse> {
    const dir = this.config.get("FTP_MEDIA_DIR", { infer: true })!;
    const url = await this.ftpUploader.upload(file.buffer, file.originalname, dir);
    return { url };
  }
}
