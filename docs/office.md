# Building Microsoft Office Web Add-ins

This guide covers the concepts, APIs, and publishing path for building an Office Web Add-in from the **office** template. Office Add-ins are web applications (HTML, CSS, JavaScript) that run inside Outlook, Word, Excel, and PowerPoint, extending the host application with custom task panes, content, and commands.

## How Office Add-ins Work

An Office Add-in is fundamentally a web app that the Office host loads inside an embedded webview. The add-in consists of two parts:

**The XML manifest** is a static XML file that tells Office how to discover, display, and launch your add-in. It declares the add-in's identity, the Office hosts it targets (Mailbox, Document, Workbook, Presentation), the permissions it needs, the URL of your task pane page, and the buttons and commands that appear in the host ribbon. Office reads this manifest at install time and never again fetches it at runtime, so the manifest must be hosted at a stable HTTPS URL.

**The web application** is the actual HTML/CSS/JS you serve from your own HTTPS endpoint. When the user clicks an add-in button in the ribbon, Office opens an embedded browser pane and navigates it to the URL you declared in the manifest. Your web app then loads the Office.js library, calls `Office.onReady()` to synchronize with the host, and uses the Office.js object model to read and write document content, mail items, or workbook data.

The critical bridge between your web app and the host application is **Office.js**, a JavaScript library Microsoft hosts on their CDN. You load it with a single `<script>` tag pointing at `https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js`, and it injects a global `Office` object plus host-specific namespaces like `Word`, `Excel`, `PowerPoint`, and `Outlook`. The template's `src/taskpane/index.html` already includes this script tag, and `src/taskpane/main.tsx` waits for `Office.onReady()` before rendering the React UI.

## The Manifest in Detail

The manifest is the most error-prone part of Office Add-in development because the XML schema is strict and AppSource validation is thorough. The template's `public/manifest.xml` is a complete, valid example you can adapt. Here are the sections that matter:

The root `<OfficeApp>` element carries a `xmlns` namespace and a `xsi:type` that determines the add-in shape. The template uses `xsi:type="TaskPaneApp"`, which gives you a task pane — a vertical panel docked on the right side of the document. Other valid types include `ContentApp` (an embedded object inside the document body, like a chart or map), `MailApp` (Outlook-specific, can show cards next to an email), and `MailReadApp` / `MailEditApp` (deprecated read/edit forms).

`<Id>` must be a unique GUID. Generate a fresh one for every add-in using `uuidgen` or an online GUID generator — never reuse another add-in's ID. `<Version>`, `<ProviderName>`, `<DefaultLocale>`, `<DisplayName>`, `<Description>`, and `<IconUrl>` are all required metadata fields that appear in the Office UI and on AppSource.

`<Hosts>` declares which Office applications can run the add-in. Each `<Host>` element uses a `Name` attribute from the `OfficeHost` enumeration: `Mailbox` (Outlook), `Document` (Word), `Workbook` (Excel), `Presentation` (PowerPoint), `Database` (Access). You can list multiple hosts to build a single add-in that works across several applications, but you must then ensure your code handles each host's different API surface.

`<DefaultSettings>` contains `<SourceLocation>`, the HTTPS URL of your task pane HTML page. When you develop locally with `npm run dev`, this should point to `https://localhost:3000/taskpane.html` (the Vite dev server). When you publish, change it to your production HTTPS endpoint.

`<VersionOverrides>` is where the modern ribbon integration lives. Inside it you define `<Hosts>` again with `<Host>` elements containing `<DesktopFormFactor>` blocks. Each form factor contains `<ExtensionPoint>` elements — for task pane apps, you use `TaskPaneApp` with `<OfficeTab>` and `<Group>` containing `<Control>` elements of type `xsi:type="Button"`. Each button has an `<Action>` of `xsi:type="ShowTaskpane"` that launches your task pane, plus `<Label>`, `<Supertip>`, and `<Icon>` elements. This is how your add-in gets its own button in the Office ribbon.

`<Resources>` at the bottom is a registry of reusable strings, URLs, and icons referenced by ID from the rest of the manifest. Keeping them here means you can localize them by adding `<Override Locale="...">` children, and you avoid repeating the same long URLs in multiple places.

