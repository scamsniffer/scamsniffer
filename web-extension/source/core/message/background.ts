import {AsyncCall} from 'async-call-rpc';
import * as server from './api';
import {API} from './interface';
import options from './options';

export default AsyncCall<API>(server, options);
