import assert from "node:assert/strict";
import { AsyncLocalStorage } from "node:async_hooks";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nativeRequire = createRequire(import.meta.url);
globalThis.AsyncLocalStorage ??= AsyncLocalStorage;
const { NextRequest } = nativeRequire("next/server");
const testing = nativeRequire("next/experimental/testing/server");
const doesProxyMatch = testing.unstable_doesProxyMatch ?? testing.unstable_doesMiddlewareMatch;

function loadSource(file, mocks = {}) {
  const filename = path.resolve(root, file);
  const source = ts.transpileModule(readFileSync(filename, "utf8"), {
    fileName: filename.endsWith('.mjs') ? `${filename}.ts` : filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  const resolveImport = (specifier) => {
    if (Object.hasOwn(mocks, specifier)) return mocks[specifier];
    if (specifier.endsWith(".module.css")) return new Proxy({}, { get: (_, name) => name === "__esModule" ? false : String(name) });
    if (specifier.startsWith("./") || specifier.startsWith("../")) {
      if (specifier.endsWith('.json')) return JSON.parse(readFileSync(path.resolve(path.dirname(filename), specifier), 'utf8'));
      return loadSource(path.resolve(path.dirname(filename), `${specifier}.ts`), mocks);
    }
    if (specifier.startsWith("@/")) {
      const sourcePath = specifier.slice(2);
      if (sourcePath.endsWith('.json')) return JSON.parse(readFileSync(path.resolve(root, sourcePath), 'utf8'));
      if (sourcePath.endsWith('.mjs')) return loadSource(sourcePath, mocks);
      return loadSource(`${sourcePath}${existsSync(path.resolve(root, `${sourcePath}.ts`)) ? ".ts" : ".tsx"}`, mocks);
    }
    return nativeRequire(specifier);
  };
  new Function("require", "module", "exports", source)(resolveImport, mod, mod.exports);
  return mod.exports;
}

function redirect(destination) { throw new Error(`redirect:${destination}`); }

const signedOutAuth = Object.assign(async () => ({ isAuthenticated: false }), {
  protect: async () => { throw new Error("unauthenticated"); },
});

test("Clerk runs on auth, API, auto-proxy, and all platform paths while skipping public assets", () => {
  const { config } = loadSource("proxy.ts", { "@clerk/nextjs/server": { clerkMiddleware: (handler) => handler } });
  for (const url of ["/sign/login", "/sign/register/verify-email-address", "/platform", "/platform/playground", "/platform/playground/franka-emika-panda/open-floor", "/platform/research", "/platform/library/models", "/platform/private.json", "/api/private", "/__clerk/v1/client"]) {
    assert.equal(doesProxyMatch({ config, nextConfig: {}, url }), true, url);
  }
  for (const url of ["/_next/static/chunk.js", "/assets/auth/grain-study.png", "/fonts/mona.ttf"]) {
    assert.equal(doesProxyMatch({ config, nextConfig: {}, url }), false, url);
  }
});

test("existing host routing cannot rewrite login or protected platform resources into /lab", async () => {
  const { default: proxy } = loadSource("proxy.ts", { "@clerk/nextjs/server": { clerkMiddleware: (handler) => handler } });
  for (const pathname of ["/sign/login", "/sign/register", "/platform", "/platform/playground/franka-emika-panda/open-floor", "/platform/library/models", "/platform/research", "/api/webhooks/clerk"]) {
    const response = await proxy({}, new NextRequest(`https://lab.atomctrl.com${pathname}`, { headers: { host: "lab.atomctrl.com" } }));
    assert.equal(response.headers.get("x-middleware-rewrite"), null, pathname);
  }
  const legacy = await proxy({}, new NextRequest("https://lab.atomctrl.com/research", { headers: { host: "lab.atomctrl.com" } }));
  assert.equal(legacy.headers.get("x-middleware-rewrite"), "https://lab.atomctrl.com/lab/research");
});

test("signed-out platform requests stop before any user profile is read", async () => {
  let profileRead = false;
  const { default: Page } = loadSource("app/platform/page.tsx", {
    "@clerk/nextjs/server": { auth: signedOutAuth, currentUser: async () => { profileRead = true; return null; } },
    "@clerk/nextjs": { UserButton: () => null },
    "geist/font/pixel": { GeistPixelCircle: { className: "pixel" } },
  });
  await assert.rejects(Page(), /unauthenticated/);
  assert.equal(profileRead, false);
  const { default: Layout } = loadSource("app/platform/layout.tsx", {
    "@clerk/nextjs/server": { auth: signedOutAuth },
    "@/lib/sync-platform-user": { syncPlatformUser: async () => { throw new Error("must not sync before auth"); } },
    '@/components/platform-mode': () => null,
  });
  await assert.rejects(Layout({ children: "private content" }), /unauthenticated/);
});

test("platform entry redirects to the designated playground route", async () => {
  const auth = Object.assign(async () => ({ isAuthenticated: true }), { protect: async () => ({ userId: "user_test" }) });
  const { default: Page } = loadSource("app/platform/page.tsx", {
    "@clerk/nextjs/server": {
      auth,
      currentUser: async () => ({ firstName: "<Ada & Co>", primaryEmailAddressId: "primary", emailAddresses: [{ id: "other", emailAddress: "other@example.com" }, { id: "primary", emailAddress: "ada@example.com" }] }),
    },
    "@clerk/nextjs": { UserButton: () => React.createElement("span", null, "account menu") },
    "geist/font/pixel": { GeistPixelCircle: { className: "pixel" } },
    'next/navigation': { redirect },
  });
  await assert.rejects(Page(), /redirect:\/platform\/playground/);
});

for (const [route, component] of [["login", "SignIn"], ["register", "SignUp"]]) {
  const file = `app/sign/${route}/[[...${route}]]/page.tsx`;
  test(`${route} redirects existing sessions and sends successful authentication to /platform`, async () => {
    const mocks = {
      "@clerk/nextjs": { [component]: () => null },
      "@clerk/nextjs/server": { auth: async () => ({ isAuthenticated: true }) },
      "next/navigation": { redirect },
    };
    await assert.rejects(loadSource(file, mocks).default(), /redirect:\/platform/);
    mocks["@clerk/nextjs/server"].auth = signedOutAuth;
    const form = (await loadSource(file, mocks).default()).props.children;
    assert.equal(form.props.path, `/sign/${route}`);
    assert.equal(form.props.routing, "path");
    assert.equal(form.props.fallbackRedirectUrl, "/platform");
    assert.equal(form.props.forceRedirectUrl, undefined, 'must respect the protected deep-link return URL');
    assert.equal(route === "login" ? form.props.signUpUrl : form.props.signInUrl, route === "login" ? "/sign/register" : "/sign/login");
  });
}

test("Clerk profile sync selects the primary email, including email-less users", () => {
  const { profileFromEvent } = loadSource("db/clerk-profile.ts");
  const user = { id: "user_existing", primary_email_address_id: "primary", email_addresses: [{ id: "other", email_address: "other@example.com" }, { id: "primary", email_address: "primary@example.com" }], first_name: "Ada", last_name: null, username: null, image_url: "https://example.com/avatar", created_at: 1000, updated_at: 2000 };
  assert.equal(profileFromEvent(user).email, "primary@example.com");
  assert.equal(profileFromEvent({ ...user, primary_email_address_id: null }).email, null);
  assert.equal(profileFromEvent(user).clerkId, user.id);
  assert.equal(profileFromEvent(user).clerkUpdatedAt, 2000);
});

test("user upserts reject stale events and deletion removes profile fields", async () => {
  let values, conflict;
  const db = { insert: () => ({ values: (input) => { values = input; return { onConflictDoUpdate: (config) => { conflict = config; } }; } }) };
  const { upsertClerkUser, deleteClerkUser } = loadSource("db/users.ts", { "server-only": {}, "./index": { getDatabase: () => db } });
  await upsertClerkUser({ clerkId: "user_existing", clerkUpdatedAt: 2000 });
  const { PgDialect } = nativeRequire("drizzle-orm/pg-core");
  const where = new PgDialect().sqlToQuery(conflict.setWhere);
  assert.match(where.sql, /"deleted_at" is null/);
  assert.match(where.sql, /"clerk_updated_at" <=/);
  assert.deepEqual(where.params, [2000]);
  await deleteClerkUser("user_existing", 3000);
  assert.equal(values.clerkId, "user_existing");
  assert.equal(values.deletedAt.getTime(), 3000);
  for (const field of ["email", "firstName", "lastName", "username", "imageUrl", "clerkCreatedAt"]) assert.equal(conflict.set[field], null);
});

test("webhooks verify signatures before writes and return failures for retries", async () => {
  const original = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  process.env.CLERK_WEBHOOK_SIGNING_SECRET = "test-signing-secret";
  try {
    const writes = [];
    let event = { type: "user.deleted", data: { id: "user_existing" }, timestamp: 3000 };
    let invalidSignature = true;
    let databaseUnavailable = false;
    const { POST } = loadSource("app/api/webhooks/clerk/route.ts", {
      "@clerk/nextjs/webhooks": { verifyWebhook: async () => { if (invalidSignature) throw new Error("bad signature"); return event; } },
      "@/db/users": {
        upsertClerkUser: async () => { throw new Error("Unexpected user upsert"); },
        deleteClerkUser: async (...args) => { if (databaseUnavailable) throw new Error("database unavailable"); writes.push(args); },
      },
    });
    assert.equal((await POST(new Request("http://localhost/api/webhooks/clerk"))).status, 400);
    assert.equal(writes.length, 0);
    invalidSignature = false;
    assert.equal((await POST(new Request("http://localhost/api/webhooks/clerk"))).status, 200);
    assert.deepEqual(writes, [["user_existing", 3000]]);
    databaseUnavailable = true;
    assert.equal((await POST(new Request("http://localhost/api/webhooks/clerk"))).status, 500);
    event = { type: "session.created", data: {}, timestamp: 4000 };
    assert.equal((await POST(new Request("http://localhost/api/webhooks/clerk"))).status, 200);
    delete process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    assert.equal((await POST(new Request("http://localhost/api/webhooks/clerk"))).status, 503);
  } finally {
    if (original === undefined) delete process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    else process.env.CLERK_WEBHOOK_SIGNING_SECRET = original;
  }
});

test("platform layout synchronizes only its authenticated Clerk identity", async () => {
  const calls = [];
  const { default: Layout } = loadSource("app/platform/layout.tsx", {
    "@clerk/nextjs/server": { auth: { protect: async () => ({ userId: "user_authenticated" }) } },
    "@/lib/sync-platform-user": { syncPlatformUser: async (id) => calls.push(id) },
    '@/components/platform-mode': () => null,
  });
  assert.equal((await Layout({ children: "workspace" })).props.children.props.children, "workspace");
  assert.deepEqual(calls, ["user_authenticated"]);
});

test('workspace mode follows the route and the shared shell renders route content', () => {
  let pathname = '/platform/playground/franka-emika-panda/open-floor';
  let params = new URLSearchParams();
  const { PlatformMode } = loadSource('components/platform-mode.tsx', {
    'next/navigation': { usePathname: () => pathname, useRouter: () => ({ push: () => {} }), useSearchParams: () => params },
    '@clerk/nextjs': { UserButton: () => React.createElement('span', null, 'account menu') },
    '@/components/playground-sidebar': { PlaygroundSidebar: ({ mode }) => React.createElement('aside', { 'data-sidebar-mode': mode }, 'Shared navigation') },
  });
  const playground = renderToStaticMarkup(React.createElement(PlatformMode, null, 'route content'));
  assert.match(playground, /data-mode="playground"/);
  assert.match(playground, /account menu/);
  assert.match(playground, /route content/);
  assert.match(playground, /data-sidebar-mode="playground"/);
  pathname = '/platform/research';
  const research = renderToStaticMarkup(React.createElement(PlatformMode, null));
  assert.match(research, /data-mode="research"/);
  assert.match(research, /data-sidebar-mode="research"/);
  pathname = '/platform/library/models';
  params = new URLSearchParams({ mode: 'research' });
  const library = renderToStaticMarkup(React.createElement(PlatformMode, null));
  assert.match(library, /data-sidebar-mode="research"/);
});

test('research sidebar preserves the selected scene and links to working workspace actions', () => {
  const params = new URLSearchParams({ robot: 'franka-fr3', environment: 'workbench', props: 'can' });
  const { PlaygroundSidebar } = loadSource('components/playground-sidebar.tsx', {
    'next/navigation': { usePathname: () => '/platform/research', useSearchParams: () => params },
    'geist/font/pixel': { GeistPixelCircle: { className: 'pixel' } },
  });
  const props = { mode: 'research', mobileOpen: false, onMobileOpen: () => {}, onClose: () => {}, onToggleCollapse: () => {} };
  const html = renderToStaticMarkup(React.createElement(PlaygroundSidebar, props));
  assert.match(html, /aria-label="Research navigation"/);
  assert.match(html, /aria-label="Collapse sidebar"/);
  assert.match(html, /robot=franka-fr3&amp;environment=workbench&amp;props=can&amp;view=policy/);
  assert.match(html, /<a(?=[^>]*aria-label="Code editor")(?=[^>]*aria-current="page")[^>]*>/);
  assert.match(html, /robot=franka-fr3&amp;environment=workbench&amp;props=can&amp;presets=dual/);
  assert.match(html, /\/platform\/library\/models\?mode=research/);
  const collapsed = renderToStaticMarkup(React.createElement(PlaygroundSidebar, { ...props, collapsed: true }));
  assert.match(collapsed, /data-collapsed="true"/);
  assert.match(collapsed, /aria-label="Expand sidebar"/);
});

const privatePages = [
  ['app/platform/playground/page.tsx', {}],
  ['app/platform/playground/explore/page.tsx', {}],
  ['app/platform/playground/[robot]/page.tsx', { params: Promise.resolve({ robot: 'franka-emika-panda' }) }],
  ['app/platform/playground/[robot]/[scenario]/page.tsx', { params: Promise.resolve({ robot: 'franka-emika-panda', scenario: 'open-floor' }), searchParams: Promise.resolve({}) }],
  ['app/platform/research/page.tsx', {}],
  ['app/platform/library/[section]/page.tsx', { params: Promise.resolve({ section: 'models' }) }],
];
for (const [file, props] of privatePages) {
  test(`${file} rejects unauthenticated direct requests`, async () => {
    const { default: Page } = loadSource(file, {
      '@clerk/nextjs/server': { auth: signedOutAuth },
      '@/components/simulation/playground-browser': () => null,
      '@/components/simulation/playground-home': () => null,
      '@/components/simulation/simulation-session': () => null,
      '@/components/simulation/research-workspace': () => null,
    });
    await assert.rejects(Page(props), /unauthenticated/);
  });
}

test('playground home and Explore have distinct protected routes and old filters keep working', async () => {
  const Home = () => null;
  const Collection = () => null;
  let protections = 0;
  const mocks = {
    '@clerk/nextjs/server': { auth: { protect: async () => { protections++; } } },
    'next/navigation': { redirect },
    '@/components/simulation/playground-home': Home,
    '@/components/simulation/playground-browser': Collection,
  };
  const HomePage = loadSource('app/platform/playground/page.tsx', mocks).default;
  const ExplorePage = loadSource('app/platform/playground/explore/page.tsx', mocks).default;
  assert.equal((await HomePage({})).type, Home);
  assert.equal((await ExplorePage()).type, Collection);
  await assert.rejects(HomePage({ searchParams: Promise.resolve({ arms: 'dual', environment: 'workbench', q: 'Franka Panda' }) }), /redirect:\/platform\/playground\/explore\?arms=dual&environment=workbench&q=Franka\+Panda/);
  assert.equal(protections, 3);
});

test('robot and scenario routes validate parameters and restore URL scene props', async () => {
  const mocks = {
    '@clerk/nextjs/server': { auth: { protect: async () => ({ userId: 'user_test' }) } },
    'next/navigation': { notFound: () => { throw new Error('not-found'); } },
    '@/components/simulation/playground-browser': () => null,
    '@/components/simulation/simulation-session': () => null,
  };
  const RobotPage = loadSource('app/platform/playground/[robot]/page.tsx', mocks).default;
  await assert.rejects(RobotPage({ params: Promise.resolve({ robot: 'unknown' }) }), /not-found/);
  const SimulationPage = loadSource('app/platform/playground/[robot]/[scenario]/page.tsx', mocks).default;
  const params = { robot: 'franka-emika-panda', scenario: 'workbench' };
  await assert.rejects(SimulationPage({ params: Promise.resolve({ ...params, scenario: 'unknown' }), searchParams: Promise.resolve({}) }), /not-found/);
  const simulation = await SimulationPage({ params: Promise.resolve(params), searchParams: Promise.resolve({ props: 'sphere,block,sphere,unknown' }) });
  assert.deepEqual(simulation.props.setup, { robotId: 'franka_emika_panda', environment: 'workbench', props: ['block', 'lemon'] });
});

test('every robot and scenario has an unambiguous canonical route', () => {
  const { ROBOT_CATALOG } = loadSource('lib/simulation/panda.ts');
  const { SCENARIOS, robotSlug, robotPath, findRobot, findScenario, simulationPath } = loadSource('lib/simulation/routes.ts');
  assert.equal(new Set(ROBOT_CATALOG.map((robot) => robotSlug(robot.id))).size, ROBOT_CATALOG.length);
  for (const robot of ROBOT_CATALOG) {
    assert.equal(findRobot(robotSlug(robot.id)).id, robot.id);
    assert.equal(robotPath(robot.id), `/platform/playground/${robotSlug(robot.id)}`);
    for (const scenario of SCENARIOS) {
      assert.equal(findScenario(scenario.slug).id, scenario.id);
      assert.equal(simulationPath({ robotId: robot.id, environment: scenario.id, props: [] }), `${robotPath(robot.id)}/${scenario.slug}`);
    }
  }
  assert.equal(simulationPath({ robotId: ROBOT_CATALOG[0].id, environment: 'ground', props: ['sphere', 'block', 'sphere', 'unknown'] }), `${robotPath(ROBOT_CATALOG[0].id)}/open-floor?props=block,lemon`);
  assert.throws(() => simulationPath({ robotId: 'unknown', environment: 'ground', props: [] }), /Unknown simulation/);
});

test('research starts empty and all 26 presets round-trip through protected workspace URLs', async () => {
  const { researchSetup, researchPath } = loadSource('lib/simulation/research.ts');
  const { ROBOT_CATALOG } = loadSource('lib/simulation/panda.ts');
  assert.deepEqual(researchSetup({}), { robotId: 'empty', environment: 'ground', props: [] });
  assert.equal(researchPath(researchSetup({})), '/platform/research');
  assert.equal(researchSetup({ robot: 'unknown' }), null);
  assert.equal(researchSetup({ robot: 'franka-fr3', environment: 'unknown' }), null);
  for (const robot of ROBOT_CATALOG) {
    const setup = { robotId: robot.id, environment: 'workbench', props: ['can', 'lemon'] };
    const url = new URL(researchPath(setup), 'http://localhost');
    assert.equal(url.pathname, '/platform/research');
    assert.deepEqual(researchSetup(Object.fromEntries(url.searchParams)), setup);
  }
  const { default: ResearchPage } = loadSource('app/platform/research/page.tsx', {
    '@clerk/nextjs/server': { auth: { protect: async () => ({ userId: 'user_test' }) } },
    '@/components/simulation/research-workspace': () => null,
    'next/navigation': { notFound: () => { throw new Error('not-found'); } },
  });
  assert.deepEqual((await ResearchPage({ searchParams: Promise.resolve({}) })).props.setup, researchSetup({}));
  await assert.rejects(ResearchPage({ searchParams: Promise.resolve({ robot: 'unknown' }) }), /not-found/);
});
