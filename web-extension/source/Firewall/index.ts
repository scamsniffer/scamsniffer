import { RPC } from "../core/message/index";

const EVENT_NAME = 'ScamSniffer/config';

export const updateFirewallConfig = (config: any) => {
  document.dispatchEvent(
    new CustomEvent(EVENT_NAME, {
      detail: config
    })
  );
};

async function sendConfig() {
  console.log('sendConfig')
  const [
    config,
    isDisabled
  ] = await Promise.all([
    RPC.getConfig(),
    RPC.isFeatureDisabled("firewall")
  ]);
  // const isDisabled = await RPC.isFeatureDisabled("firewall");
  updateFirewallConfig({
    isDisabled,
    simulation: config
  });
  // updateFirewallConfig({
  //   simulation: {
  //     account: 'ScamSniffer',
  //     apiKey: 'zam8lOrECdXk8zEJfN19cBnWTPYrOzh1',
  //     project: 'project'
  //   }
  // })
}


function injectScript() {
  try {
    const container = document.head || document.documentElement;
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('async', 'false');
     /* @ts-ignore */
    scriptTag.setAttribute('src', chrome.runtime.getURL("assets/js/bundle.js"));
    container.insertBefore(scriptTag, container.children[0]);
    container.removeChild(scriptTag);
    scriptTag.onload = function() {
      sendConfig();
    }
  } catch (error) {
    console.error('ScamSniffer: Firewall injection failed.', error);
  }
}

injectScript();

// (async () => {
//   const startTime = Date.now();
//   const isDisabled = await RPC.isFeatureDisabled("firewall");
//   const spend = Date.now() - startTime;
//   console.log('spend', spend)
//   if (!isDisabled) {
//     injectScript();
//   }
// })();

export {};