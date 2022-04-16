const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const COLLISION_LEAVE_MSG = 'COLLISION_LEAVE';
const GRAB_MSG = 'GRAB';
const KILL_MSG = 'KILL';

const CAN_GRAB_KEY = 'canGrab';
const INVENTORY_KEY = 'inventory';

const COLLECTABLE_COMPONENT_NAME = 'collectable';

export class CollectSystem {
  constructor(options) {
    this._entityObserver = options.entityObserver;
    this._store = options.store;
    this.messageBus = options.messageBus;

    this._canGrab = new Set();
    this._inventory = {};
  }

  systemDidMount() {
    this._store.set(CAN_GRAB_KEY, this._canGrab);
    this._store.set(INVENTORY_KEY, this._inventory);
  }

  update() {
    this._entityObserver.forEach((entity) => {
      const entityId = entity.getId();

      const enterMessages = this.messageBus.getById(COLLISION_ENTER_MSG, entityId) || [];

      enterMessages.forEach((message) => {
        const { entity2 } = message;

        const collectable = entity2.getComponent(COLLECTABLE_COMPONENT_NAME);

        if (!collectable) {
          return;
        }

        this._canGrab.add(entity2);
      });

      const leaveMessages = this.messageBus.getById(COLLISION_LEAVE_MSG, entityId) || [];

      leaveMessages.forEach((message) => {
        const { entity2 } = message;

        if (this._canGrab.has(entity2)) {
          this._canGrab.delete(entity2);
        }
      });

      const grabMessages = this.messageBus.getById(GRAB_MSG, entityId) || [];

      grabMessages.forEach(() => {
        if (!this._canGrab.size) {
          return;
        }

        const item = this._canGrab.values().next().value;
        const collectable = item.getComponent(COLLECTABLE_COMPONENT_NAME);

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
          entity: item,
        });
      });
    });
  }
}
