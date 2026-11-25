import type { CategoriesResponse } from "@matiq/contracts";
import type { Metadata } from "next";
import { CategoryCard } from "@/components/category-card";
import { de } from "@/i18n/de";
import { getCategories } from "@/lib/api";
import { groupCategoriesByKind } from "@/lib/categories";

export const metadata: Metadata = { title: de.categories.title };

// Rendered per request (data cached for 60 s), so `next build` never needs a running API.
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let data: CategoriesResponse | null = null;
  try {
    data = await getCategories();
  } catch (error) {
    console.error("Failed to load categories", error);
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold sm:text-3xl">{de.categories.title}</h1>
        <p className="text-neutral-700 dark:text-neutral-300">{de.categories.intro}</p>
      </header>

      {data === null ? (
        <p
          role="alert"
          className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
        >
          {de.errors.loadFailed}
        </p>
      ) : data.categories.length === 0 ? (
        <p>{de.categories.empty}</p>
      ) : (
        groupCategoriesByKind(data.categories).map((group) => (
          <section key={group.kind} aria-labelledby={`gruppe-${group.kind}`}>
            <div className="mb-3 flex items-baseline justify-between gap-2">
              <h2 id={`gruppe-${group.kind}`} className="text-lg font-semibold">
                {de.categories.kinds[group.kind]}
              </h2>
              <span className="text-sm text-neutral-500">
                {de.categories.count(group.categories.length)}
              </span>
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.categories.map((category) => (
                <li key={category.id}>
                  <CategoryCard category={category} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
