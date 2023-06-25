import {
  Engine,
  contribSystems,
  contribComponents,
} from 'remiz';

import config from 'resources/config.json';
import { systems as gameSystems } from './game/systems';
import gameComponents from 'game/components';
import helpers from './helpers';
import {
  isIosSafari,
  isIos,
  applyIosSafariScreenFix,
  applyIosChromeScreenFix,
} from './utils';

const options = {
  config,
  systems: {
    ...contribSystems,
    ...gameSystems,
  },
  components: {
    ...contribComponents,
    ...gameComponents,
  },
  helpers: {
    ...helpers,
  },
};

const engine = new Engine(options);
engine.play();

console.log('Hello! You can contact the author via email: mikhail.remmele@gmail.com');

if (isIosSafari()) {
  applyIosSafariScreenFix();
} else if (isIos()) {
  applyIosChromeScreenFix();
}
