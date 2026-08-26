import * as vscode from 'vscode';
import { getWebviewContent } from './webviewHtml';

/**
 * Manages a webview panel that renders a React UI.
 * Implements the VS Code webview pattern with proper resource URIs and CSP.
 */
export class WebviewPanel {
  public static currentPanel: WebviewPanel | undefined;
  private static readonly viewType = 'myExtensionPanel';
  private readonly panel: vscode.WebviewPanel;
  private readonly context: vscode.ExtensionContext;
  private disposables: vscode.Disposable[] = [];

  public static createOrShow(context: vscode.ExtensionContext) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : vscode.ViewColumn.One;

    if (WebviewPanel.currentPanel) {
      WebviewPanel.currentPanel.panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      WebviewPanel.viewType,
      'My Extension Panel',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'out')],
      },
    );

    WebviewPanel.currentPanel = new WebviewPanel(panel, context);
  }

  private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    this.panel = panel;
    this.context = context;

    // Set the webview's HTML content
    this.panel.webview.html = getWebviewContent(this.panel.webview, this.context.extensionUri);

    // Listen for messages from the webview
    this.panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.type) {
          case 'hello':
            vscode.window.showInformationMessage('Webview says hello!');
            break;
        }
      },
      null,
      this.disposables,
    );

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
  }

  public dispose() {
    WebviewPanel.currentPanel = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      const d = this.disposables.pop();
      if (d) d.dispose();
    }
  }
}
