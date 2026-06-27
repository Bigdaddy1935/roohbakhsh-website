import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { Category } from "./entities/category.entity";
import { Course } from "../courses/entities/course.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Category, Course])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
