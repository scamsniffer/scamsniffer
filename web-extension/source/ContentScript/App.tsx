import ScamDialog from './ScamDialog';
import {RPC} from '../core/message/client';
import {clientQueryTabId} from '../core/tab/idQuery';

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
  await clientQueryTabId();
  if (!isDisabled) {
    renderScamDialog();
  }
})();
