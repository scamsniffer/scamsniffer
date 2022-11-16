import 'webextension-polyfill-ts';
import '../core/message/background';

import '../core/features/phasing-warning';
import {initQueryTabIdBackgroundListener} from '../core/tab/idQuery';

initQueryTabIdBackgroundListener();
