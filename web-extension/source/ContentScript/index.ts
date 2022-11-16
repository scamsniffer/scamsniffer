import 'webextension-polyfill-ts';
import {startWatch} from './twitter/watch';
import listenPhasingWarningPage from './features/listenPhasingWarningPageMessage';
import './App';

startWatch();
listenPhasingWarningPage();
