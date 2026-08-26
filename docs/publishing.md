# Publishing Microsoft Extensions

This guide walks you through publishing each type of Microsoft extension to its respective marketplace. The three targets are **Microsoft Edge Add-ons** (for Edge browser extensions), the **Visual Studio Code Marketplace** (for VS Code extensions), and **Microsoft AppSource** (for Office Add-ins). Each has its own submission process, review criteria, and packaging requirements.

## Microsoft Edge Add-ons

Edge browser extensions are published through the **Microsoft Partner Center**, the same portal used for Windows apps and other Microsoft products. The Edge Add-ons store shares its underlying Chromium foundation with the Chrome Web Store, and extensions built for Chrome generally work in Edge with no changes, but you must publish them to the Edge store separately for Edge users to discover and install them.

### Prerequisites

You need a Microsoft account registered as a developer in Partner Center. If you don't have one, sign up at [partner.microsoft.com](https://partner.microsoft.com). Individual developer accounts are free; company accounts require a one-time registration fee and business verification. The account you register becomes the publisher identity shown on your add-on's listing.

### Packaging your extension

Before uploading, build your extension and package it as a ZIP file. The Edge template includes a `zip` script that does this:

```bash
npm run zip
```

This runs `npm run build` (producing the `dist/` folder) and then zips the `dist/` contents into a single archive. The ZIP must contain the `manifest.json` at its root — not nested inside a subfolder. Partner Center will reject packages where the manifest is buried in a directory.

Verify your ZIP by unzipping it to a temporary folder and confirming that `manifest.json`, your compiled JS/CSS, and the `icons/` directory are all at the top level. Open the unpacked folder in Edge (`edge://extensions` → Developer mode → Load unpacked) to confirm it loads without errors before submitting.

### Creating the submission

In Partner Center, navigate to the Edge Add-ons section and click "Create new extension." You'll upload your ZIP file and fill out a store listing with the following:

- **Name and description** — the display name and a detailed description that appears on the store page.
- **Store logo and screenshots** — a 300×300 PNG icon and at least one screenshot (1280×800 or 640×400) showing your extension in action.
- **Category and privacy policy URL** — choose a relevant category and provide a URL to your privacy policy. A privacy policy is required if your extension collects any user data.
- **Permissions justification** — for each permission in your manifest, explain why your extension needs it. Vague justifications are the most common reason for review rejection.
- **Website and support contact** — optional but recommended for trust signals.

### Review process

