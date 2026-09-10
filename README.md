
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
research/blog page for godel-model

## stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React
- shadcn/ui bits
- custom article parsing for the research pages

## project shape

```text
app/
  ctrl/
    page.tsx
  research/
    monarch/
    interaction-systems/
    godel-model/
    scaling-synthetic-data/
    _blog-article-page.tsx
    page.tsx
  team/
    page.tsx
  _sections/
  apple-icon.tsx
  fonts.ts
  globals.css
  icon.tsx
  layout.tsx
  loading.tsx
  manifest.ts
  opengraph-image.tsx
  page.tsx
  robots.ts
  sitemap.ts
  twitter-image.tsx

components/
  blog/
  butterfly/
  ui/
    main/
    skiper-ui/
  hero.tsx
  movers-canvas.tsx
  route-top-nav.tsx
  simple-research-process.tsx
  simple-site-cta.tsx
  simple-site-footer.tsx
  simple-site-nav.tsx
  simple-team-cards.tsx
  site-loader-screen.tsx
  site-preloader.tsx

content/
  godel-source.html
  interaction-systems-source.html
  monarch-source.html
  scaling-source.html

lib/
  blog-article.ts
  seo.ts
  utils.ts

public/
  assets/
  fonts/
  favicon.ico
  logo-mark.png

root files/
  package.json
  package-lock.json
  tsconfig.json
  next.config.ts
  eslint.config.mjs
  postcss.config.mjs
  components.json
  AGENTS.md
  README.md
```

## how to run it

install deps:

```bash
npm install
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
```

## build status

good news, this thing is healthy rn :)

- `npm.cmd run build` passes
- `npm.cmd run lint` passes clean
- all current app routes are statically prerendered

## main flow

pretty simple:

1. you land on `/`
2. you scroll through the points and our goal
3. if you want the actual ml / research stuff, you jump into the research
4. if you want updates or access, you hit the lets talk

## branding notes

- site metadata points to `https://atomctrl.com`
- favicon lives in `app/favicon.ico`
- the visible logo is the custom `AtomLogo` svg component
- the font is loaded locally from `public/fonts/`




