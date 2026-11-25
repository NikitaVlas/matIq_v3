import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { de } from "@/i18n/de";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: de.meta.title, template: de.meta.titleTemplate },
  description: de.meta.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="flex min-h-dvh flex-col bg-neutral-50 font-sans text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:shadow"
        >
          {de.nav.skipToContent}
        </a>
        <SiteHeader />
        <main id="inhalt" className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
