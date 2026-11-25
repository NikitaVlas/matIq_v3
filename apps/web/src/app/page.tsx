import Link from "next/link";
import { de } from "@/i18n/de";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{de.brand.slogan}</h1>
        <p className="max-w-2xl text-lg text-neutral-700 dark:text-neutral-300">{de.home.intro}</p>
        <div>
          <Link
            href="/kategorien"
            className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-semibold text-white hover:bg-accent-strong"
          >
            {de.home.ctaCategories}
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="text-lg font-semibold">{de.home.roadmapTitle}</h2>
        <p className="mt-2 text-neutral-700 dark:text-neutral-300">{de.home.roadmapText}</p>
      </section>
    </div>
  );
}
