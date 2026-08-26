#!/usr/bin/env node
/**
 * MS Extension Toolkit — Scaffolder CLI
 *
 * Usage:
 *   npm run create                    # interactive prompt
 *   npm run create -- --type edge     # non-interactive
 *   npm run create -- --type vscode --name my-ext --out ./my-ext
 *
 * Copies the chosen template into a new directory, rewrites the
 * package.json name field, and prints next steps.
 */

import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, '..', 'templates');

const TEMPLATE_INFO = {
  edge: {
    label: 'Microsoft Edge browser extension (Manifest V3)',
    dir: 'edge',
    defaultName: 'my-edge-extension',
  },
  vscode: {
    label: 'Visual Studio Code extension',
    dir: 'vscode',
    defaultName: 'my-vscode-extension',
  },
  office: {
    label: 'Office Web Add-in (Outlook / Word / Excel / PowerPoint)',
    dir: 'office',
    defaultName: 'my-office-addin',
  },
};

/** Parse --flag value pairs from argv */
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => rl.question(question, (ans) => { rl.close(); res(ans.trim()); }));
}

async function main() {
  console.log('\n🚀 MS Extension Toolkit — Create a new Microsoft extension\n');

  const args = parseArgs(process.argv.slice(2));

  // 1. Choose template type
  let type = args.type;
  if (!type || !TEMPLATE_INFO[type]) {
    if (type) {
      console.error(`✗ Unknown type "${type}". Valid: ${Object.keys(TEMPLATE_INFO).join(', ')}`);
      process.exit(1);
    }
    console.log('Available templates:');
    const keys = Object.keys(TEMPLATE_INFO);
    keys.forEach((k, i) => console.log(`  ${i + 1}. ${TEMPLATE_INFO[k].label}`));
    const choice = await ask(`\nChoose a template [1-${keys.length}]: `);
    const idx = parseInt(choice, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= keys.length) {
      console.error('✗ Invalid choice.');
      process.exit(1);
    }
    type = keys[idx];
  }

  const info = TEMPLATE_INFO[type];

  // 2. Project name
  let name = args.name || (await ask(`Project name [${info.defaultName}]: `)) || info.defaultName;
  if (!/^[a-z0-9-]+$/i.test(name)) {
    console.error('✗ Name must be kebab-case (letters, numbers, hyphens).');
    process.exit(1);
  }

  // 3. Output directory
  const outDir = resolve(args.out || `./${name}`);

  if (existsSync(outDir)) {
    const overwrite = await ask(`"${outDir}" already exists. Overwrite? [y/N]: `);
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Aborted.');
      process.exit(0);
    }
    rmSync(outDir, { recursive: true, force: true });
  }

  // 4. Copy template
  const srcDir = join(TEMPLATES_DIR, info.dir);
  if (!existsSync(srcDir)) {
    console.error(`✗ Template not found: ${srcDir}`);
    process.exit(1);
  }

  console.log(`\n📦 Scaffolding ${info.label} → ${outDir}`);
  mkdirSync(outDir, { recursive: true });
  cpSync(srcDir, outDir, {
    recursive: true,
    filter: (s) => !s.includes('node_modules') && !s.includes('/dist') && !s.includes('/out'),
  });

  // 5. Rewrite package.json name
  const pkgPath = join(outDir, 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    pkg.name = name;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  }

  // 6. Done
  console.log(`\n✅ Created "${name}" in ${outDir}\n`);
  console.log('Next steps:');
  console.log(`  cd ${name}`);
  console.log('  npm install');
  console.log('  npm run dev\n');
  console.log(`📖 See README.md in your new project for full instructions.`);
  console.log(`📚 Full docs: https://github.com/yourusername/ms-extension-toolkit#readme\n`);
}

main().catch((e) => {
  console.error('✗ Error:', e.message);
  process.exit(1);
});
