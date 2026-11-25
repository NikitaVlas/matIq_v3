import Link from "next/link";
import { de } from "@/i18n/de";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {de.brand.name}
        </Link>
        <nav aria-label={de.nav.label}>
          <ul className="flex items-center gap-1 text-sm font-medium">
            <li>
              <Link
                href="/kategorien"
                className="rounded-md px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                {de.nav.categories}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
