import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { de } from "@/i18n/de";

export const metadata: Metadata = { title: de.legal.agb };

export default function AgbPage() {
  return <LegalPage slug="agb" title={de.legal.agb} />;
}
