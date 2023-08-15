import {RPC} from '../core/message/client';

const EVENT_NAME = 'ScamSniffer/config';

export const updateFirewallConfig = (config: any) => {
  document.dispatchEvent(
    new CustomEvent(EVENT_NAME, {
      detail: config,
    })
  );
};

async function sendConfig() {
  const [config, isDisabled, transcationSimulationDisabled, remoteConfig] = await Promise.all([
    RPC.getConfig(),
    RPC.isFeatureDisabled('firewall'),
    RPC.isFeatureDisabled('transcation_simulation'),
    RPC.getRemoteConfig()
  ]);
  for (let index = 0; index < 10; index++) {
    updateFirewallConfig({
      isDisabled,
      transcationSimulationDisabled,
      simulation: config,
      remoteConfig
    });
    await new Promise((resolve) => {
      setTimeout(resolve, 2 * 1000);
    })
  }
}

function injectScript() {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('async', 'false');
    /* @ts-ignore */
    scriptTag.setAttribute('src', chrome.runtime.getURL('assets/js/bundle.js'));
    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
    scriptTag.onload = () => {
      sendConfig();
    };
  } catch (error) {
    console.error('ScamSniffer: Firewall injection failed.', error);
  }
}

injectScript();

export {};
