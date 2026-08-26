/**
 * Background service worker (Manifest V3).
 * This is where you handle events, context menus, messaging, and long-running logic.
 */

import type { ExtensionMessage } from '@/types';

// Set up a context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'my-action',
    title: 'Run my action',
    contexts: ['page', 'selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Context menu clicked:', info.menuItemId, 'on tab', tab?.url);
  // TODO: implement your context-menu action
});

// Message router between popup, options, and content scripts
chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  (async () => {
    switch (message.type) {
      case 'PING':
        sendResponse({ type: 'PONG', payload: { timestamp: Date.now() } } satisfies ExtensionMessage);
        break;
      case 'GET_TAB_INFO': {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        sendResponse({
          type: 'TAB_INFO',
          payload: { url: tab?.url ?? '', title: tab?.title ?? '' },
        } satisfies ExtensionMessage);
        break;
      }
    }
  })();
  return true; // async response
});

export {};
