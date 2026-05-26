# Roadmap: Smart Meniu 3D

## Overview

Proiect browser-based AR pentru restaurante. Clientul scanează un QR code → browser deschide pagina → camera detectează imaginea produsului → modelul 3D apare lipit de imagine. Fără app. Fazele 1–5 sunt complete (structură, model 3D, compilare target, AR tracking, UI overlay). Rămâne doar faza 6: deploy pe GitHub Pages și pagina QR printabilă.

## Phases

- [x] **Phase 1: Structură & Setup** - Inițializare proiect, directoare, assets, git
- [x] **Phase 2: Model 3D** - GLB integrat și redat prin Three.js GLTFLoader
- [x] **Phase 3: Image Target** - Compilare on-the-fly în browser + IndexedDB cache
- [x] **Phase 4: AR Image Tracking** - Camera detectează target.jpg, modelul 3D apare lipit
- [x] **Phase 5: UI Overlay** - Nume, descriere, preț afișate când target-ul e detectat
- [ ] **Phase 6: Deploy & QR** - GitHub Pages live + pagină QR printabilă

## Phase Details

### Phase 1: Structură & Setup
**Goal**: Proiectul există ca repository funcțional cu toate assets-urile la locul lor
**Depends on**: Nothing (first phase)
**Requirements**: AR-01
**Success Criteria** (what must be TRUE):
  1. Repository git inițializat cu structură de directoare clară
  2. Utilizatorul poate deschide `index.html` în browser fără erori de console
  3. Assets-urile (imagini, modele) sunt accesibile la path-urile definite
**Plans**: Complete

### Phase 2: Model 3D
**Goal**: Modelul 3D GLB se încarcă și se randează în scena Three.js
**Depends on**: Phase 1
**Requirements**: (fundație pentru AR-02, AR-03)
**Success Criteria** (what must be TRUE):
  1. Fișierul `ballotin_of_saithe_with_herbs.glb` se încarcă fără erori
  2. Modelul e vizibil în scena Three.js când AR-ul pornește
**Plans**: Complete

### Phase 3: Image Target
**Goal**: Target-ul AR se compilează în browser și se cachează pentru vizite ulterioare
**Depends on**: Phase 2
**Requirements**: AR-05, AR-06
**Success Criteria** (what must be TRUE):
  1. La prima vizită, `target.jpg` se compilează on-the-fly (progress bar vizibil 10–95%)
  2. La vizitele ulterioare, target-ul se încarcă din IndexedDB instant (fără recompilare)
**Plans**: Complete

### Phase 4: AR Image Tracking
**Goal**: Camera detectează imaginea produsului și modelul 3D apare lipit de ea
**Depends on**: Phase 3
**Requirements**: AR-02, AR-03, AR-04
**Success Criteria** (what must be TRUE):
  1. Camera browserului se activează și scanează feed-ul video în timp real
  2. Modelul 3D apare lipit de `target.jpg` când camera îl detectează
  3. Modelul 3D dispare imediat când camera nu mai vede imaginea
**Plans**: Complete

### Phase 5: UI Overlay
**Goal**: Utilizatorul vede informațiile produsului suprapuse pe camera când target-ul e detectat
**Depends on**: Phase 4
**Requirements**: UI-01, UI-02, UI-03, UI-04
**Success Criteria** (what must be TRUE):
  1. Numele produsului e vizibil pe ecran când target-ul e detectat
  2. Descrierea și prețul apar stilizate clar pe overlay
  3. Un ecran de loading cu progress bar indică starea compilării/pornirii AR
**Plans**: Complete

### Phase 6: Deploy & QR
**Goal**: Aplicația e accesibilă live pe internet și poate fi accesată printr-un QR code printabil
**Depends on**: Phase 5
**Requirements**: DEP-01, DEP-02, DEP-03
**Success Criteria** (what must be TRUE):
  1. Utilizatorul poate deschide URL-ul GitHub Pages pe telefon și AR-ul funcționează
  2. Utilizatorul poate scana un QR code fizic (de pe meniu) și ajunge direct la aplicația AR
  3. `qr.html` poate fi printată și lipită pe meniu fără modificări suplimentare
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Structură & Setup | - | Complete | 2026-05-26 |
| 2. Model 3D | - | Complete | 2026-05-26 |
| 3. Image Target | - | Complete | 2026-05-26 |
| 4. AR Image Tracking | - | Complete | 2026-05-26 |
| 5. UI Overlay | - | Complete | 2026-05-26 |
| 6. Deploy & QR | 0/? | Not started | - |

---
*Roadmap created: 2026-05-26*
