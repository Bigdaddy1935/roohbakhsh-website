import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../auth/entities/user.entity";
import { Course } from "../courses/entities/course.entity";
import { Article } from "../articles/entities/article.entity";
import { Order } from "../orders/entities/order.entity";
import { Ticket } from "../tickets/entities/ticket.entity";
import { Review } from "../reviews/entities/review.entity";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, Article, Order, Ticket, Review])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
