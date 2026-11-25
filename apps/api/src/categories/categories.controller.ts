import type { CategoriesResponse } from "@matiq/contracts";
import { Controller, Get } from "@nestjs/common";
import { CategoriesService } from "./categories.service.ts";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  list(): Promise<CategoriesResponse> {
    return this.categoriesService.list();
  }
}
