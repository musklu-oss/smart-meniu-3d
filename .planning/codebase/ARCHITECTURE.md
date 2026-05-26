# Architecture

**Analysis Date:** 2026-05-26

## Pattern Overview

**Overall:** Single-page vanilla JS application — no framework, no build pipeline, no module bundler.

**Key Characteristics:**
- All logic lives in one `index.html` file (inline `<script>` block)
- External libraries loaded via CDN at runtime (MindAR + Three.js)
- Two distinct runtime paths: browser AR mode (`index.html`) and Node.js offline compile mode (`compile-target.mjs`)
- `style.css` defines a separate visual system (product card layout) not yet wired to `index.html` — exists as a future/parallel UI layer

## Layers

**Presentation Layer:**
- Purpose: Loading screen, AR viewport, product overlay
- Location: `index.html` (inline `<style>` + DOM structure)
- Contains: `#loading`, `#ar-container`, `#product-overlay` — three mutually exclusive UI states
- Depends on: JS layer to toggle `display` visibility
- Used by: End user via browser/camera

**Styling Layer (Product Card):**
- Purpose: CSS design system for product detail page
- Location: `style.css`
- Contains: CSS custom properties (`--accent: #e8c97a`), `.product-info`, `.ar-button`, `model-viewer` element styles
- Depends on: Nothing (standalone CSS)
- Used by: Not yet linked to `index.html` — intended for a future product card view or separate page

**AR Logic Layer:**
- Purpose: Camera access, image target tracking, 3D model rendering
- Location: `index.html` inline `<script>` (lines 56–172)
- Contains: IndexedDB cache management, MindAR initialization, Three.js render loop
- Depends on: `window.MINDAR.IMAGE` (CDN), `window.THREE.GLTFLoader` (CDN)
- Used by: Auto-invoked via IIFE at page load

**Asset Compilation Layer:**
- Purpose: Offline pre-compilation of `.mind` target file from source JPEG
- Location: `compile-target.mjs`
- Contains: Node.js script using `canvas` + `mind-ar` npm packages to export `assets/targets/targets.mind`
- Depends on: `npm` packages (`canvas`, `mind-ar`)
- Used by: Developer CLI — run once to regenerate targets when source image changes

## Data Flow

**First Load (no cache):**

1. Page loads → `#loading` visible, `#ar-container` hidden
2. IIFE calls `getTargetBuffer()`
3. `openDB()` opens IndexedDB `smart-meniu-cache`
4. `getCached()` returns `null` → no cache found
5. `target.jpg` fetched from `assets/images/`, drawn to off-screen `<canvas>`
6. `MINDAR.IMAGE.Compiler` compiles canvas → binary buffer (progress 10–95%)
7. `saveCache()` persists buffer to IndexedDB key `target-v1`
8. `startAR(buffer)` called → `Blob` URL created from buffer
9. `MindARThree` initialized on `#ar-container`
10. `GLTFLoader` loads `assets/models/ballotin_of_saithe_with_herbs.glb`
11. Model anchored to tracking target index 0
12. `#loading` hidden, render loop starts via `renderer.setAnimationLoop()`

**Subsequent Loads (cache hit):**

1. Steps 1–4 same
2. `getCached()` returns cached `ArrayBuffer` → steps 5–7 skipped
3. Jumps directly to `startAR()` — faster startup

**Target Found / Lost:**

1. MindAR detects image target in camera feed
2. `anchor.onTargetFound` → `#product-overlay` shown
3. `anchor.onTargetLost` → `#product-overlay` hidden

**State Management:**
- No state object. UI state controlled entirely by DOM `display` property toggling.
- AR tracking state managed internally by MindAR library.
- Cache state stored in IndexedDB (`smart-meniu-cache` / `targets` object store / key `target-v1`).

## Key Abstractions

**Target Buffer:**
- Purpose: Binary representation of compiled AR tracking data
- Examples: `index.html` lines 91–120, `compile-target.mjs`
- Pattern: Generated at runtime in browser via `MINDAR.IMAGE.Compiler`, or pre-generated offline via `compile-target.mjs`. Cached in IndexedDB to avoid recompile on every visit.

**Anchor:**
- Purpose: Three.js group that MindAR attaches to a tracked image target
- Examples: `index.html` line 144 (`mindarThree.addAnchor(0)`)
- Pattern: `anchor.group.add(model)` — 3D object parented to tracking anchor; anchor index maps to target position in compiled `.mind` file

**IndexedDB Cache:**
- Purpose: Persist compiled target buffer across page reloads to eliminate 10–30s compile time
- Examples: `openDB()`, `getCached()`, `saveCache()` in `index.html` lines 60–84
- Pattern: Raw `ArrayBuffer` stored under string key `target-v1`; version bump in key forces recompile when target image changes

## Entry Points

**Browser Entry Point:**
- Location: `index.html`
- Triggers: User opens URL in browser
- Responsibilities: Load CDN scripts, initialize loading UI, run IIFE that orchestrates full AR startup

**Developer CLI Entry Point:**
- Location: `compile-target.mjs`
- Triggers: `node compile-target.mjs` (manual) or npm script
- Responsibilities: Read `assets/images/target.jpg`, compile to `assets/targets/targets.mind`, write to disk

## Error Handling

**Strategy:** Single top-level try/catch in the IIFE. All errors surface to `#progress-text` in the loading screen.

**Patterns:**
- `try { ... } catch (err) { document.getElementById('progress-text').textContent = 'Eroare: ' + err.message; console.error(err); }` — inline in `index.html` lines 163–170
- No partial error recovery — any failure leaves user on loading screen
- IndexedDB errors in `getCached()` resolve to `null` (silent fallback to recompile)

## Cross-Cutting Concerns

**Logging:** `console.error(err)` on fatal failure only. No structured logging.
**Validation:** None — no input validation (camera-only app, no user text input).
**Authentication:** None — public, no auth required.
**Progress Feedback:** `setProgress(pct, text)` utility updates `#progress-fill` width and `#progress-text` content. Called at key milestones during compilation.

---

*Architecture analysis: 2026-05-26*
