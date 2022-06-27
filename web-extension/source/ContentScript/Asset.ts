import {
  DOMProxy,
  LiveSelector,
  MutationObserverWatcher,
} from "@holoflows/kit";

import { ReactRootShadowed } from "../core/ShadowRoot";
import { RPC } from "../core/message/index";
import { renderScamAssetTip } from "./Views";

const assets = new LiveSelector().querySelectorAll<HTMLDivElement>(
  ".AssetSearchView--results .Asset--anchor"
);
const signAsset = new LiveSelector().querySelectorAll<HTMLDivElement>(
  "#main .item--container"
);

const pageViews = new WeakMap<DOMProxy, ReactRootShadowed>();

function collectOpenseaAsset() {
  new MutationObserverWatcher(signAsset)
    .useForeach((node, key, metadata) => {
      try {
        const linkPairs = window.location.href.split("/");
        const context = {
          type: "single",
          chain: linkPairs[4],
          contract: linkPairs[5],
          tokenId: linkPairs[6],
        };
        const view = renderScamAssetTip(node, context);
        pageViews.set(metadata, view);
      } catch (e) {}
      return {
        onRemove: () => {
          const view = pageViews.get(metadata);
          if (view) {
            view.destroy();
            pageViews.delete(metadata);
          }
        },
      };
    })
    .startWatch({ subtree: true, childList: true });

  new MutationObserverWatcher(assets)
    .useForeach((node, key, metadata) => {
      try {
        const link = node.getAttribute("href");
        if (!link) return;
        const linkPairs = link?.split("/");
        const context = {
          type: "list",
          chain: linkPairs[2],
          contract: linkPairs[3],
          tokenId: linkPairs[4],
        };
        const view = renderScamAssetTip(node.parentNode, context, false);
        pageViews.set(metadata, view);
      } catch (e) {
        console.log("error", e);
      }
      return {
        onRemove: () => {
          const view = pageViews.get(metadata);
          if (view) {
            view.destroy();
            pageViews.delete(metadata);
          }
        },
      };
    })
    .startWatch({ subtree: true, childList: true });
}

const isOpensea = window.location.host === "opensea.io";
if (isOpensea) {
  (async () => {
    const isDisabled = await RPC.isFeatureDisabled("asset");
    if (!isDisabled) {
      collectOpenseaAsset();
    }
  })();
}
