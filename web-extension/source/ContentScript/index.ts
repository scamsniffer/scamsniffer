import 'webextension-polyfill-ts';
import {startWatch} from './twitter/watch';
import listenPhasingWarningPage from './features/listenPhasingWarningPageMessage';
import "../core/bridge/server";
import './App';
import './firewall/index';

startWatch();
listenPhasingWarningPage();
