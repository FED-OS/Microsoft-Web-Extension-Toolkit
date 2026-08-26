import * as vscode from 'vscode';
import { WebviewPanel } from './webviewPanel';

/** Called when the extension is activated. */
export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "vscode-extension-template" is now active');

  // Command 1: Show a simple information message
  const helloCmd = vscode.commands.registerCommand('myExtension.hello', () => {
    vscode.window.showInformationMessage('Hello from My VS Code Extension!');
  });

  // Command 2: Open a React webview panel
  const openPanelCmd = vscode.commands.registerCommand('myExtension.openPanel', () => {
    WebviewPanel.createOrShow(context);
  });

  context.subscriptions.push(helloCmd, openPanelCmd);
}

/** Called when the extension is deactivated. */
export function deactivate() {
  console.log('Extension "vscode-extension-template" deactivated');
}
