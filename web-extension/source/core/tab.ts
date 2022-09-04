import { browser } from "webextension-polyfill-ts";

export const tabInfo = new Map();

export function handleTabInfo() {
    browser.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
        const info = tabInfo.get(tabID)
        if (!info || (info && !info.url)) {
            tabInfo.set(tabID, {
                url: changeInfo.url
            })
        }
        // console.log('tabInfo', tabInfo)
    })
    
    browser.tabs.onRemoved.addListener(function(tabID, removed) {
        tabInfo.delete(tabID)
    })

    browser.runtime.onMessage.addListener((payload: any, sender) => {
        if (payload.method === 'GET_TAB_ID' && sender.tab?.id) {
            browser.tabs.sendMessage(sender.tab.id, {
                method: 'GET_TAB_ID',
                tabId: sender.tab.id
            })
        }
    });
}


let cachedTabId: number | null = null;

export async function getMyTabId() : Promise<number> {
    if (cachedTabId) {
        return Promise.resolve(cachedTabId);
    }
    return new Promise((resolve) => {
        browser.runtime.sendMessage({ method: 'GET_TAB_ID' });
        const watcher = (payload: any) => {
            if (payload.method === 'GET_TAB_ID') {
                browser.runtime.onMessage.removeListener(watcher);
                cachedTabId = payload.tabId;
                resolve(cachedTabId as number)
            }
        }
        browser.runtime.onMessage.addListener(watcher);
    })
}