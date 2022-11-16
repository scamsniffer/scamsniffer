import {browser} from 'webextension-polyfill-ts';
import tabInfoManager from '../../tab/infoManager';
import byPassedOrigin from './byPassedOriginManager';

tabInfoManager.addTabUpdateListener(async ({id, url}) => {
  if (url) {
    const {hostname, href} = new URL(url);
    if (byPassedOrigin.has(hostname)) {
      return;
    }
    const res = await fetch(
      `https://domain-api.scamsniffer.io/check?url=${url}&api_key=0c1276ff719aece`
    ).then((r) => r.json());

    if (res?.status === 'BLOCKED') {
      browser.tabs.update(id, {
        url: `https://scamsniffer.github.io/phishing-warning/#hostname=${hostname}&href=${href}`,
      });
    }
  }
});
