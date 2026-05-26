# Graph Report - meniu 3D  (2026-05-26)

## Corpus Check
- 16 files · ~12,763 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 225 nodes · 209 edges · 17 communities (16 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0d8dff62`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `workflow` - 24 edges
2. `Coding Conventions` - 11 edges
3. `Testing Patterns` - 11 edges
4. `Codebase Concerns` - 10 edges
5. `External Integrations` - 10 edges
6. `Smart Meniu 3D` - 8 edges
7. `Architecture` - 8 edges
8. `Phase Details` - 7 edges
9. `Project State` - 7 edges
10. `Technology Stack` - 7 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (17 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (31): Architecture, Async Patterns, Code Style, Configuration, Constraints, Conventions, Cross-Cutting Concerns, Data Flow (+23 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (24): workflow, ai_integration_phase, auto_advance, auto_prune_state, code_review, code_review_command, code_review_depth, discuss_mode (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (22): agent_skills, brave_search, claude_md_path, commit_docs, exa_search, firecrawl, git, branching_strategy (+14 more)

### Community 3 - "Community 3"
Cohesion: 0.11
Nodes (17): code:bash (# None configured yet — these would be the standard commands), code:block2 (meniu 3D/), code:js (import { test, expect } from '@playwright/test';), code:js (test('uses cached target on second load', async ({ page, con), code:js (import { defineConfig } from '@playwright/test';), code:json ({), Coverage, Current State (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (15): Async Patterns, Code Style, code:js (function openDB() {), code:js (await new Promise((res, rej) => { img.onload = res; img.oner), code:js (const gltf = await new Promise((res, rej) => {), code:js ((async () => {), Coding Conventions, DOM Interaction Patterns (+7 more)

### Community 5 - "Community 5"
Cohesion: 0.17
Nodes (11): Active, Constraints, Context, Core Value, Evolution, Key Decisions, Out of Scope, Requirements (+3 more)

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (11): Overview, Phase 1: Structură & Setup, Phase 2: Model 3D, Phase 3: Image Target, Phase 4: AR Image Tracking, Phase 5: UI Overlay, Phase 6: Deploy & QR, Phase Details (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.18
Nodes (10): Codebase Concerns, Dependencies at Risk, Fragile Areas, Known Bugs, Missing Critical Features, Performance Bottlenecks, Scaling Limits, Security Considerations (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (10): Authentication & Identity, CDN Libraries, CI/CD & Deployment, Data Storage, Device APIs, Environment Configuration, External Data Sources, External Integrations (+2 more)

### Community 9 - "Community 9"
Cohesion: 0.18
Nodes (10): AR Core (Implementat), Deploy & Acces (Active), Multi-produs, Out of Scope, Requirements: Smart Meniu 3D, Traceability, UI Overlay (Implementat), UX avansat (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (10): Accumulated Context, Blockers/Concerns, Current Position, Decisions, Deferred Items, Pending Todos, Performance Metrics, Project Reference (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (8): Architecture, Cross-Cutting Concerns, Data Flow, Entry Points, Error Handling, Key Abstractions, Layers, Pattern Overview

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (8): Codebase Structure, code:block1 (meniu 3D/), Directory Layout, Directory Purposes, Key File Locations, Naming Conventions, Special Directories, Where to Add New Code

### Community 13 - "Community 13"
Cohesion: 0.22
Nodes (6): canvas, compiler, ctx, imagePath, NodeCompiler, outputPath

### Community 14 - "Community 14"
Cohesion: 0.25
Nodes (7): Configuration, Frameworks, Key Dependencies, Languages, Platform Requirements, Runtime, Technology Stack

### Community 15 - "Community 15"
Cohesion: 0.40
Nodes (4): dependencies, canvas, mind-ar, playwright

## Knowledge Gaps
- **176 isolated node(s):** `imagePath`, `outputPath`, `canvas`, `ctx`, `compiler` (+171 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `workflow` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `imagePath`, `outputPath`, `canvas` to the rest of the system?**
  _176 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._