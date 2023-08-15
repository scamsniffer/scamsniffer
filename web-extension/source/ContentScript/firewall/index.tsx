import App from "./App";
import {
  setupPortalShadowRoot,
  ReactRootShadowed,
  createReactRootShadowedPartial,
  baseEl,
} from "../../core/ShadowRoot";
// import "./i18n";
import { setHandler } from "../../core/bridge/api";

const firewall = {
  listenRequest(cb: any) {
    setHandler(cb)
  }
}

function mountApp(force = false) {
  const createReactRootShadowed = createReactRootShadowedPartial({
    preventEventPropagationList: [],
  });
  const shadow = setupPortalShadowRoot({ mode: "closed" }, force);
  let view: ReactRootShadowed | null = null;
  let counter = 1;

  function createAndRender() {
    view = createReactRootShadowed(shadow, { key: `extension-${counter}` });
    view.render(<App firewall={firewall} />);
    counter++;
  }

  var deletionObserver = new MutationObserver(
    function (mutations) {
      mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            if (mutation.removedNodes.length > 0) {
              mutation.removedNodes.forEach((node) => {
                if (node === baseEl) {
                  mountApp(true);
                  deletionObserver.disconnect();
                }
              })
             
            }
          }
      })
    }
  );

  if (baseEl && baseEl.parentNode) {
    deletionObserver.observe(baseEl.parentNode, {
      childList: true
    });
  }

  createAndRender();
}

function delayMount() {
  // setTimeout(() => {
  //   mountApp();
  // }, 1)
  mountApp();
}

/* @ts-ignore */
if (document.body) {
  delayMount();
} else {
  document.addEventListener("DOMContentLoaded", () => {
    delayMount();
  });
}
