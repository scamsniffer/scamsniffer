import {browser} from 'webextension-polyfill-ts';

type TabInfoType = {
  id: number;
  url?: string;
};
class TabInfoManager {
  private tabInfo = new Map<number, TabInfoType>();

  private tabUpdateListeners: ((info: TabInfoType) => void)[] = [];

  private tabRemoveListeners: ((tabId: number) => void)[] = [];

  constructor() {
    browser.tabs.onUpdated.addListener((tabID, changeInfo) => {
      const info = this.tabInfo.get(tabID);
      if (!info || !info.url || info.url !== changeInfo.url) {
        const newTabInfo = {
          id: tabID,
          url: changeInfo.url,
        };
        this.tabInfo.set(tabID, newTabInfo);
        this.tabUpdateListeners.forEach((listener) =>
          listener({...newTabInfo})
        );
      }
    });

    browser.tabs.onRemoved.addListener((tabID) => {
      this.tabInfo.delete(tabID);
      this.tabRemoveListeners.forEach((listener) => {
        listener(tabID);
      });
    });
  }

  query(tabId: number) {
    return this.tabInfo.get(tabId);
  }

  addTabUpdateListener(listener: (info: TabInfoType) => void) {
    this.tabUpdateListeners.push(listener);
  }

  addTabRemoveListener(listener: (tabId: number) => void) {
    this.tabRemoveListeners.push(listener);
  }
}
const tabInfoManager = new TabInfoManager();

export default tabInfoManager;
