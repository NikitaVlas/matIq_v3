import { useSuspenseQuery } from "@tanstack/react-query";
import { de } from "@/i18n/de";
import { categoriesQuery } from "@/lib/api";
import { countLinks } from "@/lib/links";

export function CategoriesPage() {
  const { data } = useSuspenseQuery(categoriesQuery);
  const counts = countLinks(data.links);

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold">{de.categories.title}</h1>
        <p className="text-sm text-neutral-500">
          {de.common.total(data.categories.length)} · {de.common.readOnlyHint}
        </p>
      </header>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase">
            <tr>
              <th className="px-3 py-2">{de.categories.columns.sortOrder}</th>
              <th className="px-3 py-2">{de.categories.columns.name}</th>
              <th className="px-3 py-2">{de.categories.columns.slug}</th>
              <th className="px-3 py-2">{de.categories.columns.kind}</th>
              <th className="px-3 py-2">{de.categories.columns.links}</th>
              <th className="px-3 py-2">{de.categories.columns.description}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {data.categories.map((category) => {
              const linkCount = counts.get(category.slug) ?? { outgoing: 0, incoming: 0 };
              return (
                <tr key={category.id} className="align-top">
                  <td className="px-3 py-2 text-neutral-500 tabular-nums">{category.sortOrder}</td>
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{category.nameDe}</td>
                  <td className="px-3 py-2 font-mono text-xs whitespace-nowrap text-neutral-600">
                    {category.slug}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {de.categories.kinds[category.kind]}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-neutral-600">
                    {de.categories.linkCounts(linkCount.outgoing, linkCount.incoming)}
                  </td>
                  <td className="min-w-64 px-3 py-2 text-neutral-600">{category.descriptionDe}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
