import { getLegalHtml, type LegalPageSlug } from "@/lib/legal";

/** Shared layout for Impressum, Datenschutz and AGB. Text comes from content/legal/*.md. */
export async function LegalPage({ slug, title }: { slug: LegalPageSlug; title: string }) {
  const html = await getLegalHtml(slug);
  return (
    <article className="max-w-3xl">
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
      {/* Trusted Markdown from the repository, rendered on the server. */}
      <div className="legal-content mt-4" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
