# Contributing to the Microsoft Extension Toolkit

Thanks for your interest in improving the Microsoft Extension Toolkit. This document explains how to set up the project, make changes, and submit them for review. Whether you're fixing a typo in the docs or adding a whole new template, the process is the same.

## Prerequisites

You'll need Node.js 20 or later and npm 10 or later installed on your machine. The toolkit uses npm workspaces, so a single `npm install` at the repository root installs dependencies for all three templates. No other system dependencies are required for development, though building the Edge and Office templates uses Vite and the VS Code template uses esbuild, both of which are installed automatically.

## Getting the code

Fork the repository on GitHub, then clone your fork locally:

```bash
git clone https://github.com/<your-username>/ms-extension-toolkit.git
cd ms-extension-toolkit
```

Add the upstream remote so you can keep your fork in sync:

```bash
git remote add upstream https://github.com/<upstream-org>/ms-extension-toolkit.git
```

Install dependencies for all workspaces:

```bash
npm install
```

This installs everything for the root project plus the `edge`, `vscode`, and `office` templates.

## Project layout

The repository is a monorepo with one directory per template plus shared tooling:

```
ms-extension-toolkit/
├── docs/              # Deep-dive guides for each extension type
├── scripts/
│   └── create.mjs     # CLI scaffolder that copies a template into a new project
├── templates/
│   ├── edge/          # Microsoft Edge browser extension (Manifest V3, Vite + React)
│   ├── vscode/        # Visual Studio Code extension (esbuild + React webview)
│   └── office/        # Office Web Add-in (Vite + React + Office.js)
├── .github/workflows/ # CI that builds every template on each push
├── package.json       # Root workspace config and shared scripts
└── README.md          # Project overview and quick start
```

Each template is a self-contained npm package with its own `package.json`, `tsconfig.json`, build config, and `README.md`. The root `package.json` wires them together with workspaces and provides top-level scripts like `npm run build:all` that build every template in sequence.

## Development workflow

Pick the template you want to work on and develop inside its directory. The templates are independent, so you don't need to build all of them to test changes to one.

To build a single template:

```bash
npm run build:edge      # build the Edge template
npm run build:vscode    # build the VS Code template
npm run build:office    # build the Office template
```

Or run the build from inside a template directory:

```bash
cd templates/edge
npm run build
```

Each template also has a `type-check` script that runs `tsc --noEmit` to catch type errors quickly without a full build:

```bash
cd templates/vscode
npm run type-check
```

The Edge and Office templates support a Vite dev server (`npm run dev` inside the template) for hot-reloading the UI during development. The VS Code template supports a watch mode (`npm run dev`) that rebuilds on file change, and you launch the extension host by pressing F5 in VS Code with the template folder open.

## Testing the CLI scaffolder

The `scripts/create.mjs` scaffolder copies a template into a new directory, rewrites the `package.json` name, and strips build artifacts. If you change the scaffolder or the templates it copies, test that it still works:

```bash
# Scaffold a new Edge extension into ./my-test-extension
node scripts/create.mjs --type edge --name my-test-extension --out ./my-test-extension

# Verify the output
cd my-test-extension
npm install
npm run build
```

Do the same for the other types (`--type vscode`, `--type office`). The CI workflow runs this scaffolder test on every push, so breakages there will fail the build.

## Coding standards

All templates use TypeScript in strict mode. Keep the following conventions when making changes:

- Prefer TypeScript types and interfaces over `any`. If a type is genuinely unknown, use `unknown` and narrow it rather than casting to `any`.
- Follow the existing ESLint and Prettier configuration in each template. Run `npm run lint` inside a template to check for issues before committing.
- Use named exports for modules that export more than one symbol; default exports are acceptable for React component files.
- Keep the React components functional and hook-based; the templates do not use class components.
- Match the existing file naming convention: `camelCase` for utility and library files, `PascalCase` for React component files, `kebab-case` for non-code assets when applicable.

For documentation changes, write in clear, direct prose with concrete code examples that a reader can copy and run. Avoid marketing language. Cite official Microsoft documentation with links where relevant.

## Running the full CI locally

The GitHub Actions workflow runs the same steps you can run locally. To reproduce a CI run:

```bash
npm run build:all          # build all three templates
node scripts/create.mjs --type edge --name ci-test-edge --out ./ci-test-edge
node scripts/create.mjs --type vscode --name ci-test-vscode --out ./ci-test-vscode
# clean up the scaffolded test directories
rm -rf ci-test-edge ci-test-vscode
```

If all of these pass locally, CI should pass too.

## Submitting changes

1. Create a branch for your work:

   ```bash
   git checkout -b fix/short-description
   ```

   Use a descriptive branch name prefixed with `fix/`, `feat/`, `docs/`, or `chore/` as appropriate.

2. Make your changes and commit them with a clear message. The project follows conventional commits loosely — prefix your message with `fix:`, `feat:`, `docs:`, or `chore:` and keep the subject line under 72 characters. For example:

   ```bash
   git commit -m "fix(edge): correct popup asset path in vite post-build plugin"
   ```

3. Push your branch to your fork:

   ```bash
   git push origin fix/short-description
   ```

4. Open a pull request against the `main` branch of the upstream repository. In the PR description, explain what you changed and why, and note which templates or docs are affected. If your PR fixes an issue, include "Closes #123" so GitHub links them.

5. Wait for CI to run. If CI fails, read the logs, fix the issue, and push the fix. A maintainer will review your PR and may request changes before merging.

## Reporting bugs and requesting features

Open a GitHub issue with a clear title and a body that includes:

- What you expected to happen.
- What actually happened, including any error messages or build output.
- The exact steps to reproduce, including the template type and commands you ran.
- Your Node.js and npm versions.

For feature requests, describe the problem you're trying to solve and why the current templates don't address it. Concrete proposals with examples are more likely to be accepted than abstract ideas.

## Adding a new template

If you want to add a template for an extension type the toolkit doesn't yet cover (for example, a Microsoft Teams app or a Power Platform custom connector), open an issue first to discuss the scope. New templates should follow the existing conventions: TypeScript strict mode, a documented build setup, a template-specific `README.md`, and a corresponding entry in the root `package.json` workspaces and the CLI scaffolder. Include a docs file describing the extension type and update the root `README.md` comparison table.

## Code of conduct

Be respectful and constructive in all interactions — issues, pull requests, and discussions. Treat other contributors as you'd want to be treated. Disagreements about technical approach are normal and fine; personal attacks are not. The maintainers reserve the right to close or delete contributions and comments that violate this standard.
