const assert = require("node:assert/strict");
const test = require("node:test");
const { loadTypeScript } = require("./load-typescript.cjs");

function mountCanvas(t, { mobile = false, reducedMotion = false } = {}) {
  const previous = new Map();
  const install = (name, value) => {
    previous.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  };
  const frames = new Map();
  let sequence = 0;
  let cleanup;
  let tree;
  const intersections = [];
  const resizes = [];
  let draws = 0;
  const mobileQuery = Object.assign(new EventTarget(), { matches: mobile });
  const motionQuery = Object.assign(new EventTarget(), { matches: reducedMotion });
  const document = Object.assign(new EventTarget(), { hidden: false });
  const context = {
    clearRect() { draws++; },
    setTransform() {}, beginPath() {}, arc() {}, fill() {},
  };
  const canvas = Object.assign(new EventTarget(), {
    width: 2048, height: 691,
    getContext: () => context,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 300, height: 101 }),
  });
  install("window", {
    devicePixelRatio: 2,
    matchMedia: (query) => query.includes("reduced-motion") ? motionQuery : mobileQuery,
    requestAnimationFrame: (callback) => { frames.set(++sequence, callback); return sequence; },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  install("document", document);
  install("IntersectionObserver", class {
    constructor(callback) { this.callback = callback; intersections.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  });
  install("ResizeObserver", class {
    constructor(callback) { this.callback = callback; resizes.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  });
  t.after(() => {
    cleanup?.();
    for (const [name, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  });
  const { MoversCanvas } = loadTypeScript("components/movers-canvas.tsx", {
    react: {
      useRef: () => ({ current: canvas }),
      useEffect: (effect) => { cleanup = effect(); },
    },
  });
  tree = MoversCanvas();
  return {
    canvas, frames, document, motionQuery, tree,
    get draws() { return draws; },
    get intersection() { return intersections[0]; },
    get resize() { return resizes[0]; },
    visible(value) { intersections[0].callback([{ isIntersecting: value }]); },
    pointer() { canvas.dispatchEvent(Object.assign(new Event("pointermove"), { clientX: 150, clientY: 50 })); },
    tick() {
      const [id, callback] = frames.entries().next().value;
      frames.delete(id);
      callback(16);
    },
    unmount() { cleanup(); cleanup = undefined; },
  };
}

test("desktop canvas matches its displayed size and stops when idle or offscreen", (t) => {
  const app = mountCanvas(t);
  assert.equal(app.canvas.width, 600);
  assert.equal(app.canvas.height, 202);
  assert.equal(app.frames.size, 0);
  app.visible(true);
  app.tick();
  assert.equal(app.frames.size, 0, "stationary particles should not schedule another frame");
  app.pointer();
  assert.equal(app.frames.size, 1);
  app.visible(false);
  assert.equal(app.frames.size, 0);
  app.unmount();
  app.pointer();
  assert.equal(app.frames.size, 0);
  assert.ok(app.intersection.disconnected && app.resize.disconnected);
});

test("particle layout is owned by a fixed-ratio wrapper, independently of bitmap resizing", (t) => {
  const app = mountCanvas(t);
  assert.equal(app.tree.type, "div");
  assert.equal(app.tree.props.style.aspectRatio, "2048 / 691");
  assert.equal(app.tree.props.children.type, "canvas");
  assert.equal(app.tree.props.children.props.className, "simple-home-particle-canvas");
  const initialDraws = app.draws;
  app.resize.callback();
  app.resize.callback();
  assert.equal(app.draws, initialDraws, "unchanged dimensions must not reset the bitmap");
  assert.equal(app.tree.props.style.aspectRatio, "2048 / 691");
});

test("mobile animation pauses in a hidden document and reacts to reduced-motion changes", (t) => {
  const app = mountCanvas(t, { mobile: true });
  app.visible(true);
  app.tick();
  assert.equal(app.frames.size, 1);
  app.document.hidden = true;
  app.document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(app.frames.size, 0);
  app.document.hidden = false;
  app.document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(app.frames.size, 1);
  app.motionQuery.matches = true;
  app.motionQuery.dispatchEvent(new Event("change"));
  app.pointer();
  assert.equal(app.frames.size, 0);
});

test("reduced-motion users get a static canvas even when moving the pointer", (t) => {
  const app = mountCanvas(t, { mobile: true, reducedMotion: true });
  assert.ok(app.draws > 0);
  app.visible(true);
  app.pointer();
  assert.equal(app.frames.size, 0);
});
