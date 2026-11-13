const assert = require("node:assert/strict");
const test = require("node:test");
const { NextRequest } = require("next/server");
const { loadTypeScript } = require("./load-typescript.cjs");
const { proxy } = loadTypeScript("proxy.ts");

test("legacy lab URLs redirect to real public paths and preserve query strings", () => {
  for (const [url, destination] of [
    ["https://lab.atomctrl.com/", "https://atomctrl.com/"],
    ["https://lab.atomctrl.com/research?from=lab", "https://atomctrl.com/research?from=lab"],
    ["https://atomctrl.com/lab/research", "https://atomctrl.com/research"],
    ["https://atomctrl.com/lab", "https://atomctrl.com/"],
  ]) {
    const response = proxy(new NextRequest(url));
    assert.equal(response.headers.get("location"), destination);
    assert.equal(response.headers.get("x-middleware-rewrite"), null);
  }
});

test("ordinary routes and unrelated lab prefixes pass through", () => {
  for (const path of ["/", "/research", "/laboratory", "/llms.txt", "/assets/goal-image.png"]) {
    assert.equal(proxy(new NextRequest(`https://atomctrl.com${path}`)).headers.get("location"), null);
  }
});
