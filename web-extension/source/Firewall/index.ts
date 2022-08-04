import { RPC } from "../core/message/index";

function injectScript(file: any, node: any) {
  console.log('injected', Date.now())
  const th = document.getElementsByTagName(node)[0];
  const s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  s.setAttribute("src", file);
  th.appendChild(s);
}

(async () => {
  const isDisabled = await RPC.isFeatureDisabled("firewall");
  if (!isDisabled) {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", () => {
        /* @ts-ignore */
        injectScript(chrome.runtime.getURL("assets/js/bundle.js"), "body");
      });
    } else {
      /* @ts-ignore */
      injectScript(chrome.runtime.getURL("assets/js/bundle.js"), "body");
    }
  }
})();


export {};