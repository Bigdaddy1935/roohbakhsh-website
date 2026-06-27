import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Review } from "./entities/review.entity";
import { Course } from "../courses/entities/course.entity";
import { Article } from "../articles/entities/article.entity";
import { ReviewsService } from "./reviews.service";
import { ReviewsController } from "./reviews.controller";
import { ArticleReviewsController } from "./article-reviews.controller";
import { AllReviewsController } from "./all-reviews.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Review, Course, Article])],
  controllers: [ReviewsController, ArticleReviewsController, AllReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
