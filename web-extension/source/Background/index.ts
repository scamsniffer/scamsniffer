import {browser} from 'webextension-polyfill-ts';
import '../core/message/index';
import { handleTabInfo } from '../core/tab';

// const tabInfo = new Map();

// browser.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
//     const info = tabInfo.get(tabID)
//     if (!info || (info && !info.url)) {
//         tabInfo.set(tabID, {
//             url: changeInfo.url
//         })
//     }
//     console.log('tabInfo', tabInfo)
// })

// browser.tabs.onRemoved.addListener(function(tabID, removed) {
//     tabInfo.delete(tabID)
// })

// browser.runtime.onMessage.addListener((payload: any, sender) => {
//     if (payload.method === 'GET_TAB_ID' && sender.tab?.id) {
//         browser.tabs.sendMessage(sender.tab.id, {
//             method: 'GET_TAB_ID',
//             tabId: sender.tab.id
//         })
//     }
// });

handleTabInfo();