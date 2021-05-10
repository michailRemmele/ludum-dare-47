import { Processor, MathOps } from '@flyer-engine/core';

import { SimpleFighter } from './fighters';

const ATTACK_MSG = 'ATTACK';

const TRANSFORM_COMPONENT_NAME = 'transform';

class FightSystem extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._gameObjectSpawner = options.gameObjectSpawner;

    this._fighters = {};
    this._activeAttacks = [];
  }

  _processActiveAttacks(deltaTime) {
    this._activeAttacks = this._activeAttacks.filter((attack) => {
      attack.process(deltaTime);

      return !attack.isFinished();
    });
  }

  _attack(gameObject, targetX, targetY, messageBus) {
    const gameObjectId = gameObject.getId();
    const { offsetX, offsetY } = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

    const fighter = this._fighters[gameObjectId];

    if (!fighter || !fighter.isReady()) {
      messageBus.deleteById(ATTACK_MSG, gameObjectId);
      return;
    }

    const radAngle = MathOps.getAngleBetweenTwoPoints(targetX, offsetX, targetY, offsetY);

    const attack = fighter.attack(radAngle);

    this._activeAttacks.push(attack);
  }

  _processFighters(deltaTime, messageBus) {
    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      if (!this._fighters[gameObjectId]) {
        this._fighters[gameObjectId] = new SimpleFighter(
          gameObject, this._gameObjectSpawner, messageBus
        );
      } else {
        this._fighters[gameObjectId].process(deltaTime);
      }
    });
  }

  _processRemovedFighters() {
    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      this._fighters[gameObjectId] = null;
    });
  }

  process(options) {
    const { messageBus, deltaTime } = options;

    this._processRemovedFighters();
    this._processFighters(deltaTime, messageBus);
    this._processActiveAttacks(deltaTime);

    const messages = messageBus.get(ATTACK_MSG) || [];
    messages.forEach((message) => {
      const { gameObject, x, y } = message;
      this._attack(gameObject, x, y, messageBus);
    });
  }
}

export default FightSystem;
