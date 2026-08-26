/**
 * Content script — runs in the context of web pages.
 * Use this to read or modify page DOM, inject UI, or extract content.
 */

import type { ExtensionMessage } from '@/types';

// Example: respond to messages from the popup or background
chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  if (message.type === 'PING') {
    sendResponse({ type: 'PONG', payload: { timestamp: Date.now() } } satisfies ExtensionMessage);
  }
  return true;
});

// Example: log the page title on load (remove in production)
console.log('[My Edge Extension] content script loaded on:', document.title);

export {};
