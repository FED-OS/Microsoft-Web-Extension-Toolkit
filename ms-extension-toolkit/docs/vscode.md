# Building Visual Studio Code Extensions

This guide covers the concepts and APIs for building a VS Code extension from the **vscode** template.

## Extension Anatomy

A VS Code extension is a Node.js module that exports `activate()` and `deactivate()` functions. It runs in VS Code's **extension host** process, which provides the `vscode` API.

```
┌─────────────────────────────────────┐
│         Extension Host (Node)         │
│  src/extension.ts → activate()        │
│   ├─ registers commands               │
│   ├─ creates webviews                 │
│   └─ subscribes to events             │
└──────────────┬──────────────────────┘
               │ postMessage
               ▼
┌─────────────────────────────────────┐
│         Webview (Browser, React)      │
│  out/webview.js                       │
│   ├─ renders UI in an iframe          │
│   └─ sends messages back to host      │
└─────────────────────────────────────┘
```

## Commands

Commands are the primary way users interact with your extension. Register them in `package.json`:

```json
"contributes": {
  "commands": [
    { "command": "myExtension.doThing", "title": "Do Thing", "category": "My Ext" }
  ]
}
```

And handle them in `src/extension.ts`:

```ts
const cmd = vscode.commands.registerCommand('myExtension.doThing', () => {
  vscode.window.showInformationMessage('Did the thing!');
});
context.subscriptions.push(cmd);
```

Users run commands from the Command Palette (`Ctrl+Shift+P`).

## Webviews

A webview is an iframe that can render arbitrary HTML/JS. It's how you build rich UIs inside VS Code. The template uses a `WebviewPanel` class that:

1. Creates a panel with `vscode.window.createWebviewPanel`
2. Generates HTML with a Content Security Policy
3. Loads your bundled React app
4. Bridges messages between the webview and extension host

### Messaging

From webview → host:

```ts
const vscode = acquireVsCodeApi();
vscode.postMessage({ type: 'hello' });
```

In the host:

```ts
panel.webview.onDidReceiveMessage((msg) => {
  if (msg.type === 'hello') { /* ... */ }
});
```

## Theming

Webviews have access to VS Code CSS variables, so your UI adapts to the user's theme automatically:

```css
color: var(--vscode-foreground);
background: var(--vscode-editor-background);
```

## Debugging

1. Open the template folder in VS Code.
2. Press **F5** — this runs the "Run Extension" launch config, which builds and opens a new VS Code window with your extension loaded.
3. Use breakpoints in your `src/*.ts` files.
4. For webview debugging, open the webview and run the **"Developer: Open Webview Developer Tools"** command.

## Other Extension Capabilities

- **Languages** — contribute grammars, language configurations, language servers
- **Debuggers** — contribute a debug adapter
- **Views** — tree views in the sidebar/explorer
- **Status bar** — custom status bar items
- **Settings** — contribute configuration schema
- **Themes** — color themes, icon themes, product icon themes

## Resources

- [VS Code Extension API reference](https://code.visualstudio.com/api/references/vscode-api)
- [Contribution points](https://code.visualstudio.com/api/references/contribution-points)
- [Webview guide](https://code.visualstudio.com/api/extension-guides/webview)
- [Extension samples](https://github.com/microsoft/vscode-extension-samples)
