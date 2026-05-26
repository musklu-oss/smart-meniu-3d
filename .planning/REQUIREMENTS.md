# Requirements: Smart Meniu 3D

**Defined:** 2026-05-26
**Core Value:** Camera detectează imaginea produsului și modelul 3D apare lipit de meniu — fără app, direct din browser.

## v1 Requirements

### AR Core (Implementat)

- [x] **AR-01**: Utilizatorul poate accesa pagina AR printr-un URL de browser (fără app de instalat)
- [x] **AR-02**: Camera browserului se activează și detectează imaginea produsului din meniu
- [x] **AR-03**: Modelul 3D apare lipit de imaginea produsului când camera o detectează
- [x] **AR-04**: Modelul 3D dispare când camera nu mai vede imaginea
- [x] **AR-05**: Image target se compilează on-the-fly în browser (nu necesită pre-compilare)
- [x] **AR-06**: Target compilat se cacheaza în IndexedDB pentru vizite ulterioare rapide

### UI Overlay (Implementat)

- [x] **UI-01**: Utilizatorul vede numele produsului suprapus pe camera când target-ul e detectat
- [x] **UI-02**: Utilizatorul vede descrierea produsului (text scurt)
- [x] **UI-03**: Utilizatorul vede prețul produsului (stilizat vizibil)
- [x] **UI-04**: Ecran de loading cu progress bar în timp ce se compilează/pornește AR-ul

### Deploy & Acces (Active)

- [ ] **DEP-01**: Utilizatorul poate accesa aplicația printr-un URL GitHub Pages live
- [ ] **DEP-02**: Utilizatorul poate scana un QR code printabil care deschide URL-ul AR
- [ ] **DEP-03**: Pagina `qr.html` cu QR code se poate printa și lipi pe meniu

## v2 Requirements

### Multi-produs

- **MULTI-01**: Meniu cu multiple produse, fiecare cu model 3D propriu
- **MULTI-02**: Admin poate adăuga/edita produse fără a modifica codul

### UX avansat

- **UX-01**: Animație de intro la detectarea produsului
- **UX-02**: Buton "Comandă" sau link direct la pagina produsului
- **UX-03**: Suport USDZ pentru AR QuickLook pe iOS (fișierul există, neintegrat)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend / bază de date | Prototip static — nu e nevoie pentru MVP |
| Autentificare utilizatori | Fără cont de user în prototip |
| App nativ iOS/Android | Soluția browser e deliberată și suficientă |
| Multiple produse (v1) | 1 produs în prototip — simplitate maximă |
| Dashboard admin | Out of scope pentru prototip |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AR-01 | Phase 1 — Structură & Setup | Complete |
| AR-02 | Phase 4 — AR Image Tracking | Complete |
| AR-03 | Phase 4 — AR Image Tracking | Complete |
| AR-04 | Phase 4 — AR Image Tracking | Complete |
| AR-05 | Phase 3 — Image Target | Complete |
| AR-06 | Phase 3 — Image Target | Complete |
| UI-01 | Phase 5 — UI Overlay | Complete |
| UI-02 | Phase 5 — UI Overlay | Complete |
| UI-03 | Phase 5 — UI Overlay | Complete |
| UI-04 | Phase 5 — UI Overlay | Complete |
| DEP-01 | Phase 6 — Deploy & QR | Pending |
| DEP-02 | Phase 6 — Deploy & QR | Pending |
| DEP-03 | Phase 6 — Deploy & QR | Pending |

**Coverage:**
- v1 requirements: 13 total
- Implementate (complete): 10
- Active (de implementat): 3
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-26*
*Last updated: 2026-05-26 după inițializare GSD*
