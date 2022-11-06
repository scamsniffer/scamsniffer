import { browser } from "webextension-polyfill-ts";

export const tabInfo = new Map();
const TYPE_ID = 'GET_TAB_ID';

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
        if (payload.type === TYPE_ID && sender.tab?.id) {
            browser.tabs.sendMessage(sender.tab.id, {
                type: TYPE_ID,
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
        browser.runtime.sendMessage({ type: TYPE_ID });
        const watcher = (payload: any) => {
            if (payload.type === TYPE_ID) {
                browser.runtime.onMessage.removeListener(watcher);
                cachedTabId = payload.tabId;
                resolve(cachedTabId as number)
            }
        }
        browser.runtime.onMessage.addListener(watcher);
    })
}