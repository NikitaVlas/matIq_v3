import type { CategoriesResponse } from "@matiq/contracts";
import { categories, categoryLinks } from "@matiq/db";
import { Injectable } from "@nestjs/common";
import { and, asc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { DatabaseService } from "../database/database.service.ts";

@Injectable()
export class CategoriesService {
  constructor(private readonly database: DatabaseService) {}

  /**
   * All non-hidden categories with the links between them.
   * TODO(phase 3): once videos exist, return only categories with published videos.
   */
  async list(): Promise<CategoriesResponse> {
    const { db } = this.database;

    const rows = await db
      .select({
        id: categories.id,
        slug: categories.slug,
        nameDe: categories.nameDe,
        nameEn: categories.nameEn,
        descriptionDe: categories.descriptionDe,
        kind: categories.kind,
        sortOrder: categories.sortOrder,
      })
      .from(categories)
      .where(eq(categories.isHidden, false))
      .orderBy(asc(categories.sortOrder), asc(categories.slug));

    const from = alias(categories, "from_category");
    const to = alias(categories, "to_category");
    const links = await db
      .select({ from: from.slug, to: to.slug, kind: categoryLinks.kind })
      .from(categoryLinks)
      .innerJoin(from, eq(categoryLinks.fromCategoryId, from.id))
      .innerJoin(to, eq(categoryLinks.toCategoryId, to.id))
      .where(and(eq(from.isHidden, false), eq(to.isHidden, false)))
      .orderBy(asc(categoryLinks.kind), asc(from.sortOrder), asc(to.sortOrder));

    return { categories: rows, links };
  }
}
