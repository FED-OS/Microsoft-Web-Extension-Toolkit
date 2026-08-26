# Building Microsoft Edge Extensions

This guide covers the concepts and APIs you'll use when building an Edge browser extension from the **edge** template.

## Manifest V3

The [manifest.json](../templates/edge/public/manifest.json) is the entry point the browser reads. Key fields:

| Field | Purpose |
|-------|---------|
| `manifest_version` | Must be `3` (V2 is deprecated). |
| `action.default_popup` | HTML file shown when the toolbar icon is clicked. |
| `background.service_worker` | Your background script (no DOM access). |
| `content_scripts` | Scripts injected into matching web pages. |
| `permissions` | APIs you need (`storage`, `activeTab`, `contextMenus`, `scripting`, etc.). |
| `host_permissions` | Origins you can make `fetch` requests to or inject scripts into. |

## Architecture

```
┌───────────────┐     messages     ┌──────────────────┐     messages     ┌───────────────┐
│  Popup (React) │ ◄──────────────▶ │  Background SW   │ ◄──────────────▶ │ Content Script │
│  options.html  │                  │  background.js   │                  │  content.js    │
└───────────────┘                  └──────────────────┘                  └───────────────┘
                                          │
                                          ▼
                                   chrome.* APIs
                                   (storage, tabs,
                                    contextMenus…)
```

### Background service worker
Runs independently of any web page. Handles events (`onInstalled`, context menu clicks, alarms), routes messages, and performs long-running logic. It can be suspended by the browser when idle — avoid relying on global state.

### Content script
Runs in the context of a web page. Can read and modify the DOM. Shares the DOM but **not** the JavaScript context with the page. Communicate with the background via `chrome.runtime.sendMessage`.

### Popup
An HTML page rendered in a small window when the user clicks the toolbar icon. Closes when it loses focus. The template uses React for the UI.

## Message Passing

Define your message types in `src/types/index.ts`:

```ts
export type ExtensionMessage =
  | { type: 'DO_SOMETHING'; payload: { id: string } }
  | { type: 'RESULT'; payload: { ok: boolean } };
```

Send from popup → background:

```ts
const resp = await chrome.runtime.sendMessage({ type: 'DO_SOMETHING', payload: { id: '123' } });
```

Handle in background:

```ts
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'DO_SOMETHING') {
    // do work...
    sendResponse({ type: 'RESULT', payload: { ok: true } });
  }
  return true; // async
});
```

## Useful APIs

- `chrome.storage` — persistent key-value storage (sync or local)
- `chrome.tabs` — query, create, and message tabs
- `chrome.contextMenus` — right-click menu items
- `chrome.scripting` — programmatically inject scripts
- `chrome.identity` — OAuth flows (e.g., for Microsoft Graph)

## Debugging

- **Background worker:** `edge://extensions` → find your extension → "Inspect views: service worker"
- **Popup:** Right-click the toolbar icon → "Inspect popup"
- **Content script:** Open DevTools on the web page → Console tab (content script logs appear there)

## Resources

- [Official Edge extension docs](https://learn.microsoft.com/microsoft-edge/extensions-chromium/)
- [Chrome Extensions API reference](https://developer.chrome.com/docs/extensions/reference) (Edge is Chromium-based)
- [Manifest V3 migration guide](https://developer.chrome.com/docs/extensions/whatsnew)
