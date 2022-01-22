import { MathOps } from '@flyer-engine/core';

import { SimpleFighter } from './fighters';

const ATTACK_MSG = 'ATTACK';

const TRANSFORM_COMPONENT_NAME = 'transform';

class FightSystem {
  constructor(options) {
    this._gameObjectObserver = options.gameObjectObserver;
    this._gameObjectSpawner = options.gameObjectSpawner;
    this.messageBus = options.messageBus;

    this._fighters = {};
    this._activeAttacks = [];
  }

  _processActiveAttacks(deltaTime) {
    this._activeAttacks = this._activeAttacks.filter((attack) => {
      attack.process(deltaTime);

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
    const { deltaTime } = options;

    this._processRemovedFighters();
    this._processFighters(deltaTime);
    this._processActiveAttacks(deltaTime);

    const messages = this.messageBus.get(ATTACK_MSG) || [];
    messages.forEach((message) => {
      const { gameObject, x, y } = message;
      this._attack(gameObject, x, y);
    });
  }
}

export default FightSystem;
