/**
 * Shared message types for the Edge extension template.
 * Customize these to match your extension's messaging needs.
 */

export type ExtensionMessage =
  | { type: 'PING' }
  | { type: 'PONG'; payload: { timestamp: number } }
  | { type: 'GET_TAB_INFO' }
  | { type: 'TAB_INFO'; payload: { url: string; title: string } };

/** User preferences stored in chrome.storage.sync. */
export interface UserPreferences {
  /** Add your own preference fields here. */
  exampleSetting: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  exampleSetting: true,
};
