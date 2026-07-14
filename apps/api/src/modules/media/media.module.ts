import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { MediaItem } from "./entities/media-item.entity";
import { FtpUploaderService } from "../../common/ftp/ftp-uploader.service";

@Module({
  imports: [TypeOrmModule.forFeature([MediaItem])],
  controllers: [MediaController],
  providers: [MediaService, FtpUploaderService],
})
export class MediaModule {}
