import {browser} from 'webextension-polyfill-ts';
import {
  WebExtensionMessage,
  printEnvironment,
  MessageTarget,
} from '@holoflows/kit';
import {AsyncCall} from 'async-call-rpc';
import * as server from './api';

Object.assign(globalThis, {browser});

const message = new WebExtensionMessage();
const channel = (message.events as any).rpc;

export const RPC = AsyncCall<typeof server>(server, {
  channel: channel.bind(MessageTarget.Broadcast),
});
