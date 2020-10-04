import { ProcessorPlugin } from '@flyer-engine/core';

import CollectProcessor from 'game/processors/collectProcessor/collectProcessor';

class CollectProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new CollectProcessor({
      gameObjectObserver: options.gameObjectObserver,
      store: options.store,
    });
  }
}

export default CollectProcessorPlugin;
