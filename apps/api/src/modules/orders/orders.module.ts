import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import { Course } from "../courses/entities/course.entity";
import { CartModule } from "../cart/cart.module";
import { CouponModule } from "../coupon/coupon.module";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Course]),
    CartModule,
    CouponModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
