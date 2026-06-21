import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { LANG_HEADER } from "../../common/swagger/lang-header";
import { RolesGuard, Roles } from "../../common/guards/roles.guard";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@ApiTags("Orders")
@ApiHeader(LANG_HEADER)
@ApiBearerAuth()
@Controller("orders")
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: "Create order from cart",
    description: "Converts current cart into an order. Applies coupon if provided. Clears the cart on success.",
  })
  @ApiResponse({ status: 201, description: "Order created — status is 'pending' until payment" })
  @ApiResponse({ status: 400, description: "CART_EMPTY | COUPON_EXPIRED_OR_EXHAUSTED | MIXED_CURRENCIES" })
  create(@Request() req: { user: { id: string } }, @Body() dto: CreateOrderDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get("mine")
  @ApiOperation({ summary: "List current user orders", description: "Paginated list of own orders" })
  @ApiResponse({ status: 200, description: "Paginated order list" })
  findMine(@Request() req: { user: { id: string } }, @Query() query: PaginationDto) {
    return this.service.findMine(req.user.id, query.page ?? 1, query.limit ?? 12);
  }

  @Get("mine/:id")
  @ApiOperation({ summary: "Get order detail", description: "Returns order only if it belongs to current user" })
  @ApiParam({ name: "id", description: "Order UUID" })
  @ApiResponse({ status: 200, description: "Order found" })
  @ApiResponse({ status: 403, description: "FORBIDDEN — order belongs to another user" })
  @ApiResponse({ status: 404, description: "ORDER_NOT_FOUND" })
  findOne(@Request() req: { user: { id: string } }, @Param("id") id: string) {
    return this.service.findOne(id, req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles("admin")
  @ApiOperation({ summary: "List all orders (admin)", description: "Admin only — paginated" })
  @ApiResponse({ status: 200, description: "Paginated orders" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query.page ?? 1, query.limit ?? 12);
  }
}
