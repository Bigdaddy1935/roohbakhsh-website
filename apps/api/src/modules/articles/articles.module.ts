import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "./entities/article.entity";
import { Instructor } from "../instructor/entities/instructor.entity";
import { Category } from "../category/entities/category.entity";
import { ReviewsModule } from "../reviews/reviews.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { ArticlesService } from "./articles.service";
import { ArticlesController } from "./articles.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Article, Instructor, Category]), ReviewsModule, NotificationsModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
