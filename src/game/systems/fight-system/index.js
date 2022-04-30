import { MathOps } from 'remiz';

import { SimpleFighter } from './fighters';

const ATTACK_MSG = 'ATTACK';

const WEAPON_COMPONENT_NAME = 'weapon';
const TRANSFORM_COMPONENT_NAME = 'transform';

export class FightSystem {
  constructor(options) {
    this._gameObjectObserver = options.createGameObjectObserver({
      components: [
        WEAPON_COMPONENT_NAME,
      ],
    });
    this._gameObjectSpawner = options.gameObjectSpawner;
    this.messageBus = options.messageBus;

    this._fighters = {};
    this._activeAttacks = [];
  }

  mount() {
    this._gameObjectObserver.subscribe('onremove', this._handleEntitiyRemove);
  }

  unmount() {
    this._gameObjectObserver.unsubscribe('onremove', this._handleEntitiyRemove);
  }

  _handleEntitiyRemove = (gameObject) => {
    const gameObjectId = gameObject.getId();
    this._fighters[gameObjectId] = null;
  };

  _processActiveAttacks(deltaTime) {
    this._activeAttacks = this._activeAttacks.filter((attack) => {
      attack.update(deltaTime);

      return !attack.isFinished();
    });
  }

  _attack(gameObject, targetX, targetY) {
    const gameObjectId = gameObject.getId();
    const { offsetX, offsetY } = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

    const fighter = this._fighters[gameObjectId];

    if (!fighter || !fighter.isReady()) {
      this.messageBus.deleteById(ATTACK_MSG, gameObjectId);
      return;
    }

    const radAngle = MathOps.getAngleBetweenTwoPoints(targetX, offsetX, targetY, offsetY);

    const attack = fighter.attack(radAngle);

    this._activeAttacks.push(attack);
  }

  _processFighters(deltaTime) {
    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      if (!this._fighters[gameObjectId]) {
        this._fighters[gameObjectId] = new SimpleFighter(
          gameObject, this._gameObjectSpawner, this.messageBus
        );
      } else {
        this._fighters[gameObjectId].update(deltaTime);
      }
    });
  }

  update(options) {
    const { deltaTime } = options;

    this._gameObjectObserver.fireEvents();

    this._processFighters(deltaTime);
    this._processActiveAttacks(deltaTime);

    const messages = this.messageBus.get(ATTACK_MSG) || [];
    messages.forEach((message) => {
      const { gameObject, x, y } = message;
      this._attack(gameObject, x, y);
    });
  }
}
