import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
  Redirect,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { LANG_HEADER } from "../../common/swagger/lang-header";
import { Public } from "../auth/decorators/public.decorator";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { PaymentsService } from "./payments.service";

@ApiTags("Payments")
@ApiHeader(LANG_HEADER)
@Controller("payments")
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post("initiate/:orderId")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Initiate payment for an order",
    description: "Creates a payment record and returns the gateway URL. Redirect user to `gatewayUrl`. (Gateway not configured yet — returns 503.)",
  })
  @ApiParam({ name: "orderId", description: "Order UUID" })
  @ApiResponse({ status: 201, description: "Payment initiated — { paymentId, gatewayUrl }" })
  @ApiResponse({ status: 400, description: "ORDER_ALREADY_PAID | ORDER_NOT_PAYABLE" })
  @ApiResponse({ status: 404, description: "ORDER_NOT_FOUND" })
  @ApiResponse({ status: 503, description: "PAYMENT_GATEWAY_NOT_CONFIGURED" })
  initiate(
    @Request() req: { user: { id: string } },
    @Param("orderId") orderId: string,
  ) {
    return this.service.initiate(orderId, req.user.id);
  }

  @Get("verify")
  @Public()
  @ApiOperation({
    summary: "Payment gateway callback — verify payment",
    description: "The payment gateway redirects here after payment. Verifies and updates order status. (Gateway not configured yet — returns 503.)",
  })
  @ApiQuery({ name: "Authority", required: true, description: "Gateway authority/reference code" })
  @ApiQuery({ name: "Status", required: true, enum: ["OK", "NOK"], description: "Payment status from gateway" })
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
}
