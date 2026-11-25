import type { Category } from "@matiq/contracts";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <article className="h-full rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="font-semibold">{category.nameDe}</h3>
      {category.descriptionDe && (
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          {category.descriptionDe}
        </p>
      )}
    </article>
  );
}
