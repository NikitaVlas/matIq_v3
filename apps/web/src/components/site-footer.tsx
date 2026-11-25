import Link from "next/link";
import { de } from "@/i18n/de";

const legalLinks = [
  { href: "/impressum", label: de.footer.impressum },
  { href: "/datenschutz", label: de.footer.datenschutz },
  { href: "/agb", label: de.footer.agb },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-6 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between dark:text-neutral-400">
        <p>{de.footer.copyright(new Date().getFullYear())}</p>
        <nav aria-label={de.footer.legalLabel}>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-neutral-900 dark:hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
