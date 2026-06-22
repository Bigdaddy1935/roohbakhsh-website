import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Article } from "./entities/article.entity";
import { Instructor } from "../instructor/entities/instructor.entity";
import { ArticlesService } from "./articles.service";
import { ArticlesController } from "./articles.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Article, Instructor])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
