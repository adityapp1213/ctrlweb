import { readFile } from "node:fs/promises";
import { join } from "node:path";

type TocItem = {
  id: string;
  label: string;
};

type ReferenceItem = {
  id: string;
  number: string;
  html: string;
};

export type BlogArticle = {
  heroLabel: string;
  titleHtml: string;
  ledeHtml: string;
  heroMeta: string[];
  bodyHtml: string;
  toc: TocItem[];
  references: ReferenceItem[];
  footerMeta: string[];
};

function extractSingle(html: string, pattern: RegExp, fallback = "") {
  return html.match(pattern)?.[1]?.trim() ?? fallback;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&amp;/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeHtml(html: string) {
  return html
    .replace(/Â·/g, "·")
    .replace(/â€¦/g, "…")
    .replace(/â€“/g, "–")
    .replace(/â€”/g, "—")
    .replace(/â†’/g, "→")
    .replace(/Ã—/g, "×")
    .replace(/Â/g, "");
}

export async function getBlogArticle(sourceFile: string): Promise<BlogArticle> {
  const sourcePath = join(process.cwd(), "content", sourceFile);
  const html = normalizeHtml(await readFile(sourcePath, "utf8"));
  const articleInner = extractSingle(html, /<article>([\s\S]*?)<\/article>/);
  const heroInner = extractSingle(
    articleInner,
    /<div class="hero">([\s\S]*?)<\/div>\s*<!--/,
  );
  const sourcesInner = extractSingle(
    articleInner,
    /<div class="sources">([\s\S]*?)<\/div>\s*$/,
  );

  const heroLabel = extractSingle(heroInner, /<div class="hero-label">([\s\S]*?)<\/div>/);
  const titleHtml = extractSingle(heroInner, /<h1>([\s\S]*?)<\/h1>/);
  const ledeHtml = extractSingle(heroInner, /<p class="lede">([\s\S]*?)<\/p>/);
  const heroMeta = [...heroInner.matchAll(/<span>([\s\S]*?)<\/span>/g)].map((match) =>
    match[1].trim(),
  );

  const toc: TocItem[] = [{ id: "introduction", label: "Introduction" }];
  const seenIds = new Set<string>(["introduction"]);

  let bodyHtml = articleInner
    .replace(/<div class="hero">[\s\S]*?<\/div>\s*<!--/, "<!--")
    .replace(/<div class="sources">[\s\S]*?<\/div>\s*$/, "");

  bodyHtml = bodyHtml.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, rawHeading) => {
    const cleanLabel = rawHeading.replace(/<[^>]+>/g, "").trim();
    let id = slugify(cleanLabel);

    while (seenIds.has(id)) {
      id = `${id}-section`;
    }

    seenIds.add(id);
    toc.push({ id, label: cleanLabel });

    return `<h2 id="${id}">${rawHeading}</h2>`;
  });

  bodyHtml = bodyHtml.replace(/<a /g, '<a rel="noopener noreferrer" ');

  const references: ReferenceItem[] = [
    ...sourcesInner.matchAll(
      /<li><span class="source-num">(.*?)<\/span><span>([\s\S]*?)<\/span><\/li>/g,
    ),
  ].map((match, index) => ({
    id: `reference-${index + 1}`,
    number: match[1].trim(),
    html: match[2].trim(),
  }));

  const footerInner = extractSingle(
    html,
    /<footer class="article-footer">([\s\S]*?)<\/footer>/,
  );
  const footerMeta = [...footerInner.matchAll(/<span>([\s\S]*?)<\/span>/g)].map(
    (match) => match[1].trim(),
  );

  return {
    heroLabel,
    titleHtml,
    ledeHtml,
    heroMeta,
    bodyHtml,
    toc,
    references,
    footerMeta,
  };
}
