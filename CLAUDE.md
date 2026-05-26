<!-- GSD:project-start source:PROJECT.md -->
## Project

**Smart Meniu 3D**

Aplicație web browser-based de AR (Augmented Reality) pentru restaurante. Clientul scanează un QR code de pe meniu → se deschide pagina în browser → camera detectează imaginea produsului din meniu → modelul 3D al preparatului apare lipit de imagine, animat în timp real. Fără app de instalat, funcționează direct din browser pe orice telefon modern.

**Core Value:** Camera detectează imaginea produsului și modelul 3D apare lipit de meniu — fără app, direct din browser.

### Constraints

- **Tech stack:** MindAR.js + Three.js — decizie finală, nu se schimbă
- **Hosting:** GitHub Pages — gratuit, fără server necesar
- **Prototip:** 1 singur produs, nu sistem multi-produs
- **Browser-only:** Fără app nativ — funcționează pe orice telefon cu browser modern + cameră
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- HTML5 - Single-page AR application entry point (`index.html`)
- JavaScript (ES2020+, async/await, modules) - All runtime logic inline in `index.html`
- CSS3 (custom properties / variables) - Shared stylesheet `style.css`
- JavaScript ESM (`.mjs`) - Build-time target compiler script (`compile-target.mjs`)
## Runtime
- Browser (Chrome/Android for AR, Safari/iOS for AR via WebXR / model-viewer)
- Node.js - Required only for offline target compilation via `compile-target.mjs`
- npm
- Lockfile: Not detected (`package-lock.json` absent from project root — only `node_modules` present)
## Frameworks
- MindAR.js `1.2.5` - Image tracking and AR orchestration; loaded via CDN
- Three.js (bundled inside MindAR) - 3D scene, renderer, camera; exposed as `window.THREE`
- `@google/model-viewer` - Web component for interactive 3D + native AR (referenced in `style.css` via `model-viewer` element selector and `README.md`; not loaded in current `index.html`)
- No build tool in use for the browser app — plain HTML + CDN scripts
- Vite (present in `node_modules` as transitive dependency of `mind-ar`) — not directly configured for this project
- Playwright `^1.60.0` - Listed as direct dependency in `package.json`; no test files detected at project root
## Key Dependencies
- `mind-ar@1.2.5` - Image target detection and AR session management
- Three.js (version bundled with MindAR `1.2.5`) - Exposed as `window.THREE.GLTFLoader`
- `mind-ar@^1.2.5` - Source import for `Compiler` class (`mind-ar/src/image-target/compiler-base.js`)
- `canvas@^3.2.3` - Node.js canvas implementation for image processing during target compilation
- `playwright@^1.60.0` - Browser automation (purpose: likely E2E/screenshot testing)
## Configuration
- No `.env` files detected
- No environment variables required at runtime
- All configuration is hardcoded in `index.html` (target image path, model path, product data)
- No build config files (`vite.config.*`, `webpack.config.*`, `tsconfig.json` absent at project root)
- `compile-target.mjs` is a standalone Node.js script; run directly with `node compile-target.mjs`
- IndexedDB used to cache compiled AR target data (`CACHE_DB = 'smart-meniu-cache'`, key `target-v1`)
- Avoids recompiling the target image on repeat visits
## Platform Requirements
- Node.js (any recent LTS) — only for running `compile-target.mjs`
- npm — dependency installation
- Modern browser with camera access for AR testing
- Static file hosting only (no server-side runtime required)
- GitHub Pages (per `README.md`)
- HTTPS mandatory — browser camera API requires secure context
- Assets required at deploy:
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Overview
## Naming Patterns
- `kebab-case` for all assets and scripts: `compile-target.mjs`, `ballotin_of_saithe_with_herbs.glb`
- Asset filenames follow the product name (snake_case for 3D models)
- `camelCase` for all functions: `openDB()`, `getCached()`, `saveCache()`, `setProgress()`, `getTargetBuffer()`, `startAR()`
- Verb + noun pattern: `getTargetBuffer`, `saveCache`, `setProgress`
- Async functions are named identically to sync functions — the `async` keyword signals the difference
- `camelCase` for local variables: `targetBuffer`, `targetSrc`, `mindarThree`, `imagePath`, `outputPath`
- `SCREAMING_SNAKE_CASE` for module-level constants: `CACHE_DB`, `CACHE_KEY`
- `kebab-case`: `#loading`, `#progress-bar`, `#progress-fill`, `#progress-text`, `#ar-container`, `#product-overlay`
- `kebab-case`: `.ar-button`, `.product-info`, `.product-name`, `.product-footer`, `.product-price`, `.product-badge`, `.viewer-wrap`, `.restaurant-name`
## Code Style
- 2-space indentation throughout (both HTML and JS)
- Single quotes for JS strings; double quotes for HTML attributes
- No trailing semicolons are NOT avoided — semicolons ARE used consistently
- Arrow functions used for callbacks: `e => e.target.result`, `(pct) => { ... }`
- No ESLint config present — no enforced linting
- Defined on `:root` in `style.css`:
- Accent color `#e8c97a` (gold) is the single brand color used for price, progress bar, AR button
- Inline `<style>` in `index.html` hardcodes the same color values (not using CSS variables) — inconsistency exists between the two style locations
## Import Organization
- CDN scripts loaded via `<script src>` before inline JS:
- No ES module imports in browser JS; globals accessed via `window.MINDAR`, `window.THREE`
- Named ES module imports at top of file
- Order: npm packages first, then Node built-ins (`fs`, `path`)
## Async Patterns
## Error Handling
- Error message displayed in `#progress-text` DOM element: `'Eroare: ' + err.message`
- `console.error(err)` for developer debugging
- `getCached` resolves with `null` on error (never rejects): `req.onerror = () => resolve(null)`
- This means a cache miss is treated identically to a cache read error — intentional resilience
- `saveCache` — transaction failure is silently ignored
- `setProgress` — DOM access failures would propagate up
## DOM Interaction Patterns
- Direct `document.getElementById()` — no abstraction layer
- Show/hide via `element.style.display = 'block'/'none'`
- Progress updates via direct property assignment: `element.style.width = pct + '%'`, `element.textContent = text`
- No event listeners on user interaction (AR is passive — target detection drives overlay visibility)
## Language Mix
| File | Language | Context |
|------|----------|---------|
| `index.html` | HTML + inline CSS + inline JS | Browser |
| `style.css` | CSS | Browser (external, not currently linked from `index.html`) |
| `compile-target.mjs` | ES Module JavaScript | Node.js build tool |
## Function Design
## Module Design
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- All logic lives in one `index.html` file (inline `<script>` block)
- External libraries loaded via CDN at runtime (MindAR + Three.js)
- Two distinct runtime paths: browser AR mode (`index.html`) and Node.js offline compile mode (`compile-target.mjs`)
- `style.css` defines a separate visual system (product card layout) not yet wired to `index.html` — exists as a future/parallel UI layer
## Layers
- Purpose: Loading screen, AR viewport, product overlay
- Location: `index.html` (inline `<style>` + DOM structure)
- Contains: `#loading`, `#ar-container`, `#product-overlay` — three mutually exclusive UI states
- Depends on: JS layer to toggle `display` visibility
- Used by: End user via browser/camera
- Purpose: CSS design system for product detail page
- Location: `style.css`
- Contains: CSS custom properties (`--accent: #e8c97a`), `.product-info`, `.ar-button`, `model-viewer` element styles
- Depends on: Nothing (standalone CSS)
- Used by: Not yet linked to `index.html` — intended for a future product card view or separate page
- Purpose: Camera access, image target tracking, 3D model rendering
- Location: `index.html` inline `<script>` (lines 56–172)
- Contains: IndexedDB cache management, MindAR initialization, Three.js render loop
- Depends on: `window.MINDAR.IMAGE` (CDN), `window.THREE.GLTFLoader` (CDN)
- Used by: Auto-invoked via IIFE at page load
- Purpose: Offline pre-compilation of `.mind` target file from source JPEG
- Location: `compile-target.mjs`
- Contains: Node.js script using `canvas` + `mind-ar` npm packages to export `assets/targets/targets.mind`
- Depends on: `npm` packages (`canvas`, `mind-ar`)
- Used by: Developer CLI — run once to regenerate targets when source image changes
## Data Flow
- No state object. UI state controlled entirely by DOM `display` property toggling.
- AR tracking state managed internally by MindAR library.
- Cache state stored in IndexedDB (`smart-meniu-cache` / `targets` object store / key `target-v1`).
## Key Abstractions
- Purpose: Binary representation of compiled AR tracking data
- Examples: `index.html` lines 91–120, `compile-target.mjs`
- Pattern: Generated at runtime in browser via `MINDAR.IMAGE.Compiler`, or pre-generated offline via `compile-target.mjs`. Cached in IndexedDB to avoid recompile on every visit.
- Purpose: Three.js group that MindAR attaches to a tracked image target
- Examples: `index.html` line 144 (`mindarThree.addAnchor(0)`)
- Pattern: `anchor.group.add(model)` — 3D object parented to tracking anchor; anchor index maps to target position in compiled `.mind` file
- Purpose: Persist compiled target buffer across page reloads to eliminate 10–30s compile time
- Examples: `openDB()`, `getCached()`, `saveCache()` in `index.html` lines 60–84
- Pattern: Raw `ArrayBuffer` stored under string key `target-v1`; version bump in key forces recompile when target image changes
## Entry Points
- Location: `index.html`
- Triggers: User opens URL in browser
- Responsibilities: Load CDN scripts, initialize loading UI, run IIFE that orchestrates full AR startup
- Location: `compile-target.mjs`
- Triggers: `node compile-target.mjs` (manual) or npm script
- Responsibilities: Read `assets/images/target.jpg`, compile to `assets/targets/targets.mind`, write to disk
## Error Handling
- `try { ... } catch (err) { document.getElementById('progress-text').textContent = 'Eroare: ' + err.message; console.error(err); }` — inline in `index.html` lines 163–170
- No partial error recovery — any failure leaves user on loading screen
- IndexedDB errors in `getCached()` resolve to `null` (silent fallback to recompile)
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
