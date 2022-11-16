import {browser} from 'webextension-polyfill-ts';

export function initQueryTabIdBackgroundListener() {
  browser.runtime.onMessage.addListener((payload, sender) => {
    if (payload.method === 'QUERY_TAB_ID' && sender.tab?.id) {
      browser.tabs.sendMessage(sender.tab.id, {
        method: 'QUERY_TAB_ID_RESULT',
        tabId: sender.tab.id,
      });
    }
  });
}

let cachedTabId: number | null = null;

export async function clientQueryTabId(): Promise<number> {
  if (cachedTabId) {
    return Promise.resolve(cachedTabId);
  }
  return new Promise((resolve) => {
    const watcher = (payload: any) => {
      if (payload.method === 'QUERY_TAB_ID_RESULT') {
        browser.runtime.onMessage.removeListener(watcher);
        cachedTabId = payload.tabId;
        resolve(cachedTabId as number);
      }
    };
    browser.runtime.onMessage.addListener(watcher);
    browser.runtime.sendMessage({method: 'QUERY_TAB_ID'});
  });
}
