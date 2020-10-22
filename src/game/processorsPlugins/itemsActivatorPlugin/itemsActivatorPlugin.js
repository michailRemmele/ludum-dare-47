import { ProcessorPlugin } from '@flyer-engine/core';

import ItemsActivator from '../../processors/itemsActivator/itemsActivator';

class ItemsActivatorPlugin extends ProcessorPlugin {
  async load(options) {
    return new ItemsActivator({
      gameObjectObserver: options.gameObjectObserver,
      store: options.store,
    });
  }
}

export default ItemsActivatorPlugin;
