# Microsoft Extension Toolkit — TODO

## Phase 1: Repo-level files
- [x] Root package.json (workspaces + CLI create script)
- [x] Root README.md (overview, quickstart, template chooser)
- [x] LICENSE (MIT)
- [x] .gitignore
- [x] GitHub Actions CI workflow
- [x] CLI scaffolder script (scripts/create.mjs)

## Phase 2: Edge template (templates/edge)
- [x] package.json, tsconfig, vite.config, tailwind, postcss
- [x] public/manifest.json (Manifest V3)
- [x] icons (16/32/48/128)
- [x] src/background, content, popup, options, lib, types
- [x] template README

## Phase 3: VS Code template (templates/vscode)
- [x] package.json (vscode engine, contributes)
- [x] tsconfig, esbuild config
- [x] src/extension.ts (commands, webview), webview UI (React)
- [x] template README

## Phase 4: Office template (templates/office)
- [x] package.json, tsconfig, vite config
- [x] manifest.xml (Office Add-in)
- [x] src/taskpane (React), commands.html
- [x] template README

## Phase 5: Docs
- [x] docs/edge.md
- [x] docs/vscode.md
- [x] docs/office.md
- [x] docs/publishing.md
- [x] CONTRIBUTING.md (root)

## Phase 6: Build & verify
- [x] Verify all templates build (npm run build:all)
- [x] Verify CLI scaffolder works (all 3 types; scaffolded project builds)

## Phase 7: Deliver
- [x] Final tree + package (zip)
- [x] complete
