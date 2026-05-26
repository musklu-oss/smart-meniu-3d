# Smart Meniu 3D

## What This Is

Aplicație web browser-based de AR (Augmented Reality) pentru restaurante. Clientul scanează un QR code de pe meniu → se deschide pagina în browser → camera detectează imaginea produsului din meniu → modelul 3D al preparatului apare lipit de imagine, animat în timp real. Fără app de instalat, funcționează direct din browser pe orice telefon modern.

## Core Value

Camera detectează imaginea produsului și modelul 3D apare lipit de meniu — fără app, direct din browser.

## Requirements

### Validated

- ✓ Structură proiect inițializată (directoare, assets, git) — Phase 1
- ✓ Model 3D GLB integrat și încărcat prin Three.js GLTFLoader — Phase 2
- ✓ Compilare on-the-fly a image target (fără fișier .mind pre-generat) cu IndexedDB cache — Phase 3
- ✓ AR image tracking cu MindAR.js: camera detectează target.jpg, modelul 3D apare lipit — Phase 4
- ✓ UI overlay produs (nume, descriere, preț) afișat când target e detectat — Phase 5

### Active

- [ ] Pagină QR (`qr.html`) cu QR code printabil pentru URL-ul GitHub Pages
- [ ] Deploy pe GitHub Pages (musklu-oss/smart-meniu-3d) și URL live funcțional

### Out of Scope

- Backend / bază de date — prototip static, fără server
- Autentificare / dashboard admin — nu e nevoie pentru MVP
- Multiple produse în același target — 1 produs în prototip
- App nativ (iOS/Android) — soluția browser e deliberată
- Format USDZ (AR QuickLook iOS) — există fișierul, dar nu e integrat în flow

## Context

- **Stack:** HTML + JS pur (fără framework), MindAR.js v1.2.5 (CDN), Three.js (inclus în MindAR CDN)
- **Hosting planificat:** GitHub Pages — cont `musklu-oss`, repo `smart-meniu-3d`
- **Model 3D:** `ballotin_of_saithe_with_herbs.glb` + `.usdz` în `assets/models/`
- **Image target:** `assets/images/target.jpg` (foto produs tipărit pe meniu)
- **Inovație cheie:** compilarea target-ului AR se face on-the-fly în browser (nu pre-compilat), cu cache în IndexedDB — elimină pasul manual de compilare
- **Marker printabil:** `assets/images/marker-printabil.jpg` disponibil

## Constraints

- **Tech stack:** MindAR.js + Three.js — decizie finală, nu se schimbă
- **Hosting:** GitHub Pages — gratuit, fără server necesar
- **Prototip:** 1 singur produs, nu sistem multi-produs
- **Browser-only:** Fără app nativ — funcționează pe orice telefon cu browser modern + cameră

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| MindAR.js pentru image tracking | Gratuit, browser-native, fără app, image tracking precis | ✓ Good |
| Three.js ca renderer 3D | Obligatoriu cu MindAR, standard industrie | ✓ Good |
| Compilare on-the-fly în browser | Elimină pasul de pre-compilare, UX mai simplu | ✓ Good |
| IndexedDB cache pentru target compilat | Evită recompilarea la fiecare vizită | ✓ Good |
| GitHub Pages hosting | Gratuit, zero infrastructură, ideal pentru prototip | — Pending |
| Format GLB pentru model 3D | Standard Three.js GLTFLoader | ✓ Good |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-26 după inițializare GSD (brownfield — cod existent)*
