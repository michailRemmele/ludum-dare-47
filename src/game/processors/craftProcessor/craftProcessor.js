import { Processor } from '@flyer-engine/core';

const CRAFT_RECIPE_MSG = 'CRAFT_RECIPE';

const INVENTORY_KEY = 'inventory';

class CollectProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._store = options.store;
  }

  process(options) {
    const { messageBus } = options;

    const craftMessages = messageBus.get(CRAFT_RECIPE_MSG) || [];

    craftMessages.forEach((message) => {
      const { recipe } = message;
      const inventory = this._store.get(INVENTORY_KEY);

      if (!inventory[recipe.resource] || inventory[recipe.resource] < recipe.cost) {
        return;
      }

      inventory[recipe.resource] -= recipe.cost;
      inventory[recipe.name] = inventory[recipe.name] || 0;
      inventory[recipe.name] += 1;
    });
  }
}

export default CollectProcessor;
