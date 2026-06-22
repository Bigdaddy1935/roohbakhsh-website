import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Coupon } from "./entities/coupon.entity";
import { NotificationsModule } from "../notifications/notifications.module";
import { CouponService } from "./coupon.service";
import { CouponController } from "./coupon.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Coupon]), NotificationsModule],
  controllers: [CouponController],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
