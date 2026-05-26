# Technology Stack

**Analysis Date:** 2026-05-26

## Languages

**Primary:**
- HTML5 - Single-page AR application entry point (`index.html`)
- JavaScript (ES2020+, async/await, modules) - All runtime logic inline in `index.html`
- CSS3 (custom properties / variables) - Shared stylesheet `style.css`

**Secondary:**
- JavaScript ESM (`.mjs`) - Build-time target compiler script (`compile-target.mjs`)

## Runtime

**Environment:**
- Browser (Chrome/Android for AR, Safari/iOS for AR via WebXR / model-viewer)
- Node.js - Required only for offline target compilation via `compile-target.mjs`

**Package Manager:**
- npm
- Lockfile: Not detected (`package-lock.json` absent from project root — only `node_modules` present)

## Frameworks

**Core:**
- MindAR.js `1.2.5` - Image tracking and AR orchestration; loaded via CDN
- Three.js (bundled inside MindAR) - 3D scene, renderer, camera; exposed as `window.THREE`

**3D Viewer (alternative / style.css references):**
- `@google/model-viewer` - Web component for interactive 3D + native AR (referenced in `style.css` via `model-viewer` element selector and `README.md`; not loaded in current `index.html`)

**Build/Dev:**
- No build tool in use for the browser app — plain HTML + CDN scripts
- Vite (present in `node_modules` as transitive dependency of `mind-ar`) — not directly configured for this project

**Testing:**
- Playwright `^1.60.0` - Listed as direct dependency in `package.json`; no test files detected at project root

## Key Dependencies

**Critical (browser runtime — CDN):**
- `mind-ar@1.2.5` - Image target detection and AR session management
  - Loaded from: `https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image.prod.js`
  - Three.js bridge: `https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js`
- Three.js (version bundled with MindAR `1.2.5`) - Exposed as `window.THREE.GLTFLoader`

**Node.js (compile-time only):**
- `mind-ar@^1.2.5` - Source import for `Compiler` class (`mind-ar/src/image-target/compiler-base.js`)
- `canvas@^3.2.3` - Node.js canvas implementation for image processing during target compilation

**Development / QA:**
- `playwright@^1.60.0` - Browser automation (purpose: likely E2E/screenshot testing)

## Configuration

**Environment:**
- No `.env` files detected
- No environment variables required at runtime
- All configuration is hardcoded in `index.html` (target image path, model path, product data)

**Build:**
- No build config files (`vite.config.*`, `webpack.config.*`, `tsconfig.json` absent at project root)
- `compile-target.mjs` is a standalone Node.js script; run directly with `node compile-target.mjs`

**Browser Caching:**
- IndexedDB used to cache compiled AR target data (`CACHE_DB = 'smart-meniu-cache'`, key `target-v1`)
- Avoids recompiling the target image on repeat visits

## Platform Requirements

**Development:**
- Node.js (any recent LTS) — only for running `compile-target.mjs`
- npm — dependency installation
- Modern browser with camera access for AR testing

**Production:**
- Static file hosting only (no server-side runtime required)
- GitHub Pages (per `README.md`)
- HTTPS mandatory — browser camera API requires secure context
- Assets required at deploy:
  - `assets/images/target.jpg` - AR tracking target image
  - `assets/models/ballotin_of_saithe_with_herbs.glb` - 3D model (GLTF binary)
  - `assets/models/Ballotin_of_saithe_with_herbs.usdz` - 3D model (iOS AR Quick Look)

---

*Stack analysis: 2026-05-26*
