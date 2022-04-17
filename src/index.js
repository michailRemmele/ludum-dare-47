import {
  Engine,
  contribSystemsPlugins,
  contribComponents,
} from 'remiz';

import config from 'resources/config.json';
import { systemsPlugins as gameSystemsPlugins } from './game/systems-plugins';
import gameComponents from 'game/components';
import pluginHelpers from './plugin-helpers';
import {
  isIosSafari,
  isIos,
  applyIosSafariScreenFix,
  applyIosChromeScreenFix,
} from './utils';

const options = {
  config,
  systemsPlugins: {
    ...contribSystemsPlugins,
    ...gameSystemsPlugins,
  },
  components: {
    ...contribComponents,
    ...gameComponents,
  },
  pluginHelpers: {
    ...pluginHelpers,
  },
};

const engine = new Engine(options);
engine.start();

console.log('Hello! You can contact the author via email: mikhail.remmele@gmail.com');

if (isIosSafari()) {
  applyIosSafariScreenFix();
} else if (isIos()) {
  applyIosChromeScreenFix();
}
