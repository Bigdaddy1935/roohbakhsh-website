import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  Body,
  Request,
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
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { LANG_HEADER } from "../../common/swagger/lang-header";
import { Public } from "../auth/decorators/public.decorator";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { PaymentsService } from "./payments.service";
import { SubmitCardToCardDto } from "./dto/submit-card-to-card.dto";

@ApiTags("Payments")
@ApiHeader(LANG_HEADER)
@Controller("payments")
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post("initiate/:orderId")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Initiate payment for an order",
    description: "Creates a payment record and returns the ZarinPal gateway URL. Redirect user to `gatewayUrl`.",
  })
  @ApiParam({ name: "orderId", description: "Order UUID" })
  @ApiResponse({ status: 201, description: "Payment initiated — { paymentId, gatewayUrl }" })
  @ApiResponse({ status: 400, description: "ORDER_ALREADY_PAID | ORDER_NOT_PAYABLE" })
  @ApiResponse({ status: 404, description: "ORDER_NOT_FOUND" })
  initiate(
    @Request() req: { user: { id: string } },
    @Param("orderId") orderId: string,
  ) {
    return this.service.initiate(orderId, req.user.id);
  }

  @Get("verify")
  @Public()
  @ApiOperation({
    summary: "ZarinPal callback — verify payment",
    description: "ZarinPal redirects here after payment. Verifies with ZarinPal API and updates order status.",
  })
  @ApiQuery({ name: "Authority", required: true, description: "ZarinPal authority code" })
  @ApiQuery({ name: "Status", required: true, enum: ["OK", "NOK"], description: "Payment status from ZarinPal" })
  @ApiResponse({ status: 200, description: "Payment result — { message, refId? }" })
  @ApiResponse({ status: 404, description: "PAYMENT_NOT_FOUND" })
  verify(
    @Query("Authority") authority: string,
    @Query("Status") status: string,
  ) {
    return this.service.verify(authority, status);
  }

  @Get("logs")
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "Payment logs (admin)", description: "All payment records — admin only" })
  @ApiResponse({ status: 200, description: "Paginated payment logs" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  findLogs(@Query() query: PaginationDto) {
    return this.service.findLogs(query.page ?? 1, query.limit ?? 20);
  }

  @Get("mine")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Current user payment history" })
  @ApiResponse({ status: 200, description: "Paginated payment records" })
  findMine(@Request() req: { user: { id: string } }, @Query() query: PaginationDto) {
    return this.service.findMyPayments(req.user.id, query.page ?? 1, query.limit ?? 12);
  }

  // ────────────────────────── کارت‌به‌کارت ──────────────────────────

  @Get("manual/destination-info")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "اطلاعات حساب مقصد پرداخت کارت‌به‌کارت",
    description: "شماره کارت، شماره حساب، نام صاحب حساب و بانک مقصد آکادمی را برمی‌گرداند.",
  })
  @ApiResponse({ status: 200, description: "اطلاعات حساب مقصد" })
  getDestinationInfo() {
    return this.service.getDestinationAccount();
  }

  @Post("upload-receipt")
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: { type: "object", properties: { file: { type: "string", format: "binary" } } },
  })
  @ApiOperation({
    summary: "آپلود تصویر رسید پرداخت کارت‌به‌کارت",
    description: "تصویر روی FTP آپلود می‌شود و لینک عمومی آن برگردانده می‌شود.",
  })
  @ApiResponse({ status: 201, description: "لینک تصویر رسید" })
  @UseInterceptors(FileInterceptor("file"))
  uploadReceipt(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.service.uploadReceipt(file);
  }

  @Post("manual/:orderId")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "ثبت اطلاعات پرداخت کارت‌به‌کارت برای یک سفارش",
    description: "کد رهگیری، شماره کارت مبدأ و در صورت وجود لینک رسید ثبت می‌شود. پرداخت با وضعیت pending منتظر تأیید دستی ادمین می‌ماند.",
  })
  @ApiParam({ name: "orderId", description: "Order UUID" })
  @ApiResponse({ status: 201, description: "اطلاعات پرداخت ثبت شد" })
  @ApiResponse({ status: 400, description: "ORDER_ALREADY_PAID | ORDER_NOT_PAYABLE" })
  @ApiResponse({ status: 404, description: "ORDER_NOT_FOUND" })
  submitCardToCard(
    @Request() req: { user: { id: string } },
    @Param("orderId") orderId: string,
    @Body() dto: SubmitCardToCardDto,
  ) {
    return this.service.submitCardToCard(orderId, req.user.id, dto);
  }
}
