/**
 * esbuild config for the VS Code extension template.
 * Bundles the extension host code and the webview UI separately.
 *
 * Usage:
 *   node esbuild.config.mjs             # one-shot build
 *   node esbuild.config.mjs --watch     # watch mode
 *   node esbuild.config.mjs --production # minified
 */
import esbuild from 'esbuild';

const watch = process.argv.includes('--watch');
const production = process.argv.includes('--production');

/** Shared esbuild options */
const common = {
  bundle: true,
  sourcemap: !production,
  minify: production,
  logLevel: 'info',
  target: 'ES2022',
};

/** Extension host (Node.js, runs in VS Code's extension context) */
const extensionConfig = {
  ...common,
  entryPoints: ['src/extension.ts'],
  outfile: 'out/extension.js',
  platform: 'node',
  format: 'cjs',
  external: ['vscode'],
};

/** Webview UI (browser, loaded inside a webview iframe) */
const webviewConfig = {
  ...common,
  entryPoints: ['src/webview/index.tsx'],
  outfile: 'out/webview.js',
  platform: 'browser',
  format: 'iife',
};

async function main() {
  if (watch) {
    const ctx1 = await esbuild.context(extensionConfig);
    const ctx2 = await esbuild.context(webviewConfig);
    await Promise.all([ctx1.watch(), ctx2.watch()]);
    console.log('Watching for changes...');
  } else {
    await Promise.all([esbuild.build(extensionConfig), esbuild.build(webviewConfig)]);
    console.log('Build complete.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
