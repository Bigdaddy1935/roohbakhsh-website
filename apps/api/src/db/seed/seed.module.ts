import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../modules/auth/entities/user.entity";
import { Instructor } from "../../modules/instructor/entities/instructor.entity";
import { Category } from "../../modules/category/entities/category.entity";
import { Coupon } from "../../modules/coupon/entities/coupon.entity";
import { Course } from "../../modules/courses/entities/course.entity";
import { Section } from "../../modules/courses/entities/section.entity";
import { Lesson } from "../../modules/courses/entities/lesson.entity";
import { Article } from "../../modules/articles/entities/article.entity";
import { Review } from "../../modules/reviews/entities/review.entity";
import { Ticket } from "../../modules/tickets/entities/ticket.entity";
import { TicketMessage } from "../../modules/tickets/entities/ticket-message.entity";
import { RecentView } from "../../modules/recently-viewed/entities/recent-view.entity";
import { Favorite } from "../../modules/favorites/entities/favorite.entity";
import { LessonProgress } from "../../modules/progress/entities/lesson-progress.entity";
import { SeedService } from "./seed.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Instructor,
      Category,
      Coupon,
      Course,
      Section,
      Lesson,
      Article,
      Review,
      Ticket,
      TicketMessage,
      RecentView,
      Favorite,
      LessonProgress,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
