const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { htmlToDOM, Element } = require("html-react-parser");
const { loadTypeScript, root } = require("./load-typescript.cjs");
const { getBlogArticle } = loadTypeScript("lib/blog-article.ts");
const { BlogBody } = loadTypeScript("components/blog/blog-body.tsx");
const { blogArticles, researchOrder } = loadTypeScript("lib/research.ts");
const { createLlmIndex } = loadTypeScript("lib/llms.ts");
const sitemap = loadTypeScript("app/sitemap.ts").default;
const manifest = loadTypeScript("app/manifest.ts").default;

function elements(html) {
  const result = [];
  function walk(nodes) {
    for (const node of nodes) {
      if (node instanceof Element) result.push(node);
      if (node.children) walk(node.children);
    }
  }
  walk(htmlToDOM(html));
  return result;
}

test("server-rendered articles preserve links, bookmarks, figures, emphasis, and references", async () => {
  let referenceCount = 0;
  for (const slug of researchOrder) {
    const article = await getBlogArticle(blogArticles[slug].sourceFile);
    assert.ok(article.titleHtml && article.ledeHtml && article.heroMeta.length, slug);
    const original = elements(`<p>${article.ledeHtml}</p>${article.bodyHtml}${article.references.map((ref) => ref.html).join("")}`);
    const html = renderToStaticMarkup(React.createElement(BlogBody, {
      bodyHtml: `<p>${article.ledeHtml}</p>${article.bodyHtml}`,
      references: article.references,
    }));
    const rendered = elements(html);
    for (const node of original.filter((node) => node.attribs.id)) {
      assert.ok(rendered.some((candidate) => candidate.attribs.id === node.attribs.id), `${slug}: missing #${node.attribs.id}`);
    }
    const links = (nodes) => nodes.filter((node) => node.name === "a").map((node) => node.attribs.href).sort();
    assert.deepEqual(links(rendered), links(original), `${slug}: link boundaries changed`);
    for (const tag of ["figure", "figcaption", "strong", "em"]) {
      assert.equal(rendered.filter((node) => node.name === tag).length, original.filter((node) => node.name === tag).length, `${slug}: lost ${tag}`);
    }
    for (const ref of article.references) assert.ok(rendered.some((node) => node.attribs.id === ref.id));
    assert.ok(rendered.some((node) => (node.attribs.class ?? "").includes("mapped-article")));
    assert.doesNotMatch(html, /opacity:\s*0\.2/);
    referenceCount += article.references.length;
  }
  assert.equal(referenceCount, 27);
});

test("HTML attributes, inline whitespace, nested links, and SVG survive server rendering", () => {
  const bodyHtml = '<section id="original-section" class="callout"><p>Read <a href="#target"><strong>the complete guide</strong></a> today.<br/>Next line.</p><figure><img src="/assets/goal-image.png" alt="Robot" width="2048" height="691"/><figcaption>Caption</figcaption></figure><table><tbody><tr><th scope="row" rowspan="2">Label</th><td colspan="2">Value</td></tr></tbody></table><svg viewBox="0 0 20 20" aria-label="Diagram"><path d="M0 0L20 20"/></svg><h2 id="target">Target</h2></section>';
  const html = renderToStaticMarkup(React.createElement(BlogBody, { bodyHtml, references: [] }));
  const nodes = elements(html);
  assert.equal(nodes.filter((node) => node.name === "a").length, 1);
  assert.match(html, /<strong>the complete guide<\/strong><\/a> today\./);
  assert.match(html, /class="mapped-callout"/);
  assert.match(html, /scope="row"/);
  assert.match(html, /rowspan="2"/i);
  assert.match(html, /colspan="2"/i);
  assert.match(html, /viewBox="0 0 20 20"/);
  assert.match(html, /loading="lazy"/);
  assert.doesNotMatch(html, /references-title/);
});

test("every registered article appears in the sitemap and both machine-readable indexes", () => {
  const urls = sitemap().map((entry) => entry.url);
  for (const slug of researchOrder) {
    const article = blogArticles[slug];
    assert.ok(urls.some((url) => url.endsWith(article.seo.path)), slug);
    assert.ok(createLlmIndex().includes(article.seo.path), slug);
    assert.ok(createLlmIndex(true).includes(article.seo.path), slug);
    assert.ok(fs.existsSync(path.join(root, "public", article.heroImageSrc)));
  }
  for (const icon of manifest().icons) assert.ok(fs.existsSync(path.join(root, "public", icon.src)), icon.src);
});
