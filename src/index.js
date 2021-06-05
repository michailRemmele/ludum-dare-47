import {
  Engine,
  contribProcessorsPlugins,
  contribComponents,
} from '@flyer-engine/core';

import mainConfig from 'resources/configurations/mainConfig.json';
import gameProcessorsPlugins from 'game/processorsPlugins';
import gameComponents from 'game/components';
import pluginHelpers from 'pluginHelpers';

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

/**
 * This hack fix the problem with iPhone devices
 * when bottom of the screen cut after device rotation to landscape mode
 * */
let oldWidth = window.innerWidth;
window.addEventListener('resize', () => {
  if (
    navigator.platform.toLowerCase() === 'iphone' &&
    navigator.userAgent.toLowerCase().includes('safari') &&
    !navigator.userAgent.toLowerCase().includes('crios') &&
    !navigator.userAgent.toLowerCase().includes('chrome') &&
    oldWidth !== window.innerWidth &&
    Number(window.innerWidth) > Number(window.innerHeight)
  ) {
    alert('This alert should fix safari resize issue. Please close it.');
  }

  oldWidth = window.innerWidth;
});