## Office.js and Host Detection

Once your task pane loads, the first thing your code should do is call `Office.onReady()`. This returns a Promise (or accepts a callback) that resolves when Office.js is fully initialized and the host environment is ready. Attempting to use Office APIs before this resolves will throw errors. The template wraps this in `src/taskpane/main.tsx`:

```typescript
import * as Office from 'office-js';

Office.onReady((info) => {
  // info.host tells you which Office app you're in
  ReactDOM.createRoot(document.getElementById('root')!).render(<App host={info.host} />);
});
```

The `info` object passed to `onReady` includes `info.host`, an enum value from `Office.HostType` (`Word`, `Excel`, `PowerPoint`, `Outlook`, `OneNote`). The template's `App.tsx` uses this to display which host it's running in and to route the user to host-specific functionality. This pattern is essential when your manifest declares multiple hosts — the same web app loads in all of them, and your code must branch on `info.host` to call the right APIs.

## Working with Document Content

Each Office host exposes a rich, promise-based object model through Office.js. The general pattern is the same across hosts: you open a context, perform operations against that context, and then call `context.sync()` to flush your queued commands to the host and read back results. This batch-and-sync design is why Office Add-ins can be fast even though they communicate with the host asynchronously.

### Word

The `Word` namespace gives you access to the document's body, paragraphs, ranges, tables, and content controls. A typical operation looks like this:

```typescript
await Word.run(async (context) => {
  const body = context.document.body;
  body.insertParagraph('Hello from my add-in!', Word.InsertLocation.end);
  await context.sync();
});
```

You queue commands against `context.document`, then call `context.sync()` to execute them. Between syncs you can read properties back — for example, load the paragraph count with `context.load(context.document.body, 'paragraphs/items/count')` and read `body.paragraphs.items.length` after the sync resolves.

### Excel

The `Excel` namespace exposes workbooks, worksheets, ranges, tables, and charts. Reading and writing cell values is the most common operation:

```typescript
await Excel.run(async (context) => {
  const sheet = context.workbook.worksheets.getActiveWorksheet();
  const range = sheet.getRange('A1:B3');
  range.values = [['Name', 'Score'], ['Alice', 95], ['Bob', 87]];
  range.format.fill.color = '#4472C4';
  await context.sync();
});
```

Excel's API is particularly powerful for formatting, formulas, and conditional formatting. You can load entire ranges, manipulate them in memory, and write them back in a single sync for performance.

### Outlook

Outlook add-ins work differently from Word and Excel because the add-in runs alongside a mail item rather than inside a document. The `Office.context.mailbox` object gives you access to the currently selected email or appointment. You can read subject, sender, recipients, and body, and with appropriate permissions you can read the item's custom properties or make calls to Exchange Web Services.

Outlook add-ins also support **add-in commands** — ribbon buttons that can launch a task pane, execute a function directly, or show a dropdown menu. These are declared in the manifest under `<VersionOverrides>` with `<ExtensionPoint xsi:type="MessageReadCommandSurface">` or `MessageComposeCommandSurface`.

### PowerPoint

The `PowerPoint` namespace is newer and more limited than Word/Excel. You can insert slides, get the selected slides, and insert images or text into shapes. The API is actively growing, so check the current documentation for the latest capabilities.

## Authentication and Microsoft Graph

Many Office Add-ins need to call Microsoft Graph to access the user's files, emails, calendar, or other Microsoft 365 data. The recommended authentication approach is **SSO (Single Sign-On)**, which lets your add-in obtain an access token for Graph using the user's existing Office identity, without showing a login prompt.

To implement SSO, you register your add-in in Azure Active Directory (now Microsoft Entra ID), expose an application URI, and add the `Office.addins.getSsoToken()` call (or the legacy `Office.auth.getAccessToken()`) in your task pane code. The token you receive can be exchanged for a Graph token via a server-side on-behalf-of flow. This is more involved than a standard OAuth flow, but it gives users a seamless experience since they're already signed into Office.

If SSO is too complex for your initial version, you can fall back to the `msal-browser` library from Microsoft's MSAL.js family, which implements a standard OAuth 2.0 authorization code flow with PKCE. You'll register a redirect URI, call `msalInstance.loginPopup()`, and use the resulting token for Graph calls. The user sees a popup login, but the implementation is simpler than full SSO.

