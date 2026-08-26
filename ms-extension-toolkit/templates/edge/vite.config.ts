import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, readdirSync, mkdirSync, existsSync, readFileSync, writeFileSync, rmSync } from 'fs';

/**
 * Post-build: copies manifest + icons into dist/, fixes HTML asset paths,
 * and writes clean popup.html / options.html at the dist root.
 */
function extensionAssets() {
  return {
    name: 'copy-extension-assets',
    closeBundle() {
      copyFileSync('public/manifest.json', 'dist/manifest.json');
      if (!existsSync('dist/icons')) mkdirSync('dist/icons', { recursive: true });
      for (const f of readdirSync('public/icons')) copyFileSync(`public/icons/${f}`, `dist/icons/${f}`);

      const entries = [
        { src: 'dist/src/popup/index.html', dest: 'dist/popup.html' },
        { src: 'dist/src/options/index.html', dest: 'dist/options.html' },
      ];
      for (const { src, dest } of entries) {
        if (!existsSync(src)) continue;
        let html = readFileSync(src, 'utf-8');
        html = html.replace(/<script src="https:\/\/[^"]*"><\/script>\s*\n?/g, '');
        html = html.replace(/\.\.\/(\.\.\/)?assets\//g, 'assets/');
        writeFileSync(dest, html);
      }
      if (existsSync('dist/src')) rmSync('dist/src', { recursive: true, force: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), extensionAssets()],
  base: './',
  resolve: { alias: { '@': resolve(__dirname, 'src') } },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        options: resolve(__dirname, 'src/options/index.html'),
        background: resolve(__dirname, 'src/background/index.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: (c) => (c.name === 'background' ? 'background.js' : c.name === 'content' ? 'content.js' : 'assets/[name]-[hash].js'),
        chunkFileNames: 'assets/chunk-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
