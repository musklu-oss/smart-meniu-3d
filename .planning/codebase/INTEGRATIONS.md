# External Integrations

**Analysis Date:** 2026-05-26

## CDN Libraries

**jsDelivr CDN:**
- `mind-ar@1.2.5` core — image tracking runtime
  - URL: `https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image.prod.js`
  - Loaded in: `index.html` line 54
- `mind-ar@1.2.5` Three.js bridge — 3D renderer integration
  - URL: `https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js`
  - Loaded in: `index.html` line 55
- Three.js bundled inside both MindAR scripts above; exposed as `window.THREE`
- No fallback / integrity hash on CDN `<script>` tags

**Note on `@google/model-viewer`:**
- Referenced in `style.css` (`.ar-button`, `model-viewer` element selector) and `README.md`
- Not loaded in current `index.html` — appears to be a prior implementation, not active

## Data Storage

**Databases:**
- IndexedDB (browser-native) — caches compiled AR target binary to avoid recompilation
  - DB name: `smart-meniu-cache`
  - Object store: `targets`
  - Key: `target-v1`
  - Implementation: `index.html` lines 60–84

**File Storage:**
- Local filesystem (static assets served alongside HTML)
  - `assets/images/target.jpg` — AR tracking marker image
  - `assets/models/ballotin_of_saithe_with_herbs.glb` — GLTF binary 3D model
  - `assets/models/Ballotin_of_saithe_with_herbs.usdz` — USDZ model for iOS AR Quick Look
  - `assets/targets/targets.mind` — precompiled MindAR target (output of `compile-target.mjs`)

**Caching:**
- Browser IndexedDB only (see above)

## Authentication & Identity

**Auth Provider:**
- None — fully public, no authentication layer

## Device APIs

**Camera:**
- WebRTC `getUserMedia` — accessed internally by MindAR.js for live video feed
- Requires HTTPS and user permission grant at runtime

**WebXR / AR Quick Look:**
- iOS: `.usdz` model triggers AR Quick Look via Safari (native, no JS required)
- Android: WebXR or Scene Viewer via `@google/model-viewer` (inactive in current build)

## Monitoring & Observability

**Error Tracking:**
- None — errors displayed inline via `#progress-text` DOM element (`index.html` line 168)

**Logs:**
- `console.error(err)` on catch in main IIFE (`index.html` line 169)
- No structured logging, no external service

## CI/CD & Deployment

**Hosting:**
- GitHub Pages (per `README.md`) — static file serving, no server runtime

**CI Pipeline:**
- Not detected — no `.github/workflows/` directory, no CI config files

## Environment Configuration

**Required env vars:**
- None — no environment variables used anywhere in the project

**Secrets location:**
- Not applicable — no API keys, tokens, or secrets in use

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None — fully offline-capable after initial CDN load

## External Data Sources

**Product data:**
- Hardcoded directly in `index.html` (product name, description, price in RON)
- No external CMS, API, or database for menu items

---

*Integration audit: 2026-05-26*