## Development Workflow

Office Add-ins require HTTPS for both the manifest URL and the web app URL — Office will refuse to load an add-in over plain HTTP. The template's Vite dev server runs on port 3000, and you'll need a self-signed certificate for local development. The easiest way is to install and trust a dev certificate using a tool like `office-addin-dev-certs` from Microsoft:

```bash
npx office-addin-dev-certs install
```

This generates a trusted localhost certificate and configures it so Office accepts `https://localhost:3000`. Without this step, Office will block your add-in with a certificate error.

To sideload the add-in into Office for testing, you point Office at your manifest URL. In Office on the web, you upload the manifest file directly through the "Upload My Add-in" option in the Add-ins dialog. In Office desktop, you can place the manifest in a network share or SharePoint folder and add it as a "Shared Folder" catalog. The `office-addin-dev-certs` and `office-addin-debugging` npm packages from Microsoft can automate sideloading across hosts.

## Debugging

Office Add-ins run inside an embedded webview whose identity depends on the host and operating system. On Windows, Office uses Edge WebView2 (Chromium) for modern hosts; on Mac, it uses WKWebView (Safari). This means you can usually open browser developer tools inside the task pane: right-click inside the task pane and look for an "Inspect" option, or use the host's developer tools menu. In Outlook desktop on Windows, you can launch the webview debugger by holding a keyboard shortcut while the add-in is open.

For Office on the web, debugging is straightforward — open the browser's developer tools (F12) and they'll inspect the iframe hosting your task pane.

Because the webview varies by host and platform, always test your add-in on every Office host and operating system you intend to support. A feature that works in Edge WebView2 on Windows might behave differently in WKWebView on Mac.

## Key APIs Reference

Here are the most important Office.js entry points you'll use repeatedly:

`Office.onReady(callback)` — Wait for the host to initialize before calling any other API. The callback receives `{ host, platform }` identifying the current environment.

`Office.context.host` — An `Office.HostType` enum value (`Word`, `Excel`, `PowerPoint`, `Outlook`, `OneNote`) telling you which application the add-in is running in. Branch on this to call host-specific APIs.

`Office.context.platform` — An `Office.PlatformType` enum (`PC`, `Mac`, `OfficeOnline`, `iOS`, `Android`) for platform-specific behavior.

`Word.run(callback)` — Open a Word-specific batch context. Queue operations on `context.document`, then call `context.sync()`.

`Excel.run(callback)` — Open an Excel-specific batch context. Queue operations on `context.workbook`, then call `context.sync()`.

`Office.context.mailbox` — In Outlook, access the selected mail item, its properties, and Exchange services.

`Office.context.document` — In Word/Excel/PowerPoint, access the active document. Methods like `getFileAsync`, `setSelectedDataAsync`, and `getSelectedDataAsync` work across all document hosts and predate the newer host-specific APIs.

`context.load(object, path)` — In Word/Excel, queue a request to populate an object's properties from the host before the next `context.sync()`. Without loading, properties are `undefined` after sync.

`context.sync()` — Flush all queued commands and property loads to the host and return a Promise that resolves with the results. This is the heartbeat of the Word/Excel object model.

## Resources

- [Office Add-ins documentation](https://learn.microsoft.com/office/dev/add-ins/overview/office-add-ins)
- [Office.js API reference](https://learn.microsoft.com/javascript/api/office)
- [Office Add-in manifest](https://learn.microsoft.com/office/dev/add-ins/develop/add-in-manifests)
- [Develop Office Add-ins with the Yeoman Generator](https://learn.microsoft.com/office/dev/add-ins/develop/yeoman-generator-overview)
- [Office Add-in SSO](https://learn.microsoft.com/office/dev/add-ins/develop/sso-in-office-add-ins)
- [Microsoft Graph API reference](https://learn.microsoft.com/graph/use-the-api)
- [Script Lab](https://appsource.microsoft.com/product/office/WA104380862) — an Office Add-in for experimenting with Office.js snippets interactively
- [Office Add-ins design guidelines](https://learn.microsoft.com/office/dev/add-ins/design/add-in-design)
