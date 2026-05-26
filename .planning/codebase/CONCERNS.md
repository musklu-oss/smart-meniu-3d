# Codebase Concerns

**Analysis Date:** 2026-05-26

---

## Tech Debt

**README desincronizat de la stack-ul real:**
- Issue: `README.md` descrie `@google/model-viewer` și GitHub Pages, dar implementarea reală folosește MindAR.js + Three.js + IndexedDB. Stack-ul actual e complet diferit față de documentație.
- Files: `README.md`, `index.html`
- Impact: Documentație înșelătoare pentru oricine citește proiectul
- Fix approach: Rescrie README cu stack-ul real (MindAR 1.2.5, Three.js, IndexedDB, on-the-fly compilation)

**`style.css` nefolosit în `index.html`:**
- Issue: `style.css` definește clase complete (`.page`, `.header`, `.viewer-wrap`, `model-viewer`, `.ar-button`, `.product-info` etc.) pentru un UI cu `model-viewer`, dar `index.html` nu îl include (`<link>` absent) și nu folosește niciuna din aceste clase. Stilurile sunt inline în `<style>` din `index.html`.
- Files: `style.css`, `index.html`
- Impact: Dead code — `style.css` e un vestigiu al iterației anterioare (AR.js / model-viewer). Confuzie la orice modificare de UI.
- Fix approach: Șterge `style.css` sau înlocuiește stilurile inline din `index.html` cu clasele din el, dacă se dorește separarea.

**`.gitignore` corupt:**
- Issue: `.gitignore` conține `node_modules/` și `package*.json` cu spații/caractere între litere (encoding greșit, posibil UTF-16): `n o d e _ m o d u l e s /` și ` p a c k a g e * . j s o n`. Ambele reguli sunt nefuncționale.
- Files: `.gitignore`
- Impact: `node_modules/` și `package-lock.json` sunt probabil incluse în git tracking involuntar. Repo de producție va fi uriaș dacă e publicat.
- Fix approach: Rescrie `.gitignore` cu encoding UTF-8 corect.

**`compile-target.mjs` — script de Node cu metodă privată supraîncărcată:**
- Issue: `NodeCompiler` extinde `Compiler` din mind-ar și supraîncarcă `compileTrack()` apelând `this._compileOneTrack()` — metodă privată (prefix `_`). Depinde de detalii interne ale librăriei, nu de API public.
- Files: `compile-target.mjs`
- Impact: Risc de breaking la orice upgrade al mind-ar (chiar patch version). Dacă `_compileOneTrack` e redenumit sau refactorizat, script-ul se rupe silențios.
- Fix approach: Verifică dacă mind-ar 1.2.5+ expune un API public pentru Node.js compilation; dacă nu, documentează explicit dependența de versiunea fixă.

**`package.json` fără `"name"` valid și fără `"scripts"`:**
- Issue: `"name": "meniu 3D"` conține spațiu (invalid npm), nu există câmpul `"scripts"`, `"version"`, sau `"type": "module"`. Script-ul `compile-target.mjs` rulează cu `import` ES module dar fără `"type": "module"` declarat în `package.json`.
- Files: `package.json`
- Impact: `node compile-target.mjs` poate eșua pe unele versiuni Node fără `"type": "module"`. Lipsesc comenzile standardizate (`npm run compile`, `npm start`).
- Fix approach: Adaugă `"type": "module"`, `"scripts": { "compile": "node compile-target.mjs" }`, corectează `"name"`.

---

## Known Bugs

**`targets/` gol — AR nu pornește fără compilare prealabilă:**
- Symptoms: La prima vizită, compilarea on-the-fly durează 30-120 secunde pe telefon. Dacă se întrerupe (ieșire din browser, eroare de rețea), cache-ul IndexedDB rămâne incomplet sau absent. La revenire, recompilează de la zero.
- Files: `index.html` (funcția `getTargetBuffer`)
- Trigger: Prima vizită sau ștergere cache browser
- Workaround: Rulează `node compile-target.mjs` și servește `assets/targets/targets.mind` direct. `index.html` nu folosește deloc `assets/targets/targets.mind` — fișierul există ca scop al scriptului dar nu e referit în cod.

**Conflict între `compile-target.mjs` output și `index.html` input:**
- Symptoms: `compile-target.mjs` salvează `assets/targets/targets.mind`, dar `index.html` nu îl citește niciodată — compilează din nou din `target.jpg` via browser. Cele două abordări (Node pre-compile vs browser on-the-fly) coexistă fără să fie integrate.
- Files: `compile-target.mjs`, `index.html`
- Trigger: Oricând — logica e permanent deconectată
- Workaround: Niciuna — trebuie ales un singur flux și implementat complet.

**`CACHE_KEY` static `'target-v1'`:**
- Symptoms: Dacă imaginea `target.jpg` se schimbă (nou marker), cache-ul IndexedDB rămâne cu targetul vechi. Utilizatorii care au deja cache nu vor vedea schimbarea.
- Files: `index.html` (linia 58)
- Trigger: Orice actualizare a imaginii marker fără incrementarea versiunii cache
- Workaround: Schimbă manual `'target-v1'` → `'target-v2'` la fiecare update al imaginii.

