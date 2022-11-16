import {AsyncCall} from 'async-call-rpc';
import {API} from './interface';
import options from './options';

export const RPC = AsyncCall<API>({}, options);

export default RPC;
