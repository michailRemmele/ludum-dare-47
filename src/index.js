import {
  Engine,
  contribProcessorsPlugins,
  contribComponents,
} from '@flyer-engine/core';

import mainConfig from 'resources/configurations/mainConfig.json';
import { processorsPlugins as gameProcessorsPlugins } from './game/processors-plugins';
import gameComponents from 'game/components';
import pluginHelpers from './plugin-helpers';
import {
  isIosSafari,
  isIos,
  applyIosSafariScreenFix,
  applyIosChromeScreenFix,
} from './utils';

const options = {
  mainConfig: mainConfig,
  processorsPlugins: {
    ...contribProcessorsPlugins,
    ...gameProcessorsPlugins,
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
