
# Atom ctrl ( redesign ) :)

## Authentication

Clerk is configured through `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and
`CLERK_SECRET_KEY` in the ignored `.env.local` file. Never commit those keys.

- `/sign/login` contains the styled Clerk sign-in flow.
- `/sign/register` contains sign-up and email verification.
- Successful sign-in/sign-up redirects to `/platform`.
- `/platform` and its layout perform server-side `auth.protect()` checks.
- Existing sessions visiting either auth page return to `/platform`.
- Account management and sign-out are available through the platform's user menu.

The public site remains accessible without authentication. The homepage's
"Request a demo or learn more" link opens `/sign/login`. Login and registration
use the supplied artwork in `public/assets/auth/grain-study.png`.

Run `npm run test:auth` for authentication and route-matching tests. Social
providers and available sign-in methods follow the application's Clerk Dashboard
settings; changing the UI does not enable providers.

## Neon user database

Clerk owns authentication. Neon stores a minimal profile in `public.users`, keyed
by the existing Clerk user ID. No passwords, provider tokens, or API keys are copied.
Google Cloud remains separate for future server/API compute; it is not provisioned here.

Set these variables in your ignored `.env.local`:

- `DATABASE_URL`: Neon Postgres connection string (pooled for application traffic).
- `DATABASE_URL_UNPOOLED`: direct connection string for migrations.
- `CLERK_WEBHOOK_SIGNING_SECRET`: signing secret for your Clerk webhook endpoint.

Run `npm run db:migrate`, then `npm run db:sync-users` to backfill existing Clerk
users. The backfill is paginated and safe to rerun. Add `-- --dry-run` to count
users without writing. New profile fields require a schema change followed by
`npm run db:generate` and `npm run db:migrate`. Use a Neon development branch to
review migrations before applying them to production.

The protected platform layout also synchronizes the authenticated user on entry,
so a new user does not depend on webhook delivery before using the platform.
Database synchronization errors fail that request rather than silently skipping
user creation. Public pages do not require a database connection.

For ongoing updates, configure a Clerk webhook endpoint at
`https://YOUR_APP_HOST/api/webhooks/clerk`, subscribing to `user.created`,
`user.updated`, and `user.deleted`. Set its signing secret in the deployment's
environment. During local development, use a public tunnel to this same path.
The endpoint verifies Clerk signatures before writing and returns failure on a
database error so delivery can be retried. Use the endpoint belonging to the same
Clerk instance as `CLERK_SECRET_KEY` and the corresponding Neon environment.

Upserts use Clerk's update timestamp to reject older profile events. Deletion
clears profile data and retains an ID-only tombstone with timestamps, preventing
late webhooks or a concurrent backfill from recreating deleted profiles. The
backfill synchronizes existing users; it does not delete database users absent
from Clerk. Deletions are handled by verified webhook events.

Neon CLI/skills/MCP setup is separate from the runtime connection. A Neon management
API key is not required by the app. Restart Codex after plugin setup to load the
Neon MCP tools.

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
  apple-icon.tsx
  favicon.ico
  fonts.ts
  globals.css
  icon.tsx
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
    monarch-simulation-grid.png
  fonts/
    Instrument_Serif/
    Mona_Sans/
    Shadows_Into_Light/
  favicon.ico
  llms-full.txt
  llms.txt

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




