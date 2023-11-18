import { System } from 'remiz';

import { CollectService } from '../';

const CRAFT_RECIPE_MSG = 'CRAFT_RECIPE';

export class CraftSystem extends System {
  constructor(options) {
    super();

    this.collectService = options.sceneContext.getService(CollectService);
    this.messageBus = options.messageBus;
  }

  update() {
    const craftMessages = this.messageBus.get(CRAFT_RECIPE_MSG) || [];

    craftMessages.forEach((message) => {
      const { recipe } = message;
      const inventory = this.collectService.getInventory();

      if (!inventory[recipe.resource] || inventory[recipe.resource] < recipe.cost) {
        return;
      }

      inventory[recipe.resource] -= recipe.cost;
      inventory[recipe.name] = inventory[recipe.name] || 0;
      inventory[recipe.name] += 1;
    });
  }
}

CraftSystem.systemName = 'CraftSystem';
