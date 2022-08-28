import {browser} from 'webextension-polyfill-ts';
import {
  WebExtensionMessage,
  printEnvironment,
  isEnvironment,
  Environment,
  MessageTarget,
} from '@holoflows/kit';
import {AsyncCall} from 'async-call-rpc';
import * as server from './api';

Object.assign(globalThis, {browser});

const message = new WebExtensionMessage();
const channel = (message.events as any).rpc;

const isBackground = isEnvironment(Environment.ManifestBackground);
const options = {
  channel: channel.bind(MessageTarget.Broadcast),
  preferLocalImplementation: isBackground,
};

export const RPC = AsyncCall<typeof server>(
  !isBackground ? {} : server,
  options
);