---

## Security Considerations

**CDN extern fără Subresource Integrity (SRI):**
- Risk: `mind-ar@1.2.5` e încărcat de pe `cdn.jsdelivr.net` fără atribut `integrity`. Un CDN compromis sau man-in-the-middle poate injecta cod malițios executat direct pe dispozitivul utilizatorului.
- Files: `index.html` (liniile 54-55)
- Current mitigation: Niciuna
- Recommendations: Adaugă `integrity="sha384-..."` și `crossorigin="anonymous"` la ambele `<script>` tags, sau self-host librăriile.

**Camera access fără fallback explicit de permisiune:**
- Risk: `mindarThree.start()` solicită acces la cameră. Dacă utilizatorul refuză sau browserul blochează (HTTP, nu HTTPS), eroarea e prinsă generic (`err.message`) și afișată brut în UI fără instrucțiuni clare.
- Files: `index.html` (linia 167-169)
- Current mitigation: `try/catch` generic
- Recommendations: Detectează `NotAllowedError` și `NotFoundError` separat, afișează mesaj specific ("Permite accesul la cameră" / "HTTPS necesar").

**Serving pe HTTP local — camera blocată în producție:**
- Risk: Browsere moderne (Chrome, Safari) blochează `getUserMedia` pe HTTP non-localhost. Dacă aplicația e servită fără HTTPS în producție, AR nu va porni deloc fără un mesaj de eroare clar.
- Files: Infrastructură (fără server config prezent)
- Current mitigation: Niciuna documentată
- Recommendations: Forțează HTTPS la deployment. Adaugă verificare în cod: `if (location.protocol !== 'https:' && location.hostname !== 'localhost')`.

---

## Performance Bottlenecks

**Model GLB de 58MB:**
- Problem: `ballotin_of_saithe_with_herbs.glb` are 58MB. La rețea mobilă 4G (10 Mbps), descărcarea durează ~46 secunde. Nu există progress indicator pentru încărcarea modelului.
- Files: `assets/models/ballotin_of_saithe_with_herbs.glb`, `index.html` (linia 137)
- Cause: Model neoptimizat, probabil exportat direct din software 3D fără compresie
- Improvement path: Comprimă cu `gltf-pipeline` (Draco compression) — reducere tipică 70-90%. Țintă: sub 5MB. Adaugă progress callback la `loader.load()` (parametrul `onProgress` disponibil în GLTFLoader).

**Compilare on-the-fly în browser — blocare UI thread:**
- Problem: `compiler.compileImageTargets()` rulează calcule intensive (feature extraction, keypoint matching) în browser. Pe telefoane mid-range, poate dura 60-180 secunde și blochează thread-ul principal.
- Files: `index.html` (linia 112)
- Cause: MindAR Compiler rulează pe main thread fără Web Worker
- Improvement path: Integrează `assets/targets/targets.mind` pre-compilat (deja generat de `compile-target.mjs`) direct în `index.html` ca sursă primară. Elimină compilarea browser-side complet.

**Niciun lazy loading / preload strategie:**
- Problem: `index.html` încarcă sincron ambele scripturi MindAR (>500KB fiecare) înainte de orice alt conținut. Nu există `defer`, `async`, sau preload hints.
- Files: `index.html` (liniile 54-55)
- Cause: Lipsă optimizare de loading
- Improvement path: Adaugă `defer` la scripturile CDN. Consideră `<link rel="preload">` pentru GLB.

---

## Fragile Areas

**Integrarea MindAR — dependență de API intern:**
- Files: `compile-target.mjs`
- Why fragile: `NodeCompiler` apelează `this._compileOneTrack()` (metodă privată), și importă din `mind-ar/src/image-target/compiler-base.js` (path intern, nu export public). Orice restructurare internă a librăriei rupe scriptul.
- Safe modification: Fixează mind-ar la versiunea exactă `"mind-ar": "1.2.5"` (fără `^`). Nu upgrada fără a testa `compile-target.mjs`.
- Test coverage: Zero — nicio verificare automată că scriptul produce output valid.

**IndexedDB cache — fără validare a integrității datelor:**
- Files: `index.html` (funcțiile `getCached`, `saveCache`)
- Why fragile: Cache-ul stochează `ArrayBuffer` brut. Nu există verificare că buffer-ul e complet sau valid înainte de a-l pasa lui MindAR. Un buffer corupt (scriere întreruptă) va cauza crash în `mindarThree.start()` cu eroare criptică.
- Safe modification: Adaugă un flag de validitate la salvare (ex: stochează `{ buffer, valid: true }`) și verifică la citire.
- Test coverage: Zero.

**Un singur produs hardcodat:**
- Files: `index.html` (liniile 49-51, 138, 144)
- Why fragile: Numele produsului, descrierea, prețul, path-ul modelului GLB și indexul anchor-ului (`0`) sunt toate hardcodate inline. Adăugarea unui al doilea produs necesită modificări în cel puțin 5 locuri.
- Safe modification: Definește un obiect `PRODUCTS` la începutul scriptului și generează UI + AR anchors dinamic.
- Test coverage: Zero.

