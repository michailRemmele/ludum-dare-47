import {
  System,
  KeyboardControl,
  MouseControl,
} from 'remiz';

import { Collectable } from '../../components';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const COLLISION_LEAVE_MSG = 'COLLISION_LEAVE';
const GRAB_MSG = 'GRAB';
const KILL_MSG = 'KILL';

const CAN_GRAB_KEY = 'canGrab';
const INVENTORY_KEY = 'inventory';

export class CollectSystem extends System {
  constructor(options) {
    super();

    this._gameObjectObserver = options.createGameObjectObserver({
      components: [
        KeyboardControl,
        MouseControl,
      ],
    });
    this._store = options.store;
    this.messageBus = options.messageBus;

    this._canGrab = new Set();
    this._inventory = {};
  }

  mount() {
    this._store.set(CAN_GRAB_KEY, this._canGrab);
    this._store.set(INVENTORY_KEY, this._inventory);
  }

  update() {
    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const enterMessages = this.messageBus.getById(COLLISION_ENTER_MSG, gameObjectId) || [];

      enterMessages.forEach((message) => {
        const { gameObject2 } = message;

        const collectable = gameObject2.getComponent(Collectable);

        if (!collectable) {
          return;
        }

        this._canGrab.add(gameObject2);
      });

      const leaveMessages = this.messageBus.getById(COLLISION_LEAVE_MSG, gameObjectId) || [];

      leaveMessages.forEach((message) => {
        const { gameObject2 } = message;

        if (this._canGrab.has(gameObject2)) {
          this._canGrab.delete(gameObject2);
        }
      });

      const grabMessages = this.messageBus.getById(GRAB_MSG, gameObjectId) || [];

      grabMessages.forEach(() => {
        if (!this._canGrab.size) {
          return;
        }

        const item = this._canGrab.values().next().value;
        const collectable = item.getComponent(Collectable);

        if (!collectable) {
          return;
        }

        const name = collectable.name;

        this._inventory[name] = this._inventory[name] || 0;
        this._inventory[name] += 1;

        this._canGrab.delete(item);

        this.messageBus.send({
          type: KILL_MSG,
          id: item.getId(),
          gameObject: item,
        });
      });
    });
  }
}

CollectSystem.systemName = 'CollectSystem';
