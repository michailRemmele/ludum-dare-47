import { MathOps } from 'remiz';

import { SimpleFighter } from './fighters';

const ATTACK_MSG = 'ATTACK';

const TRANSFORM_COMPONENT_NAME = 'transform';

export class FightSystem {
  constructor(options) {
    this._entityObserver = options.entityObserver;
    this._entitySpawner = options.entitySpawner;
    this.messageBus = options.messageBus;

    this._fighters = {};
    this._activeAttacks = [];
  }

  systemDidMount() {
    this._entityObserver.subscribe('onremove', this._handleEntitiyRemove);
  }

  systemWillUnmount() {
    this._entityObserver.unsubscribe('onremove', this._handleEntitiyRemove);
  }

  _handleEntitiyRemove = (entity) => {
    const entityId = entity.getId();
    this._fighters[entityId] = null;
  };

  _processActiveAttacks(deltaTime) {
    this._activeAttacks = this._activeAttacks.filter((attack) => {
      attack.update(deltaTime);

      return !attack.isFinished();
    });
  }

  _attack(entity, targetX, targetY) {
    const entityId = entity.getId();
    const { offsetX, offsetY } = entity.getComponent(TRANSFORM_COMPONENT_NAME);

    const fighter = this._fighters[entityId];

    if (!fighter || !fighter.isReady()) {
      this.messageBus.deleteById(ATTACK_MSG, entityId);
      return;
    }

    const radAngle = MathOps.getAngleBetweenTwoPoints(targetX, offsetX, targetY, offsetY);

    const attack = fighter.attack(radAngle);

    this._activeAttacks.push(attack);
  }

  _processFighters(deltaTime) {
    this._entityObserver.forEach((entity) => {
      const entityId = entity.getId();

      if (!this._fighters[entityId]) {
        this._fighters[entityId] = new SimpleFighter(
          entity, this._entitySpawner, this.messageBus
        );
      } else {
        this._fighters[entityId].update(deltaTime);
      }
    });
  }

  update(options) {
    const { deltaTime } = options;

    this._entityObserver.fireEvents();

    this._processFighters(deltaTime);
    this._processActiveAttacks(deltaTime);

    const messages = this.messageBus.get(ATTACK_MSG) || [];
    messages.forEach((message) => {
      const { entity, x, y } = message;
      this._attack(entity, x, y);
    });
  }
}
