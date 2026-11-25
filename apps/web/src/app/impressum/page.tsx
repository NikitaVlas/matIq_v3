import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { de } from "@/i18n/de";

export const metadata: Metadata = { title: de.legal.impressum };

export default function ImpressumPage() {
  return <LegalPage slug="impressum" title={de.legal.impressum} />;
}
