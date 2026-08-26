# Office Web Add-in Template

A boilerplate for building Microsoft Office Web Add-ins (task pane add-ins for Outlook, Word, Excel, and PowerPoint) with TypeScript, Vite, React, and the Office.js library.

## Features

- **Office.js** integration — loads the official Office API script
- **React 18** task pane UI
- **TypeScript** with strict mode
- **Vite** dev server and build
- **Tailwind CSS** for styling
- **Host detection** — the task pane knows whether it's running in Word, Excel, PowerPoint, or Outlook
- **Example action** — inserts text into a Word document or Excel cell
- **manifest.xml** — a complete, commented Office Add-in manifest for all four hosts

## Getting Started

```bash
npm install
npm run dev
```

This starts a Vite dev server on `http://localhost:3000`.

> ⚠️ **HTTPS requirement:** Office Add-ins must be served over HTTPS in production. For local development, use the [Office Add-in dev server tools](https://learn.microsoft.com/office/dev/add-ins/develop/develop-office-add-ins) or set up a local HTTPS certificate with `mkcert`. Update the URLs in `public/manifest.xml` to match your HTTPS endpoint.

## Sideload & Test

### Using Office on the web (easiest)

1. Run `npm run dev`.
2. Open [Office on the web](https://www.office.com) (Word, Excel, or PowerPoint).
3. Go to **Insert** → **Office Add-ins** → **Upload My Add-in**.
4. Upload the `public/manifest.xml` file (after updating URLs to point to your dev server).
5. The task pane opens in the document.

### Using the Office Add-in CLI tools

```bash
npx office-addin-dev-certs install          # install dev HTTPS certs
npx office-addin-debugging start manifest.xml   # sideload + launch
```

## Project Structure

```
├── public/
│   ├── manifest.xml          # Office Add-in manifest (XML)
│   └── assets/               # Icons referenced by the manifest
├── src/
│   ├── taskpane/
│   │   ├── index.html        # Loads Office.js + React
│   │   ├── main.tsx          # Office.onReady → render React
│   │   ├── App.tsx           # Task pane UI with host detection
│   │   └── styles.css
│   └── office.d.ts           # Minimal Office.js type declarations
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Customizing

1. **manifest.xml** — generate a new GUID for `<Id>`, update `<DisplayName>`, `<Description>`, `<ProviderName>`, and all URLs to your deployment. Uncomment only the `<Host>` entries you need.
2. **Task pane UI** — edit `src/taskpane/App.tsx`.
3. **Office API calls** — use `Word.run()`, `Excel.run()`, `PowerPoint.run()`, or `Office.context.mailbox` depending on the host.
4. **Full type definitions** — for production, install `@types/office-js` and remove the minimal `src/office.d.ts`.

## Publishing to Microsoft AppSource

1. Deploy your built add-in (`npm run build` → `dist/`) to a public HTTPS endpoint.
2. Update all URLs in `manifest.xml` to point to the production endpoint.
3. Go to the [Microsoft Partner Center](https://partner.microsoft.com/dashboard/commercialize).
4. Create a new add-in and upload the manifest.
5. Submit for review.

See the [publishing guide](../../docs/publishing.md) for more.
