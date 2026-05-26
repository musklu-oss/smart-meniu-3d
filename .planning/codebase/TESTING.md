# Testing Patterns

**Analysis Date:** 2026-05-26

## Current State

**No tests exist in the project.** There are no test files, no test directories, and no test runner configuration outside of `package.json`. The project is a prototype (`README.md` explicitly uses the word "Prototip").

---

## Test Framework

**Runner:**
- Playwright `^1.60.0` — installed as a dependency in `package.json`
- Config: none — no `playwright.config.js` or `playwright.config.ts` present
- No `scripts` field in `package.json` — no test run commands defined

**Assertion Library:**
- Playwright's built-in `expect` (from `@playwright/test`)

**Run Commands:**
```bash
# None configured yet — these would be the standard commands once set up:
npx playwright test              # Run all tests
npx playwright test --headed     # Run with visible browser
npx playwright test --ui         # Playwright UI mode
npx playwright show-report       # View HTML report
```

---

## What Playwright Is Suited For Here

This is a browser-only, single-page, no-server app. Playwright is the correct choice because:

1. The entire app runs in a browser — unit testing has no DOM or WebGL context
2. Core behavior (AR loading, IndexedDB caching, progress UI) is only testable end-to-end
3. MindAR.js and Three.js are CDN globals — no module-level unit testing is possible without mocking the entire window namespace

---

## Recommended Test Structure (not yet implemented)

**Directory:**
```
meniu 3D/
└── tests/
    ├── loading.spec.js       # Progress bar, loading states
    ├── cache.spec.js         # IndexedDB cache hit/miss behavior
    └── ar-overlay.spec.js    # Product overlay visibility (if mockable)
```

**Naming convention:** `*.spec.js` — matches Playwright default discovery pattern.

---

## Recommended Test Patterns

**Basic Playwright test structure:**
```js
import { test, expect } from '@playwright/test';

test('shows loading screen on start', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await expect(page.locator('#loading')).toBeVisible();
  await expect(page.locator('#progress-text')).toContainText('Se incarca');
});
```

**IndexedDB cache test (first load vs. cached load):**
```js
test('uses cached target on second load', async ({ page, context }) => {
  // First load — populates cache
  await page.goto('http://localhost:8080');
  await page.waitForFunction(() =>
    document.getElementById('loading').style.display === 'none'
  , { timeout: 60000 });

  // Second load — should hit cache
  const page2 = await context.newPage();
  await page2.goto('http://localhost:8080');
  await expect(page2.locator('#progress-text')).toContainText('Cache gasit');
});
```

**Error state test:**
```js
test('shows error message when assets fail to load', async ({ page }) => {
  await page.route('**/assets/images/target.jpg', route => route.abort());
  await page.goto('http://localhost:8080');
  await expect(page.locator('#progress-text')).toContainText('Eroare:');
});
```

---

## Mocking

**Framework:** Playwright's `page.route()` for network interception — no separate mock library needed.

**What to mock:**
- Asset fetch failures (`target.jpg`, `.glb` model) to test error paths
- Slow network responses to test progress bar states

**What NOT to mock:**
- IndexedDB — use the real browser API; Playwright runs in a real Chromium context
- MindAR / Three.js — too complex to mock; skip AR rendering tests or mark as manual

---

## Playwright Configuration (recommended setup)

Create `playwright.config.js` at project root:

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
  },
  webServer: {
    command: 'npx serve . -p 8080',
    port: 8080,
    reuseExistingServer: !process.env.CI,
  },
});
```

And add scripts to `package.json`:
```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "serve": "npx serve . -p 8080"
  }
}
```

---

## Coverage

**Requirements:** None enforced. No coverage tooling configured.

**Playwright does not provide JS coverage out of the box** — would require `page.coverage.startJSCoverage()` from CDP if needed.

---

## Test Types

**Unit Tests:**
- Not applicable — all logic is tightly coupled to browser APIs (IndexedDB, Canvas, CDN globals). The one extractable unit is the IndexedDB Promise-wrapping pattern, but this is trivial and not worth isolating.

**Integration Tests:**
- Not applicable at this scale.

**E2E Tests (Playwright):**
- Correct approach for this project
- Scope: page load sequence, progress bar updates, cache behavior, error display
- AR rendering itself (camera, image tracking) cannot be reliably automated — mark as manual test

---

## Manual Test Checklist

Until automated tests exist, test these manually after any change:

- [ ] First load: progress bar advances from 0% to 100%
- [ ] First load: "Compilare target AR..." message appears with percentage
- [ ] Second load (same browser): "Cache gasit, se porneste AR..." appears immediately
- [ ] Camera permission prompt appears on mobile
- [ ] Product overlay appears when marker is detected
- [ ] Product overlay disappears when marker is lost
- [ ] Error message displayed when network fails (`#progress-text` shows "Eroare: ...")
- [ ] No console errors on clean load
- [ ] Works on Chrome Android (primary target)

---

*Testing analysis: 2026-05-26*
