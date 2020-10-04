import { Processor } from '@flyer-engine/core';

const INVENTORY_KEY = 'inventory';

class ItemsActivator extends Processor {
  constructor(options) {
    super();

    this._store = options.store;
  }

  process(options) {
    const { messageBus } = options;
  }
}

export default ItemsActivator;
