import { Processor } from '@flyer-engine/core';

const USE_ITEM_MSG = 'USE_ITEM';
const ADD_EFFECT_MSG = 'ADD_EFFECT';

const INVENTORY_KEY = 'inventory';

const HEAL_EFFECT = {
  name: 'heal',
  effect: 'heal',
  effectType: 'instant',
  effectOptions: {
    value: 50,
  },
};

const POWER_EFFECT = {
  name: 'power',
  effect: 'power',
  effectType: 'timeLimited',
  applicatorOptions: {
    duration: 5000,
  },
  effectOptions: {
    damage: 25,
    range: 15,
  },
};

const ITEM_EFFECTS = {
  healPotion: HEAL_EFFECT,
  powerPotion: POWER_EFFECT,
};

class ItemsActivator extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._store = options.store;
  }

  process(options) {
    const { messageBus } = options;

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const messages = messageBus.getById(USE_ITEM_MSG, gameObjectId) || [];

      messages.forEach((message) => {
        const { item } = message;
        const inventory = this._store.get(INVENTORY_KEY);

        if (!inventory[item]) {
          return;
        }

        inventory[item] -= 1;

        messageBus.send({
          type: ADD_EFFECT_MSG,
          id: gameObjectId,
          gameObject,
          ...ITEM_EFFECTS[item],
        });
      });
    });
  }
}

export default ItemsActivator;
