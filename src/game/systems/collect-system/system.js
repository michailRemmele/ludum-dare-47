import {
  System,
  KeyboardControl,
  MouseControl,
} from 'remiz';

import { Collectable } from '../../components';

import { CollectService } from './service';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const COLLISION_LEAVE_MSG = 'COLLISION_LEAVE';
const GRAB_MSG = 'GRAB';
const KILL_MSG = 'KILL';

export class CollectSystem extends System {
  constructor(options) {
    super();

    const {
      createGameObjectObserver,
      messageBus,
      sceneContext,
    } = options;

    this._gameObjectObserver = createGameObjectObserver({
      components: [
        KeyboardControl,
        MouseControl,
      ],
    });
    this.collectService = new CollectService();
    this.messageBus = messageBus;

    sceneContext.registerService(this.collectService);
  }

  update() {
    const collectableItems = this.collectService.getCollectableItems();

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const enterMessages = this.messageBus.getById(COLLISION_ENTER_MSG, gameObjectId) || [];

      enterMessages.forEach((message) => {
        const { gameObject2 } = message;

        const collectable = gameObject2.getComponent(Collectable);

        if (!collectable) {
          return;
        }

        collectableItems.add(gameObject2);
      });

      const leaveMessages = this.messageBus.getById(COLLISION_LEAVE_MSG, gameObjectId) || [];

      leaveMessages.forEach((message) => {
        const { gameObject2 } = message;

        if (collectableItems.has(gameObject2)) {
          collectableItems.delete(gameObject2);
        }
      });

      const grabMessages = this.messageBus.getById(GRAB_MSG, gameObjectId) || [];

      grabMessages.forEach(() => {
        if (!collectableItems.size) {
          return;
        }

        const item = collectableItems.values().next().value;
        const collectable = item.getComponent(Collectable);

        if (!collectable) {
          return;
        }

        const name = collectable.name;

        const inventory = this.collectService.getInventory();

        inventory[name] = inventory[name] || 0;
        inventory[name] += 1;

        collectableItems.delete(item);

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
