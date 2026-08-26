/**
 * Global type declarations for the VS Code webview API.
 * `acquireVsCodeApi` is injected by VS Code into webviews at runtime.
 */

declare function acquireVsCodeApi(): {
  postMessage(message: unknown): void;
  getState<T = unknown>(): T | undefined;
  setState<T>(state: T): T;
  // Available in newer VS Code versions
  asWebviewUri?(uri: unknown): { toString(): string };
};
