export {
    createReactRootShadowedPartial,
    // type CreateRenderInShadowRootHostConfig as CreateRenderInShadowRootConfig,
    // type RenderInShadowRootOptions as RenderInShadowRootConfig,
    // type ReactRootShadowed,
} from './createReactRootShadowed'

import { ReactRootShadowed } from "./createReactRootShadowed";
export type { ReactRootShadowed };
export {
    usePortalShadowRoot,
    setupPortalShadowRoot,
    createShadowRootForwardedComponent,
    createShadowRootForwardedPopperComponent,
    baseEl
} from './Portal'
export { ShadowRootIsolation } from './ShadowRootIsolation'
export { DisableShadowRootContext } from './Contexts'
