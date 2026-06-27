import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorite } from "./entities/favorite.entity";
import { Course } from "../courses/entities/course.entity";
import { Article } from "../articles/entities/article.entity";
import { FavoritesService } from "./favorites.service";
import { FavoritesController } from "./favorites.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Course, Article])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
