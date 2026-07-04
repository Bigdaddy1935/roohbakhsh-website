import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiHeader,
} from "@nestjs/swagger";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { LANG_HEADER } from "../../common/swagger/lang-header";
import { MediaService } from "./media.service";

@ApiTags("Media")
@ApiHeader(LANG_HEADER)
@Controller("media")
export class MediaController {
  constructor(private readonly service: MediaService) {}

  @Post("upload")
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: { type: "object", properties: { file: { type: "string", format: "binary" } } },
  })
  @ApiOperation({
    summary: "[Admin] آپلود تصویر عمومی",
    description: "برای کاور دوره، آواتار استاد و مواردی از این دست — تصویر روی FTP آپلود می‌شود و لینک عمومی آن برگردانده می‌شود.",
  })
  @ApiResponse({ status: 201, description: "لینک تصویر آپلودشده" })
  @ApiResponse({ status: 403, description: "فقط admin" })
  @UseInterceptors(FileInterceptor("file"))
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.service.upload(file);
  }
}
