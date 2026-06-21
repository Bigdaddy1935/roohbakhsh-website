import { PartialType } from "@nestjs/swagger";
import { CreateCategoryDto } from "./create-category.dto";
import type { UpdateCategoryRequest } from "@roohbakhsh/shared";

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) implements UpdateCategoryRequest {}
