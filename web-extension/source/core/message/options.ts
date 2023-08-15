import {
  WebExtensionMessage,
  isEnvironment,
  Environment,
  MessageTarget,
} from '@holoflows/kit';
import {browser} from 'webextension-polyfill-ts';

Object.assign(global, {browser});
const message = new WebExtensionMessage();
const channel = (message.events as any).rpc;

const isBackground = isEnvironment(Environment.ManifestBackground);
const options = {
  channel: channel.bind(MessageTarget.Broadcast),
  preferLocalImplementation: isBackground,
  strict: {
    methodNotFound: isBackground,
    unknownMessage: true,
  },
};
export default options;
