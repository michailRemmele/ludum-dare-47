import { ProcessorPlugin } from '@flyer-engine/core';

import ThumbStickController from 'game/processors/thumbStickController/thumbStickController';

class ThumbStickControllerPlugin extends ProcessorPlugin {
  async load(options) {
    return new ThumbStickController({
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default ThumbStickControllerPlugin;
