import type { UserPreferences } from '@/types';
import { DEFAULT_PREFERENCES } from '@/types';

/** Chrome storage helpers — a thin wrapper around chrome.storage.sync. */
export const storage = {
  async getPreferences(): Promise<UserPreferences> {
    const result = await chrome.storage.sync.get('preferences');
    return { ...DEFAULT_PREFERENCES, ...(result.preferences ?? {}) };
  },

  async setPreferences(prefs: Partial<UserPreferences>): Promise<void> {
    const current = await this.getPreferences();
    await chrome.storage.sync.set({ preferences: { ...current, ...prefs } });
  },
};
