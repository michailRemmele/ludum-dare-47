import {
  Engine,
  contribProcessorsPlugins,
  contribComponents,
} from '@flyer-engine/core';

import mainConfig from '../public/resources/configurations/mainConfig.json';
import gameProcessorsPlugins from './game/processorsPlugins';
import gameComponents from './game/components';
import pluginHelpers from './pluginHelpers';

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
