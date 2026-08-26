# VS Code Extension Template

A boilerplate for building Visual Studio Code extensions with TypeScript, esbuild, and a React webview.

## Features

- **TypeScript** with strict mode
- **esbuild** for fast bundling (extension host + webview separately)
- **React 18** webview with proper VS Code theming and messaging
- **Two example commands** — a simple "Hello World" and a webview panel opener
- **Debug config** — press F5 to launch the Extension Development Host
- **vsce packaging** — `npm run package` produces a `.vsix`

## Getting Started

```bash
npm install
npm run build
```

### Debug in VS Code

1. Open this folder in VS Code.
2. Press **F5** (uses the "Run Extension" launch config).
3. A new VS Code window opens with your extension loaded.
4. Run the **"My Extension: Hello World"** or **"My Extension: Open Webview Panel"** command from the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).

### Develop

```bash
npm run dev        # watch mode (rebuilds on save)
npm run build      # one-shot production build
npm run type-check # type-check only
```

## Project Structure

```
├── src/
│   ├── extension.ts          # Entry point — registers commands
│   ├── webviewPanel.ts       # WebviewPanel manager class
│   ├── webviewHtml.ts        # HTML + CSP for the webview
│   └── webview/
│       ├── index.tsx         # React entry
│       └── App.tsx           # Webview UI
├── .vscode/launch.json       # Debug config (F5)
├── esbuild.config.mjs        # Bundler config
├── package.json              # VS Code contributes (commands, etc.)
└── tsconfig.json
```

## Customizing

1. **Commands** — add entries to `contributes.commands` in `package.json` and register handlers in `src/extension.ts`.
2. **Webview UI** — edit `src/webview/App.tsx`.
3. **Messaging** — use `vscode.postMessage()` in the webview and `panel.webview.onDidReceiveMessage()` in the host.
4. **Extension metadata** — update `name`, `publisher`, `description`, `engines.vscode`, and add `categories`, `repository`, etc.

## Publishing to the VS Code Marketplace

1. Get a [Personal Access Token](https://dev.azure.com) from Azure DevOps.
2. Update `publisher` in `package.json`.
3. `npm run package` → produces a `.vsix` file.
4. `npm run publish` → publishes to the Marketplace.

See the [publishing guide](../../docs/publishing.md) for more.
