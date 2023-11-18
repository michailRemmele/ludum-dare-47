import { System } from 'remiz';

import { CollectService } from '../';

const USE_ITEM_MSG = 'USE_ITEM';
const ADD_EFFECT_MSG = 'ADD_EFFECT';

const HEAL_EFFECT = {
  effectId: 'a1510c63-6925-459c-9442-10902ed829f0',
  options: {
    value: 50,
  },
};

const POWER_EFFECT = {
  effectId: '20e63f34-e52b-445b-b722-685628be2fd7',
  options: {
    damage: 80,
    range: 15,
  },
};

const ITEM_EFFECTS = {
  healPotion: HEAL_EFFECT,
  powerPotion: POWER_EFFECT,
};

export class ItemsActivator extends System {
  constructor(options) {
    super();

    this._gameObjectObserver = options.createGameObjectObserver({});
    this.collectService = options.sceneContext.getService(CollectService);
    this.messageBus = options.messageBus;
  }

  update() {
    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const messages = this.messageBus.getById(USE_ITEM_MSG, gameObjectId) || [];

      messages.forEach((message) => {
        const { item } = message;
        const inventory = this.collectService.getInventory();

        if (!inventory[item]) {
          return;
        }

        inventory[item] -= 1;

        this.messageBus.send({
          type: ADD_EFFECT_MSG,
          id: gameObjectId,
          gameObject,
          ...ITEM_EFFECTS[item],
        });
      });
    });
  }
}

ItemsActivator.systemName = 'ItemsActivator';
