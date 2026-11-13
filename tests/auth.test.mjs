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
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  const resolveImport = (specifier) => {
    if (Object.hasOwn(mocks, specifier)) return mocks[specifier];
    if (specifier.endsWith(".module.css")) return new Proxy({}, { get: (_, name) => name === "__esModule" ? false : String(name) });
    if (specifier.startsWith("./") || specifier.startsWith("../")) {
      return loadSource(path.resolve(path.dirname(filename), `${specifier}.ts`), mocks);
    }
    if (specifier.startsWith("@/")) {
      const sourcePath = specifier.slice(2);
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
  for (const url of ["/sign/login", "/sign/register/verify-email-address", "/platform", "/platform/private.json", "/api/private", "/__clerk/v1/client"]) {
    assert.equal(doesProxyMatch({ config, nextConfig: {}, url }), true, url);
  }
  for (const url of ["/_next/static/chunk.js", "/assets/auth/grain-study.png", "/fonts/mona.ttf"]) {
    assert.equal(doesProxyMatch({ config, nextConfig: {}, url }), false, url);
  }
});

test("existing host routing cannot rewrite login or protected platform resources into /lab", async () => {
  const { default: proxy } = loadSource("proxy.ts", { "@clerk/nextjs/server": { clerkMiddleware: (handler) => handler } });
  for (const pathname of ["/sign/login", "/sign/register", "/platform", "/platform/settings", "/api/webhooks/clerk"]) {
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
  });
  await assert.rejects(Layout({ children: "private content" }), /unauthenticated/);
});

test("signed-in platform renders its mode toggle and account menu without profile content", async () => {
  const auth = Object.assign(async () => ({ isAuthenticated: true }), { protect: async () => ({ userId: "user_test" }) });
  const { default: Page } = loadSource("app/platform/page.tsx", {
    "@clerk/nextjs/server": {
      auth,
      currentUser: async () => ({ firstName: "<Ada & Co>", primaryEmailAddressId: "primary", emailAddresses: [{ id: "other", emailAddress: "other@example.com" }, { id: "primary", emailAddress: "ada@example.com" }] }),
    },
    "@clerk/nextjs": { UserButton: () => React.createElement("span", null, "account menu") },
    "geist/font/pixel": { GeistPixelCircle: { className: "pixel" } },
  });
  const html = renderToStaticMarkup(await Page());
  assert.doesNotMatch(html, /ada@example\.com/);
  assert.doesNotMatch(html, /other@example\.com/);
  assert.doesNotMatch(html, /Ada|Welcome|Account active/);
  assert.match(html, /account menu/);
  assert.match(html, /Playground/);
  assert.match(html, /Research/);
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
    assert.equal(form.props.forceRedirectUrl, "/platform");
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
  });
  assert.equal(await Layout({ children: "workspace" }), "workspace");
  assert.deepEqual(calls, ["user_authenticated"]);
});
