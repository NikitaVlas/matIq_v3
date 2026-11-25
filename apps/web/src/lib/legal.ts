import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { marked } from "marked";

export type LegalPageSlug = "impressum" | "datenschutz" | "agb";

/**
 * Renders content/legal/<slug>.md to HTML. The Markdown lives in the repository and is
 * written by the owner, so it is trusted content.
 */
export async function getLegalHtml(slug: LegalPageSlug): Promise<string> {
  const file = join(process.cwd(), "content", "legal", `${slug}.md`);
  const markdown = await readFile(file, "utf8");
  return marked.parse(markdown, { async: false });
}
