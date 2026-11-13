
# Atom ctrl ( redesign ) :)

this is the source code for my startup site, https://www.atomctrl.com/

i use this site to put everything in one place:
my research, my ideas around machine learning and thinking machines for robots, the stuff i am building, and my blog-style research pages too. it is basically the home for what i am doing with atom ctrl (my tiny startup)

it is built as a Next.js app-router site, and right now the homepage is basically three page `/`, `/research`, and `/team`. 

## routes

`/`
main landing page

`/ctrl`
resolves in main

`/research`
research section with the main blogs and they links 

`/team`
founder and adviser section

`research/monarch`
research/blog page for monarch

`research/interaction-systems`
research/blog page for interaction-systems

`research/godel-model`
research/blog page

`research/scaling-synthetic-data`
research/blog page for synthetic data

`/research/wam-0-1-dataset`
research/blog page for the WAM-0.1 dataset

`/llms.txt` and `/llms-full.txt`
statically generated machine-readable indexes

## article rendering

Research content lives in the version-controlled HTML files in `content/`.
`lib/blog-article.ts` extracts the article sections, and `BlogBody` renders them
on the server with `html-react-parser`. Only trusted repository content should
be passed to this renderer. Links, section IDs, figures, emphasis, and tables
are preserved, and article images use Next.js image optimization.

`lib/research.ts` is the shared registry for article metadata, research cards,
the sitemap, and both machine-readable indexes. Update it when adding an article.
The reading indicator and table of contents are separate client components.
The particle canvas is contained in a fixed-aspect-ratio wrapper; bitmap size
changes do not participate in page layout.

This app has no `/lab` routes. Legacy lab-host and `/lab/*` requests redirect to
the corresponding page on `atomctrl.com` until a dedicated lab app is available.

## stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React
- custom article parsing for the research pages

## project shape

```text
app/
  ctrl/
    page.tsx
  research/
    godel-model/
      page.tsx
    interaction-systems/
      page.tsx
    monarch/
      page.tsx
    scaling-synthetic-data/
      page.tsx
    _blog-article-page.tsx
    page.tsx
  team/
    page.tsx
  fonts.ts
  globals.css
  layout.tsx
  loading.tsx
  manifest.ts
  page.tsx
  robots.ts
  sitemap.ts

components/
  blog/
    blog-body.tsx
    blog-content.tsx
    blog-reading-progress.tsx
    blog-toc.tsx
    blog.module.css
    blog.tsx
  movers-canvas.tsx
  simple-research-process.tsx
  simple-site-cta.tsx
  simple-site-footer.tsx
  simple-site-nav.tsx
  simple-team-cards.tsx
  site-loader-screen.tsx

content/
  godel-source.html
  interaction-systems-source.html
  monarch-source.html
  scaling-source.html
  wam-0-1-dataset-source.html

lib/
  blog-article.ts
  research.ts
  llms.ts
  seo.ts
  utils.ts

public/
  assets/
    atom-ctrl-og.png
    blog-cards/
      1.png
      2.2.png
      3.png
      4.png
    chiku2.svg
    chintu1.svg
    footer-cta-forest.png
    github.svg
    gmail.svg
    instagram.svg
    linkedin.svg
  fonts/
    Instrument_Serif/
    Mona_Sans/
    Shadows_Into_Light/

root files/
  package.json
  package-lock.json
  tsconfig.json
  next.config.ts
  eslint.config.mjs
  postcss.config.mjs
  components.json
  proxy.ts
  README.md
  AGENTS.md
  CLAUDE.md
  .gitignore
```

## how to run it

install deps:

```bash
npm ci
```

start dev server:

```bash
npm run dev
```

open:

```txt
http://localhost:3000
```

other commands:

```bash
npm run build
npm run start
npm run lint
npm run typecheck
npm test
```

## build status

good news, this thing is healthy rn :)

- `npm.cmd run build` passes
- `npm.cmd run lint` passes clean
- `npm.cmd run typecheck` checks TypeScript
- `npm.cmd test` covers article markup, metadata, canvas lifecycle, and lab redirects
- all current app routes are statically prerendered

## main flow

pretty simple:

1. you land on `/`
2. you scroll through the points and our goal
3. if you want the actual ml / research stuff, you jump into the research
4. if you want updates or access, you hit the lets talk

## branding notes

- site metadata points to `https://atomctrl.com`
- favicon and manifest icons use `public/assets/atom-mark-favicon.png`
- the visible wordmark uses Geist Pixel Circle
- the font is loaded locally from `public/fonts/`




