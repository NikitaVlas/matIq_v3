import { z } from "zod";
import { CATEGORY_KINDS, CATEGORY_LINK_KINDS } from "./enums.ts";

export const CategorySchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  nameDe: z.string(),
  nameEn: z.string(),
  descriptionDe: z.string().nullable(),
  kind: z.enum(CATEGORY_KINDS),
  sortOrder: z.number().int(),
});
export type Category = z.infer<typeof CategorySchema>;

/** Links reference categories by slug, so clients don't need id lookups. */
export const CategoryLinkSchema = z.object({
  from: z.string(),
  to: z.string(),
  kind: z.enum(CATEGORY_LINK_KINDS),
});
export type CategoryLink = z.infer<typeof CategoryLinkSchema>;

/** GET /categories */
export const CategoriesResponseSchema = z.object({
  categories: z.array(CategorySchema),
  links: z.array(CategoryLinkSchema),
});
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;
