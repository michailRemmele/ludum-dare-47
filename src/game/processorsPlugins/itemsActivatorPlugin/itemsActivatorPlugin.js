import { ProcessorPlugin } from '@flyer-engine/core';

import ItemsActivator from 'game/processors/itemsActivator/itemsActivator';

class ItemsActivatorPlugin extends ProcessorPlugin {
  async load(options) {
    return new ItemsActivator({
      store: options.store,
    });
  }
}

export default ItemsActivatorPlugin;
