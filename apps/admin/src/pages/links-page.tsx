import { CATEGORY_LINK_KINDS } from "@matiq/contracts";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { de } from "@/i18n/de";
import { categoriesQuery } from "@/lib/api";
import { type LinkFilter, toLinkRows } from "@/lib/links";

const route = getRouteApi("/verknuepfungen");

const filterOptions: { value: LinkFilter; label: string }[] = [
  { value: "all", label: de.links.all },
  ...CATEGORY_LINK_KINDS.map((kind) => ({ value: kind, label: de.links.kinds[kind] })),
];

export function LinksPage() {
  const { data } = useSuspenseQuery(categoriesQuery);
  const { art } = route.useSearch();
  const navigate = route.useNavigate();
  const rows = toLinkRows(data.links, data.categories, art);

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold">{de.links.title}</h1>
        <p className="text-sm text-neutral-500">
          {de.common.total(rows.length)} · {de.common.readOnlyHint}
        </p>
      </header>

      {/* Filter lives in the URL (?art=...), so a filtered view can be bookmarked. */}
      <div role="group" aria-label={de.links.filterLabel} className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={art === option.value}
            onClick={() => void navigate({ search: { art: option.value } })}
            className="rounded-full border border-neutral-300 px-3 py-1 text-sm aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-white"
          >
            {option.label}
          </button>
        ))}
      </div>

      {art !== "all" && <p className="text-sm text-neutral-600">{de.links.kindHints[art]}</p>}

      {rows.length === 0 ? (
        <p className="text-neutral-600">{de.links.empty}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase">
              <tr>
                <th className="px-3 py-2">{de.links.columns.from}</th>
                <th className="px-3 py-2">{de.links.columns.kind}</th>
                <th className="px-3 py-2">{de.links.columns.to}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((row) => (
                <tr key={row.key}>
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{row.from.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-neutral-600">
                    {de.links.kinds[row.kind]} →
                  </td>
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{row.to.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
