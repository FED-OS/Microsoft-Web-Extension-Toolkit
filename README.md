# 🛠️ Microsoft Extension Toolkit

<a href='https://ko-fi.com/YOUR_USERNAME' target='_blank'>
    <img height='36' style='border:0px;height:36px;' src='https://ko-fi.com/img/githubbutton_sm.svg' border='0' alt='Buy Me a Coffee at ko-fi.com' />
</a>

> A boilerplate toolkit for building **any** Microsoft extension — Microsoft Edge browser extensions, Visual Studio Code extensions, and Office Web Add-ins. Production-ready templates with TypeScript, Vite, and React out of the box.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)](https://nodejs.org)
[![CI](https://img.shields.io/badge/CI-passing-success.svg)](./.github/workflows/ci.yml)

---

## 📑 Table of Contents

- [What is this?](#what-is-this)
- [Quick Start](#quick-start)
- [Templates](#templates)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Documentation](#documentation)
- [Publishing](#publishing)
- [Contributing](#contributing)
- [License](#license)

---

## What is this?

The **Microsoft Extension Toolkit** is a collection of opinionated, ready-to-use boilerplate templates for every kind of extension in the Microsoft ecosystem. Instead of starting from scratch and wiring up TypeScript, bundlers, manifests, and React yourself, you run one command and get a fully configured project that builds, lints, and is ready to publish.

It includes three templates:

| Template | Target | Manifest | What you get |
|----------|--------|----------|--------------|
| **edge** | Microsoft Edge (and any Chromium browser) | Manifest V3 | Background service worker, content scripts, popup UI, options page |
| **vscode** | Visual Studio Code | `package.json` contributes | Commands, React webview, language features stub |
| **office** | Outlook / Word / Excel / PowerPoint | Office Add-in XML | Task pane (React), commands, SSO-ready |

Every template ships with TypeScript, a build pipeline, linting, and a per-template README explaining how to develop, debug, and publish.

---

## Quick Start

### Scaffold a new project

```bash
# Interactive — it will ask which type and a project name
npx ms-extension-toolkit create

# Or non-interactive
npm run create -- --type edge --name my-extension
```

**Types:** `edge` · `vscode` · `office`

Then:

```bash
cd my-extension
npm install
npm run dev
```

### Use as a GitHub template

You can also click **"Use this template"** on the repo, clone, and copy the template folder you want:

```bash
git clone https://github.com/yourusername/ms-extension-toolkit.git
cp -r ms-extension-toolkit/templates/edge ./my-extension
cd my-extension && npm install
```

---

## Templates

### 🌐 Edge — Microsoft Edge Browser Extension

A Manifest V3 extension with a React popup, options page, content script, and background service worker. Built with Vite + TypeScript + Tailwind.

```bash
npm run create -- --type edge
```

- **Load for dev:** `edge://extensions` → Developer mode → Load unpacked → select `dist/`
- **Build:** `npm run build` → outputs to `dist/`
- **Docs:** [`templates/edge/README.md`](./templates/edge/README.md) · [`docs/edge.md`](./docs/edge.md)

### 🖥️ VS Code — Visual Studio Code Extension

An extension with a registered command, a React-based webview panel, and an esbuild bundler pipeline.

```bash
npm run create -- --type vscode
```

- **Debug:** Press `F5` in VS Code → Extension Development Host opens
- **Package:** `npm run package` → `.vsix` file
- **Docs:** [`templates/vscode/README.md`](./templates/vscode/README.md) · [`docs/vscode.md`](./docs/vscode.md)

### 📦 Office — Office Web Add-in

An Office Add-in with a React task pane that works in Outlook, Word, Excel, and PowerPoint. Uses the Office.js library and Vite.

```bash
npm run create -- --type office
```

- **Run:** `npm run dev` → serves the add-in; sideload via Office
- **Docs:** [`templates/office/README.md`](./templates/office/README.md) · [`docs/office.md`](./docs/office.md)

---

## Project Structure

```
ms-extension-toolkit/
├── scripts/
│   └── create.mjs              # CLI scaffolder (npm run create)
├── templates/
│   ├── edge/                   # Edge browser extension template
│   │   ├── public/manifest.json
│   │   ├── src/{background,content,popup,options,lib,types}
│   │   ├── vite.config.ts
│   │   └── README.md
│   ├── vscode/                 # VS Code extension template
│   │   ├── src/{extension,webview}
│   │   ├── esbuild.config.mjs
│   │   └── README.md
│   └── office/                 # Office Web Add-in template
│       ├── manifest.xml
│       ├── src/taskpane
│       ├── vite.config.ts
│       └── README.md
├── docs/
│   ├── edge.md                 # Deep dive: Edge extension development
│   ├── vscode.md               # Deep dive: VS Code extension development
│   ├── office.md               # Deep dive: Office Add-in development
│   └── publishing.md           # How to publish to each marketplace
├── .github/workflows/ci.yml    # CI: builds all templates + tests scaffolder
├── package.json                # Workspaces + CLI
└── README.md
```

---

## Tech Stack

All templates share a consistent, modern foundation:

- **TypeScript** — strict mode, shared type definitions
- **Vite** — fast dev server and bundler (Edge + Office templates)
- **esbuild** — lightning-fast bundling (VS Code template)
- **React 18** — for popup, webview, and task pane UIs
- **Tailwind CSS** — utility-first styling
- **ESLint + Prettier** — consistent code quality

---

## Documentation

Each template has its own README with setup, development, and debugging instructions. For deeper guides:

- [Edge Extension Guide](./docs/edge.md)
- [VS Code Extension Guide](./docs/vscode.md)
- [Office Add-in Guide](./docs/office.md)
- [Publishing Guide](./docs/publishing.md)

---

## Publishing

Once your extension is ready, each marketplace has its own process — see [`docs/publishing.md`](./docs/publishing.md) for the full walkthrough:

| Target | Marketplace | Tool |
|--------|-------------|------|
| Edge | [Microsoft Edge Add-ons](https://partner.microsoft.com/dashboard/microsoftedge) | Partner Center (upload `.zip`) |
| VS Code | [Visual Studio Code Marketplace](https://marketplace.visualstudio.com) | `vsce` / `npx @vscode/vsce` |
| Office | [Microsoft AppSource](https://appsource.microsoft.com) | Partner Center (upload manifest) |

---

## Contributing

Contributions are welcome — new templates, bug fixes, docs improvements. See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

[MIT](./LICENSE) © 2024
