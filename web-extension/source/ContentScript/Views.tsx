import ScamAssetTip from "./ScamAssetTip";
import {
  setupPortalShadowRoot,
  createReactRootShadowedPartial,
} from "../core/ShadowRoot";

import "./i18n";

export function renderScamAssetTip(node: any, context: any, before: boolean = true) {
  const el = document.createElement('div');
  if (before) {
    node.insertBefore(el, node.firstChild);
  } else {
    node.appendChild(el);
  }
  const rootEl = el.attachShadow({ mode: "closed" });
  const createReactRootShadowed = createReactRootShadowedPartial({
    preventEventPropagationList: [],
  });
  const root = createReactRootShadowed(rootEl, { key: "app" });
  root.render(<ScamAssetTip context={context} />);
  return root;
}
