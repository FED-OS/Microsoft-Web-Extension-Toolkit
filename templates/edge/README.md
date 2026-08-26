# Edge Extension Template

A production-ready boilerplate for building Microsoft Edge browser extensions (Manifest V3) with TypeScript, Vite, React, and Tailwind CSS.

## Features

- **Manifest V3** — the current standard for Edge/Chrome extensions
- **TypeScript** with strict mode
- **React 18** popup and options pages
- **Tailwind CSS** for styling
- **Vite** for fast builds
- **Background service worker** + **content script** scaffolding
- **Context menu** example
- **Message passing** types between popup ↔ background ↔ content
- ESLint + Prettier configured

## Getting Started

```bash
npm install
npm run build
```

### Load in Edge for development

1. Open `edge://extensions/`
2. Enable **Developer mode** (toggle in the bottom-left)
3. Click **Load unpacked**
4. Select the `dist/` folder

### Develop

```bash
npm run dev      # starts Vite dev server (for UI iteration)
npm run build    # full production build → dist/
npm run zip      # build + create extension.zip for the store
```

> After changing code, run `npm run build` and reload the extension in `edge://extensions/`.

## Project Structure

```
├── public/
│   ├── manifest.json        # Manifest V3 declaration
│   └── icons/               # 16, 32, 48, 128 px
├── src/
│   ├── background/index.ts  # Service worker: events, context menus, messaging
│   ├── content/index.ts     # Content script: page DOM interaction
│   ├── popup/               # Toolbar popup UI (React)
│   │   ├── index.html
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── styles.css
│   ├── options/             # Options/settings page (React)
│   │   ├── index.html
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── styles.css
│   ├── lib/config.ts        # Storage helpers
│   └── types/index.ts       # Shared message types
├── vite.config.ts           # Build config + post-build asset copy
├── tailwind.config.js
└── tsconfig.json
```

## Customizing

1. **manifest.json** — change `name`, `description`, add `permissions` and `host_permissions` as needed.
2. **Popup** — edit `src/popup/App.tsx`.
3. **Background logic** — edit `src/background/index.ts`.
4. **Content script** — edit `src/content/index.ts`.
5. **Messages** — define your message types in `src/types/index.ts`.
6. **Icons** — replace the files in `public/icons/`.

## Publishing to the Edge Add-ons Store

1. `npm run zip` → produces `extension.zip`.
2. Go to the [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview).
3. Create a developer account (free, one-time).
4. **Create new extension** → upload the `.zip`.
5. Fill in store listing details and submit for review.

See the [publishing guide](../../docs/publishing.md) for more.
