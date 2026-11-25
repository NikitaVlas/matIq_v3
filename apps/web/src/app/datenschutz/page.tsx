import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { de } from "@/i18n/de";

export const metadata: Metadata = { title: de.legal.datenschutz };

export default function DatenschutzPage() {
  return <LegalPage slug="datenschutz" title={de.legal.datenschutz} />;
}
