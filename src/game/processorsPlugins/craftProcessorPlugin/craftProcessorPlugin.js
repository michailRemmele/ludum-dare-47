import { ProcessorPlugin } from '@flyer-engine/core';

import CraftProcessor from 'game/processors/craftProcessor/craftProcessor';

class CraftProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new CraftProcessor({
      gameObjectObserver: options.gameObjectObserver,
      store: options.store,
    });
  }
}

export default CraftProcessorPlugin;
