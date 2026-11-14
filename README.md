
# Atom ctrl ( redesign ) :)

## Browser simulation

Protected workspace routes:

- `/platform` redirects to `/platform/playground`.
- `/platform/playground` is the robot collection; `arms`, `environment`, and `q`
  query parameters preserve filters and search.
- `/platform/playground/[robot]` lists that robot's scenarios (hyphenated model ID).
- `/platform/playground/[robot]/[scenario]` opens a simulation, e.g.
  `/platform/playground/franka-emika-panda/open-floor`. Additional scene props
  are encoded in `?props=block,lemon` so refresh restores the configuration.
  `view=scene` and `view=policy` also restore the selected inspector view.
- `/platform/research` is the research workspace.
- Research starts with an empty MuJoCo scene and a Python editor in the right
  sidebar. Add/change a preset from the same 26-model collection, configure the
  environment and community props, or clear the scene back to blank. Each
  workspace has one active robot preset (including the catalog's dual-arm models).
  The selected robot, environment, props, and inspector view live in URL query
  parameters, so history and refresh preserve the scene configuration. Code
  survives preset and scene changes within the workspace; use Save/Load draft
  for persistence across refreshes. Research scene saves and policy drafts are
  scoped to the signed-in user in this browser and separate from Playground.
- The left sidebar is shared by Playground, Research, and their library pages.
  Its desktop collapse button switches to an icon rail; this state stays in the
  shared platform layout when switching modes. In Research, sidebar links open
  Code/Scene/Controls, filter the robot preset picker, and apply environments to
  the current scene. On small screens, the same navigation opens as a drawer.
- `/platform/library/[section]` provides the existing library destinations;
  models, modules, environments, and tasks are currently empty-state pages.

Pages enforce Clerk authentication before rendering. The shared layout also
checks authentication and synchronizes the signed-in profile. Navigation uses
Next.js links and browser history; invalid models/scenarios return not found.
Private routes are excluded from search-engine indexing. Clerk fallback
redirects preserve an intended deep link after sign-in rather than forcing
every sign-in to the platform entry page.

The Playground opens as a searchable, bordered robot collection. Select a robot,
then an environment card to open the simulation. Robot previews are original
published images from MuJoCo Menagerie, downloaded unchanged with source links
and per-model licenses under `public/previews/`. Regenerate them with
`node scripts/fetch-robot-previews.mjs`. Scenario cards use the robot's published
preview; their labels and object tags describe the scene that opens.

The protected Playground offers 26 official MuJoCo Menagerie arm models from a
pinned upstream revision. Panda's XML and 67 meshes are vendored unchanged;
other models load on selection from the pinned official source and use the
browser asset cache. Asset symlinks are resolved in the catalog. Each model links
to its upstream source/license. The library is regenerated with
`node scripts/prepare-robot-catalog.mjs` and checked with
`node scripts/validate-robot-catalog.mjs` (network access; ignored local test cache).

Physics uses the official single-threaded MuJoCo WASM engine in a worker.
Three.js renders its actual visual meshes/transforms. Controls come from each
model's actuator modes and ranges, including position, velocity, or effort.
Effort-controlled models require a controller for position holding. This is
browser CPU simulation with WebGL rendering; Google Cloud is not involved.

- Joint edits never teleport coordinates. They start physics and apply
  rate-limited actuator commands. Play/pause and reset remain available.
- MuJoCo solves contacts continuously with implicit-fast integration, a timestep
  of at most 1 ms, Newton solving, speculative contacts, 1 mm contact margins,
  and stiffer contact impedance. Robot actuator gains, torque limits, inertias,
  joint limits and non-adjacent self-collision geometry come from Menagerie.
  Contacts do not rewind state or pause time. Native soft contacts can still
  permit small residual overlap; the regression checks bound sampled overlap.
- The Kinova adapter excludes only the mechanically joined base/shoulder shells
  that overlap in its upstream home pose. Other upstream exclusions remain.
  Scenes with an intersecting default pose settle through MuJoCo before the
  initial frame, and reset restores that settled configuration.
- Three presets (open floor, workbench, object sorting) reuse the original
  Menagerie ALOHA table meshes/texture/collider and Panda calibration block,
  plus robosuite can/lemon meshes, textures, and sorting-bin geometry.
  Original files, licenses, and source links are under `public/environments/`.
  `node scripts/fetch-environment-assets.mjs` re-fetches the pinned sources.
  The unused robosuite Python controller files are attribution/reference
  material; runtime controllers are the native Menagerie actuator definitions.
- `workspace-profiles.json` contains measured robot-specific workspace layouts.
  Bench variants change table XY dimensions, never robot dimensions. The floor
  is below the table and fixed robot bases mount at the work surface. WXAI keeps
  its original built-in table. Objects sit within the configured workspace.
  Regenerate profiles with `node scripts/prepare-workspace-profiles.mjs` after
  populating the catalog validation cache. Legacy sphere/tray links and saved
  scenes normalize to the community lemon/bin assets.
- The renderer preserves original mesh UVs and 2D textures. Collision-only
  geometry stays hidden; the renderer does not create substitute robot meshes.
- The inspector has Controls, Scene, and Python views. Scene configurations and
  policy drafts can be explicitly saved/loaded in this browser, scoped to the
  signed-in account. They are not yet stored in Neon or shared between devices.
- Python policies run locally through Pyodide in a separate worker at up to
  10 Hz. Define `policy(obs)` and return one target per actuator in the UI units.
  Observations include time, positions, targets, home commands, and control
  metadata. Results are checked, clamped, and passed through the same physics.
  Policies currently support the Python standard library, not PyTorch or RL
  training. Only code the user explicitly runs is executed.
- Stop, reset, mode changes, and scene replacement terminate policy execution.
  Initialization/step timeouts terminate an unresponsive policy worker. Hidden
  browser tabs pause physics. Research mode unmounts the scene and frees workers
  and graphics resources.

`npm run dev` and `npm run build` prepare local MuJoCo and Python assets under
`public/vendor/`. They also compile the unchanged default Panda to a cached MJB
using MuJoCo. Bulk WASM filesystem writes avoid slow per-byte VFS transfer.
Generated runtime assets and the validation cache are ignored by Git. Deployments
must include generated public assets. Runtime licenses are preserved under
`public/MUJOCO-LICENSE.txt` and `public/PYODIDE-LICENSE.txt`; Panda's own license
is under `public/models/franka-emika-panda/`.

`npm run test:simulation` covers real-WASM actuator motion, no-teleport controls,
continuous native contacts, gripper coupling, sourced props and UVs, binary
round-trip, and reset. The catalog validator checks all three presets for every
robot; `node scripts/validate-robot-motion.mjs` stress-tests joint-limit targets
against native floor/self contacts using the same downloaded validation cache.
`node scripts/fetch-panda.mjs` re-fetches the pinned default source assets.

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