Microsoft reviews every Edge add-on manually. The review checks for malware, policy violations (no deceptive behavior, no collecting data beyond what's disclosed, no interfering with other extensions), manifest validity, and that the extension actually does what its description claims. Reviews typically take a few hours to a few days. You'll receive an email when the review completes, with feedback if anything needs fixing.

Common rejection reasons include missing or vague permission justifications, requesting more permissions than the extension uses, broken functionality in the reviewer's test environment, and privacy policy issues. Address the feedback, rebuild, and resubmit.

### Updating a published extension

To push an update, increment the `version` in `manifest.json`, rebuild and re-zip, then upload the new package to the same extension listing in Partner Center. The new version goes through the same review process. Existing users receive the update automatically after it's approved.

## Visual Studio Code Marketplace

VS Code extensions are published to the **Visual Studio Code Marketplace**, the official extension gallery integrated into VS Code's extension panel. Publishing is handled through the `vsce` (Visual Studio Code Extensions) command-line tool, which packages your extension into a `.vsix` file and uploads it to the marketplace via the Microsoft Marketplace API.

### Prerequisites

You need a Microsoft account and a **Personal Access Token (PAT)** from Azure DevOps. The VS Code Marketplace uses Azure DevOps for authentication, even though extensions appear on the marketplace site. To get a PAT:

1. Sign in to [dev.azure.com](https://dev.azure.com) with your Microsoft account.
2. Create an organization if you don't have one (it's free).
3. Go to User Settings → Personal Access Tokens → New Token.
4. Set the organization to "All accessible organizations," set expiration, and under Scopes select **Custom defined** → **Marketplace** → **Acquire** → **Manage**.
5. Copy the token — you'll only see it once.

Also ensure your extension's `package.json` has the fields the marketplace requires: `name`, `version`, `engines.vscode`, `publisher` (must match your marketplace publisher ID), `repository`, `license`, and a `displayName` plus `description`. The `repository` field is important — the marketplace links to it and reviewers may check it.

### Packaging with vsce

Install `vsce` globally or use `npx`. The VS Code template includes a `package` script:

```bash
npm run package
```

This runs `vsce package` (after building), producing a `.vsix` file in your template directory. You can install this file locally for testing with `code --install-extension my-extension-1.0.0.vsix` before publishing.

If your extension includes a `README.md`, `vsce` uses it as the marketplace listing description, so write it carefully — include screenshots, feature lists, and usage instructions. A `CHANGELOG.md` is optional but recommended and appears on a separate tab on your listing.

### Publishing

To publish, run:

```bash
npx vsce publish
```

`vsce` will prompt for your PAT on first use (and cache it for future runs). It reads the version from `package.json`, uploads the `.vsix`, and your extension appears on the marketplace within a few minutes. You can also publish a specific version with `npx vsce publish 1.2.0` or unpublish with `npx vsce unpublish <publisher.extension>`.

### Updating

Increment the `version` in `package.json` (VS Code uses semver), rebuild, and run `npx vsce publish` again. Users with auto-update enabled receive the new version automatically. The marketplace supports pre-release versions via the `"preview": true` field or the `--pre-release` flag, which lets users opt into early versions alongside stable ones.

### Review and policies

VS Code Marketplace review is largely automated, with manual review for extensions that request broad permissions or show suspicious behavior. Key policies: extensions must not modify VS Code's core files, must not download and execute arbitrary code at runtime (unless clearly disclosed), must not collect telemetry without disclosure, and must have a clear purpose matching their listing. Malicious or policy-violating extensions are removed, and the publisher account may be suspended.

## Microsoft AppSource (Office Add-ins)

Office Add-ins are published to **Microsoft AppSource**, the Microsoft 365 app store. AppSource is the most rigorous of the three marketplaces because add-ins run inside productivity applications handling sensitive documents and email, so Microsoft enforces thorough validation covering both the manifest and the live web application.

### Prerequisites

You need a Partner Center account (same portal as Edge Add-ons) with a developer profile. For commercial add-ins, you'll also configure payout details if you plan to monetize. Your add-in must be served from a production HTTPS endpoint with a valid (non-self-signed) SSL certificate — AppSource validation will fetch your task pane URL and reject self-signed certificates.

### Preparing the manifest

Before submission, update every URL in `manifest.xml` to point to your production HTTPS endpoint (not `https://localhost:3000`). This includes `<SourceLocation>`, all `<IconUrl>` entries, and any URLs inside `<VersionOverrides>` and `<Resources>`. Run the manifest through Microsoft's validation tool to catch schema errors early:

```bash
npx office-addin-manifest validate manifest.xml
```

Fix every error and warning — AppSource validation is stricter than the local validator, so a clean local run is the minimum bar.

### Store listing

In Partner Center, create a new Office Add-in submission under the Office Add-ins section. Upload your `manifest.xml` and complete the listing:

- **Display name, short and long descriptions** — appear on AppSource and inside Office.
- **Category** — choose the most relevant category (e.g., Productivity, Finance, Analytics).
- **Screenshots and video** — at least one screenshot; a short demo video improves conversion.
- **Support URL and privacy policy URL** — both are required.
- **Licensing and pricing** — choose free, freemium, or paid; paid add-ins require additional agreements.

### Validation

AppSource validation is the most comprehensive of the three marketplaces. Microsoft runs automated checks on your manifest and then performs manual testing of the live add-in across supported Office hosts (Word, Excel, PowerPoint, Outlook) and platforms (Windows, Mac, web). The validation team checks that:

- All manifest URLs resolve over HTTPS with valid certificates.
- The add-in launches and functions in every declared host.
- The add-in doesn't crash, hang, or produce console errors during normal use.
- Permissions match the add-in's stated purpose.
- Authentication (if any) works correctly and doesn't leak credentials.
- The privacy policy accurately describes data handling.

Validation typically takes one to two weeks, sometimes longer for complex add-ins or during peak periods. You'll receive a detailed report if issues are found, with specific steps to reproduce each failure. Fix the issues, redeploy your web app (and update the manifest if URLs changed), and resubmit.

### Updating

To publish an update, increment the `<Version>` in `manifest.xml`, deploy the updated web app to your production endpoint, and submit the new manifest through Partner Center. The update goes through validation again, though revalidations of previously approved add-ins are often faster. Users receive the update the next time Office refreshes the add-in catalog.

## Cross-cutting concerns

### Versioning

All three extension types use semantic versioning. Increment the patch version for bug fixes, the minor version for backward-compatible features, and the major version for breaking changes. The marketplace stores keep a history of all published versions, and users can sometimes roll back if a new version causes problems.

### Privacy and data handling

Every marketplace requires a privacy policy if your extension collects, transmits, or stores user data. Even extensions that only store settings locally should disclose that. Be specific: state what data you collect, why, where it's stored, how long you retain it, and how users can delete it. Vague privacy policies are a leading cause of review rejections across all three stores.

### Continuous integration

The toolkit's GitHub Actions workflow (`.github/workflows/ci.yml`) builds all three templates on every push and pull request, catching breakages early. For production extensions, consider extending the workflow to package and publish automatically on tag creation. The `vsce` tool supports publishing from CI with a PAT stored as a repository secret, and Partner Center offers an API for Edge and AppSource submissions that you can integrate into release pipelines.

### Internationalization

If you target a global audience, localize your extension. Edge extensions support `_locales/` directories with `messages.json` files per locale. VS Code extensions use the `i18n` / `l10n` API with bundle files. Office Add-ins localize via `<Override Locale="...">` elements in the manifest and language-switching in your web app. All three marketplaces surface localized listings when you provide translations.

## Resources

- [Publish Microsoft Edge Add-ons](https://learn.microsoft.com/microsoft-edge/extensions-chromium/publish/publish-extension)
- [Partner Center documentation](https://learn.microsoft.com/partner-center/)
- [Publishing extensions to the VS Code Marketplace](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce CLI reference](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#vsce)
- [Publish Office Add-ins to AppSource](https://learn.microsoft.com/office/dev/add-ins/publish/publish)
- [AppSource validation policies](https://learn.microsoft.com/legal/marketplace/certification-policies)
- [Make AppSource add-ins more discoverable](https://learn.microsoft.com/office/dev/add-ins/publish/appsource-best-practices)