**Fără fallback dacă MindAR nu detectează camera:**
- Files: `index.html` (linia 154 — `await mindarThree.start()`)
- Why fragile: `mindarThree.start()` aruncă excepție la refuz cameră, HTTPS lipsă, sau cameră indisponibilă. Error handler-ul generic afișează `err.message` brut — poate fi un mesaj de browser în engleză sau cod de eroare intern MindAR, neinteligibil pentru utilizatorul final.
- Safe modification: Map explicit tipurile de erori cunoscute (`NotAllowedError`, `NotFoundError`, `OverconstrainedError`) la mesaje Romanian user-friendly.

---

## Scaling Limits

**Arhitectura curentă suportă un singur item de meniu:**
- Current capacity: 1 produs, 1 imagine marker, 1 model 3D
- Limit: MindAR suportă multiple targets într-un singur `.mind` file, dar `index.html` compilează dintr-o singură imagine și adaugă un singur anchor
- Scaling path: Pre-compilează toate imaginile marker într-un singur `targets.mind` cu `compile-target.mjs` (adaugă array de imagini), servește fișierul static, adaugă câte un anchor per produs în `startAR()`

**IndexedDB — fără gestiunea versiunilor cache la update meniu:**
- Current capacity: Funcționează pentru un meniu static
- Limit: La orice schimbare de produs (imagine nouă, model nou), toți utilizatorii cu cache vechi văd date eronate până la expirare manuală
- Scaling path: Include un hash al `target.jpg` sau un timestamp în `CACHE_KEY`, sau implementează un endpoint de versioning (`/api/menu-version`)

---

## Dependencies at Risk

**`playwright` în `dependencies` (nu `devDependencies`):**
- Risk: Playwright (browser automation, ~100MB+) e listat ca dependency de producție. Nu e folosit nicăieri în cod. Este posibil un vestigiu de explorare.
- Impact: `npm install` în producție instalează Playwright inutil. Mărește dramatic `node_modules`.
- Migration plan: Mută în `devDependencies` dacă e necesar pentru teste, sau șterge complet.

**`canvas` npm package — binding nativ C++:**
- Risk: `canvas@^3.x` este un binding nativ Node.js (Cairo). Necesită toolchain C++ la instalare (`node-gyp`, Visual Studio Build Tools pe Windows). Poate eșua `npm install` pe sisteme fără toolchain.
- Impact: Onboarding dificil; CI/CD poate eșua fără configurare specială.
- Migration plan: Dacă `compile-target.mjs` se înlocuiește cu flux pre-compilat static (recomandat), `canvas` devine inutil și poate fi șters.

**mind-ar `^1.2.5` — range permisiv pe minor versions:**
- Risk: Caret (`^`) permite upgrade automat la 1.x.y. Dat fiind că `compile-target.mjs` depinde de API-uri interne ale librăriei, un minor upgrade poate rupe scriptul.
- Impact: `npm install` pe o mașină nouă poate instala o versiune incompatibilă.
- Migration plan: Fixează la `"mind-ar": "1.2.5"` exact în `package.json`.

---

## Missing Critical Features

**Nicio pagină de eroare / fallback pentru browsere fără WebGL sau cameră:**
- Problem: Browsere fără WebGL (unele browsere vechi, modul Low Power pe iOS) sau dispozitive fără cameră spate vor vedea doar ecranul de loading blocat infinit sau un mesaj de eroare tehnic.
- Blocks: Utilizatori reali în restaurant nu pot utiliza aplicația fără diagnosticare clară.

**Nicio indicație vizuală că trebuie să îndrepți camera spre marker:**
- Problem: După pornirea AR, utilizatorul vede feed-ul camerei fără nicio instrucțiune. Nu există overlay/tutorial care să explice că trebuie scanat marker-ul de pe meniu.
- Blocks: UX complet pentru utilizator neinstruit.

**Niciun mecanism de update al meniului fără modificarea codului:**
- Problem: Prețul, descrierea, modelul 3D sunt toate hardcodate în HTML. Orice schimbare de meniu (preț sezonier, produs nou) necesită editarea `index.html` și redeploy.
- Blocks: Adoptare de către restaurante reale care au meniuri dinamice.

---

## Test Coverage Gaps

**Zero teste automate:**
- What's not tested: Compilarea AR target, salvarea/citirea cache IndexedDB, încărcarea modelului GLB, pornirea AR, afișarea overlay-ului la detecție
- Files: Toate fișierele sursă
- Risk: Orice modificare la `index.html` sau `compile-target.mjs` poate rupe funcționalitatea core fără feedback imediat
- Priority: Medium (prototip, dar aproape de stadiul demo cu clienți reali)

**`compile-target.mjs` netestabil izolat:**
- What's not tested: Că `NodeCompiler` produce un buffer valid parsabil de MindAR browser-side
- Files: `compile-target.mjs`
- Risk: Script-ul poate rula fără erori dar produce output corupt, descoperit doar la runtime în browser
- Priority: High — dacă se adoptă fluxul pre-compilat (recomandat), corectitudinea output-ului devine critică

---

*Concerns audit: 2026-05-26*
