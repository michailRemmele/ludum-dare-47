const USE_ITEM_MSG = 'USE_ITEM';
const ADD_EFFECT_MSG = 'ADD_EFFECT';

const INVENTORY_KEY = 'inventory';

const HEAL_EFFECT = {
  name: 'heal',
  options: {
    value: 50,
  },
};

const POWER_EFFECT = {
  name: 'power',
  options: {
    damage: 80,
    range: 15,
  },
};

const ITEM_EFFECTS = {
  healPotion: HEAL_EFFECT,
  powerPotion: POWER_EFFECT,
};

export class ItemsActivator {
  constructor(options) {
    this._gameObjectObserver = options.createGameObjectObserver({});
    this._store = options.store;
    this.messageBus = options.messageBus;
  }

  update() {
    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const messages = this.messageBus.getById(USE_ITEM_MSG, gameObjectId) || [];

      messages.forEach((message) => {
        const { item } = message;
        const inventory = this._store.get(INVENTORY_KEY);

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
