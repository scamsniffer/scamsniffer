import * as server from "./api";
import {AsyncCall} from 'async-call-rpc';
import { BridgeAPI, createScamSnifferSDKChannel } from "./types";

export default AsyncCall<BridgeAPI>(server, {
    channel: createScamSnifferSDKChannel('content'),
    log: false,
    thenable: false,
});