import ScamDialog from "./ScamDialog";
import { RPC } from "../core/message/index";
import {
  setupPortalShadowRoot,
  createReactRootShadowedPartial,
} from "../core/ShadowRoot";

import "./i18n";
import "./Asset";

export async function renderScamDialog() {
  const createReactRootShadowed = createReactRootShadowedPartial({
    preventEventPropagationList: [],
  });
  const shadow = setupPortalShadowRoot({ mode: "closed" });
  createReactRootShadowed(shadow, { key: "scam-dialog" }).render(<ScamDialog />);
}

(async () => {
  const isDisabled = await RPC.isFeatureDisabled("webpage");
  if (!isDisabled) {
    renderScamDialog();
  }
})();
