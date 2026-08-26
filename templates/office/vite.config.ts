import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, readdirSync, mkdirSync, existsSync, readFileSync, writeFileSync, rmSync } from 'fs';

/**
 * Post-build: copies manifest.xml + assets into dist/ and fixes HTML paths.
 */
function officeAssets() {
  return {
    name: 'copy-office-assets',
    closeBundle() {
      copyFileSync('public/manifest.xml', 'dist/manifest.xml');
      // Copy any public assets
      if (existsSync('public/assets')) {
        if (!existsSync('dist/assets')) mkdirSync('dist/assets', { recursive: true });
        for (const f of readdirSync('public/assets')) copyFileSync(`public/assets/${f}`, `dist/assets/${f}`);
      }
      // Fix taskpane.html at root
      const src = 'dist/src/taskpane/index.html';
      if (existsSync(src)) {
        let html = readFileSync(src, 'utf-8');
        html = html.replace(/<script src="https:\/\/[^"]*"><\/script>\s*\n?/g, '');
        html = html.replace(/\.\.\/(\.\.\/)?assets\//g, 'assets/');
        writeFileSync('dist/taskpane.html', html);
      }
      if (existsSync('dist/src')) rmSync('dist/src', { recursive: true, force: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), officeAssets()],
  base: './',
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  server: {
    port: 3000,
    // Office Add-ins normally need HTTPS; use mkcert or office-addin-dev-certs
    // for local development. See the template README.
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        taskpane: resolve(__dirname, 'src/taskpane/index.html'),
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/chunk-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
