import ScamDialog from './ScamDialog';
import {RPC} from '../core/message/client';

import {
  setupPortalShadowRoot,
  createReactRootShadowedPartial,
} from '../core/ShadowRoot';

import './i18n';
// Hide Opensea Warning
// import "./Asset";

export async function renderScamDialog() {
  const createReactRootShadowed = createReactRootShadowedPartial({
    preventEventPropagationList: [],
  });
  const shadow = setupPortalShadowRoot({mode: 'closed'});
  createReactRootShadowed(shadow, {key: 'scam-dialog'}).render(<ScamDialog />);
}

(async () => {
  const isDisabled = await RPC.isFeatureDisabled('webpage');
  if (!isDisabled) {
    renderScamDialog();
  }
})();
