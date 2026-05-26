# Coding Conventions

**Analysis Date:** 2026-05-26

## Overview

Pure HTML/JS codebase — no framework, no transpiler, no bundler. All JavaScript lives inline in `index.html` inside a `<script>` tag. The sole Node.js utility script is `compile-target.mjs` (ES module). CSS is split into two locations: inline `<style>` in `index.html` and the external `style.css` file.

---

## Naming Patterns

**Files:**
- `kebab-case` for all assets and scripts: `compile-target.mjs`, `ballotin_of_saithe_with_herbs.glb`
- Asset filenames follow the product name (snake_case for 3D models)

**Functions:**
- `camelCase` for all functions: `openDB()`, `getCached()`, `saveCache()`, `setProgress()`, `getTargetBuffer()`, `startAR()`
- Verb + noun pattern: `getTargetBuffer`, `saveCache`, `setProgress`
- Async functions are named identically to sync functions — the `async` keyword signals the difference

**Variables:**
- `camelCase` for local variables: `targetBuffer`, `targetSrc`, `mindarThree`, `imagePath`, `outputPath`
- `SCREAMING_SNAKE_CASE` for module-level constants: `CACHE_DB`, `CACHE_KEY`

**DOM IDs:**
- `kebab-case`: `#loading`, `#progress-bar`, `#progress-fill`, `#progress-text`, `#ar-container`, `#product-overlay`

**CSS Classes:**
- `kebab-case`: `.ar-button`, `.product-info`, `.product-name`, `.product-footer`, `.product-price`, `.product-badge`, `.viewer-wrap`, `.restaurant-name`

---

## Code Style

**Formatting:**
- 2-space indentation throughout (both HTML and JS)
- Single quotes for JS strings; double quotes for HTML attributes
- No trailing semicolons are NOT avoided — semicolons ARE used consistently
- Arrow functions used for callbacks: `e => e.target.result`, `(pct) => { ... }`

**Linting:**
- No ESLint config present — no enforced linting

**CSS Variables:**
- Defined on `:root` in `style.css`:
  - `--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`
- Accent color `#e8c97a` (gold) is the single brand color used for price, progress bar, AR button
- Inline `<style>` in `index.html` hardcodes the same color values (not using CSS variables) — inconsistency exists between the two style locations

---

## Import Organization

**Browser (`index.html`):**
- CDN scripts loaded via `<script src>` before inline JS:
  1. `mind-ar@1.2.5/dist/mindar-image.prod.js` (CDN)
  2. `mind-ar@1.2.5/dist/mindar-image-three.prod.js` (CDN — includes Three.js)
- No ES module imports in browser JS; globals accessed via `window.MINDAR`, `window.THREE`

**Node.js (`compile-target.mjs`):**
- Named ES module imports at top of file
- Order: npm packages first, then Node built-ins (`fs`, `path`)

---

## Async Patterns

**Primary pattern:** `async/await` for all async operations.

**IndexedDB bridge pattern** — IndexedDB uses callbacks, so each operation is wrapped in a `new Promise()`:

```js
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(CACHE_DB, 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore('targets');
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = reject;
  });
}
```

**Image load bridge pattern** — same approach for image loading:
```js
await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
```

**GLTF loader bridge pattern:**
```js
const gltf = await new Promise((res, rej) => {
  loader.load('assets/models/ballotin_of_saithe_with_herbs.glb', res, undefined, rej);
});
```

**Top-level IIFE** — browser JS entry point uses an async IIFE (no top-level await in browser):
```js
(async () => {
  try {
    const buffer = await getTargetBuffer();
    await startAR(buffer);
  } catch (err) {
    document.getElementById('progress-text').textContent = 'Eroare: ' + err.message;
    console.error(err);
  }
})();
```

**Node.js (`compile-target.mjs`):** Uses top-level await directly (`.mjs` module context).

---

## Error Handling

**Strategy:** Single top-level try/catch in the IIFE entry point. Individual helper functions propagate errors upward via rejected Promises or thrown exceptions.

**User-facing errors:**
- Error message displayed in `#progress-text` DOM element: `'Eroare: ' + err.message`
- `console.error(err)` for developer debugging

**Silent fallbacks for cache:**
- `getCached` resolves with `null` on error (never rejects): `req.onerror = () => resolve(null)`
- This means a cache miss is treated identically to a cache read error — intentional resilience

**No error handling for:**
- `saveCache` — transaction failure is silently ignored
- `setProgress` — DOM access failures would propagate up

---

## DOM Interaction Patterns

- Direct `document.getElementById()` — no abstraction layer
- Show/hide via `element.style.display = 'block'/'none'`
- Progress updates via direct property assignment: `element.style.width = pct + '%'`, `element.textContent = text`
- No event listeners on user interaction (AR is passive — target detection drives overlay visibility)

---

## Language Mix

| File | Language | Context |
|------|----------|---------|
| `index.html` | HTML + inline CSS + inline JS | Browser |
| `style.css` | CSS | Browser (external, not currently linked from `index.html`) |
| `compile-target.mjs` | ES Module JavaScript | Node.js build tool |

Note: `style.css` exists and contains polished UI styles (CSS variables, component classes) but `index.html` has its own `<style>` block with separate, simpler styles. `style.css` appears to belong to an alternate/future `model-viewer`-based page that is not yet implemented.

---

## Function Design

**Size:** Functions are small and single-purpose (5–15 lines each).

**Parameters:** Minimal — each function takes only what it needs. DB handle passed explicitly: `getCached(db)`, `saveCache(db, buffer)`.

**Return values:** Always meaningful — DB handle, buffer, or resolved null. No functions return undefined as a meaningful value.

**No comments** in existing code — functions are self-documenting by name. This is the established pattern; follow it.

---

## Module Design

**Browser:** Single `<script>` block, no modules. All functions are in the same closure/global scope.

**Node.js:** ESM (`import`/`export`), class extension for compiler override (`class NodeCompiler extends Compiler`).

---

*Convention analysis: 2026-05-26*
