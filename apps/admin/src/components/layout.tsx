import { Link, Outlet } from "@tanstack/react-router";
import { de } from "@/i18n/de";

const navItems = [
  { to: "/kategorien", label: de.nav.categories },
  { to: "/verknuepfungen", label: de.nav.links },
] as const;

/** Sidebar on desktop, horizontal nav on small screens. */
export function Layout() {
  return (
    <div className="min-h-dvh bg-neutral-50 font-sans text-neutral-900 md:flex">
      <aside className="border-b border-neutral-200 bg-white md:w-56 md:shrink-0 md:border-r md:border-b-0">
        <div className="px-4 py-4 text-lg font-bold">{de.app.name}</div>
        <nav aria-label={de.app.navLabel}>
          <ul className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:pb-0">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="block rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap hover:bg-neutral-100"
                  activeProps={{ className: "bg-neutral-100 text-accent" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 md:px-8">
        <Outlet />
      </main>
    </div>
  );
}
