import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Request,
  HttpCode,
  HttpStatus,
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
import { CartService } from "./cart.service";
import { AddToCartDto } from "./dto/add-to-cart.dto";

@ApiTags("Cart")
@ApiHeader(LANG_HEADER)
@ApiBearerAuth()
@Controller("cart")
export class CartController {
  constructor(private readonly service: CartService) {}

  @Get()
  @ApiOperation({ summary: "Get current user cart", description: "Returns all cart items with computed effective price and total" })
  @ApiResponse({ status: 200, description: "Cart contents" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getCart(@Request() req: { user: { id: string } }) {
    return this.service.getCart(req.user.id);
  }

  @Post("items")
  @ApiOperation({ summary: "Add a course to cart", description: "Fails if course already in cart" })
  @ApiResponse({ status: 201, description: "Item added — returns updated cart" })
  @ApiResponse({ status: 404, description: "COURSE_NOT_FOUND" })
  @ApiResponse({ status: 409, description: "COURSE_ALREADY_IN_CART" })
  addItem(@Request() req: { user: { id: string } }, @Body() dto: AddToCartDto) {
    return this.service.addItem(req.user.id, dto);
  }

  @Delete("items/:courseId")
  @ApiOperation({ summary: "Remove a course from cart" })
  @ApiParam({ name: "courseId", description: "Course UUID" })
  @ApiResponse({ status: 200, description: "Item removed — returns updated cart" })
  @ApiResponse({ status: 404, description: "CART_ITEM_NOT_FOUND" })
  removeItem(
    @Request() req: { user: { id: string } },
    @Param("courseId") courseId: string,
  ) {
    return this.service.removeItem(req.user.id, courseId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Clear entire cart" })
  @ApiResponse({ status: 204, description: "Cart cleared" })
  clearCart(@Request() req: { user: { id: string } }) {
    return this.service.clearCart(req.user.id);
  }
}
