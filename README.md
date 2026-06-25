
# Atom ctrl :)

this is the source code for my startup site, `https://www.atomctrl.com/`

i use this site to put everything in one place:
my research, my ideas around machine learning and thinking machines, the stuff i am building, and my blog-style research pages too. it is basically the home for what i am doing with atom ctrl (my tiny startup)

it is built as a Next.js app-router site, and right now the homepage is basically one long landing page with sections for the story, features, research, founder stuff, faq, and a very pink footer :))

Special thanks to the butterfly component. In the entire site I love that the most you can see them /butterfly/flapping-butterfly

## routes

`/`
main landing page

`/description`
the intro / what my project Monarch is about

`/features`
the core ideas and features section which shows everything about Monarch's features 

`/why-ctrl`
gives intro to the friendly character (cloudy) which will be in the app 

`/research`
research section with the main blogs and they links 

`/about-us`
founder and adviser section

`/faq`
faq page

`/monarch`
research/blog page for monarch

`/interaction-systems`
research/blog page for interaction-systems

`/godel-model`
research/blog page

`/scaling-synthetic-data`
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
  about-us/
  description/
  faq/
  features/
  footer/
  godel-model/
  hero/
  interaction-systems/
  monarch/
  research/
  scaling-synthetic-data/
  why-ctrl/
  apple-icon.tsx
  favicon.ico
  fonts.ts
  globals.css
  icon.tsx
  layout.tsx
  loading.tsx
  opengraph-image.tsx
  page.tsx
  twitter-image.tsx

components/
  blog/
  butterfly/
  ui/
    main/
  hero.tsx
  logo.tsx
  section-nav-link.tsx
  site-loader-screen.tsx
  site-preloader.tsx

content/
  godel-source.html
  interaction-systems-source.html
  monarch-source.html
  scaling-source.html

lib/
  blog-article.ts
  site-assets.ts
  utils.ts

public/
  assets/
  fonts/

root files/
  package.json
  package-lock.json
  tsconfig.json
  next.config.ts
  eslint.config.mjs
  postcss.config.mjs
  components.json
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
2. you scroll through the main story, features, research, about section, and faq
3. if you want the actual ml / research stuff, you jump into the article pages
4. if you want updates or access, you hit the waitlist CTA its powered by type form

## content setup

the research/blog pages are powered by source HTML files inside `content/`

- `monarch-source.html`
- `interaction-systems-source.html`
- `godel-source.html`
- `scaling-source.html`

`lib/blog-article.ts` reads those files, fixes weird encoding mess, builds a table of contents, and turns them into the final article pages. very cool. slightly held together by sleep deprivation probably.

## branding notes

- site metadata points to `https://atomctrl.com`
- favicon lives in `app/favicon.ico`
- the visible logo is the custom `AtomLogo` svg component
- the font is loaded locally from `public/fonts/`
- butterflies are part of the design now and at this point they are basically employees and they are amazing looking 

## future cleanup ideas

- add route-specific metadata for the research pages
- tighten some copy and casing across sections
- clean up the section/page structure a little more
- add analytics later if i want to track clicks and signups

