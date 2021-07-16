import {
  Engine,
  contribProcessorsPlugins,
  contribComponents,
} from '@flyer-engine/core';

import mainConfig from 'resources/configurations/mainConfig.json';
import gameProcessorsPlugins from 'game/processorsPlugins';
import gameComponents from 'game/components';
import pluginHelpers from 'pluginHelpers';
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

// eslint-disable-next-line no-console
console.log('Hello! You can contact the author via email: mikhail.remmele@gmail.com');

if (isIosSafari()) {
  applyIosSafariScreenFix();
} else if (isIos()) {
  applyIosChromeScreenFix();
}
