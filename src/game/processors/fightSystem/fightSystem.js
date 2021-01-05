import { Processor, VectorOps, MathOps } from '@flyer-engine/core';

import fighters from './fighters';

const ATTACK_MSG = 'ATTACK';
const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const ADD_FORCE_MSG = 'ADD_FORCE';

const PUSH_POWER = 'pushPower';

const TRANSFORM_COMPONENT_NAME = 'transform';
const WEAPON_COMPONENT_NAME = 'weapon';
const HITBOX_COMPONENT_NAME = 'hitBox';

const ACCELERATION_DURATION = 10;

class FightSystem extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._gameObjectSpawner = options.gameObjectSpawner;

    this._fighters = {};
    this._activeAttacks = [];
  }

  _pushTarget(target, directionVector, messageBus) {
    messageBus.send({
      type: ADD_FORCE_MSG,
      name: PUSH_POWER,
      value: directionVector,
      duration: ACCELERATION_DURATION,
      gameObject: target,
      id: target.getId(),
    });
  }

  _processActiveAttacks(messageBus) {
    this._activeAttacks = this._activeAttacks.filter((entry) => {
      const { gameObject, attack } = entry;
      const attackId = attack.getId();

      const collisionMessages = messageBus.getById(COLLISION_ENTER_MSG, attackId) || [];
      return collisionMessages.every((message) => {
        const { gameObject2 } = message;

        const hitBox = gameObject2.getComponent(HITBOX_COMPONENT_NAME);
        const target = gameObject2.getParent();

        if (!hitBox || !target) {
          return true;
        }

        const targetId = target.getId();

        if (gameObject.getId() === targetId || attackId === targetId) {
          return true;
        }

        // this._pushTarget(target, directionVector, messageBus);

        return false;
      });
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

    const attack = fighter.createAttack(radAngle);

    this._activeAttacks.push({
      gameObject,
      attack,
    });
  }

  _updateFighters(deltaTime) {
    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const weapon = gameObject.getComponent(WEAPON_COMPONENT_NAME);

      if (!this._fighters[gameObjectId]) {
        const Fighter = fighters[weapon.type];

        if (!Fighter) {
          throw new Error(`Unsupported weapon's type: ${weapon.type}`);
        }

        this._fighters[gameObjectId] = new Fighter(gameObject, this._gameObjectSpawner);
      } else {
        this._fighters[gameObjectId].tick(deltaTime);
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
    this._updateFighters(deltaTime);
    this._processActiveAttacks(messageBus);

    const messages = messageBus.get(ATTACK_MSG) || [];
    messages.forEach((message) => {
      const { gameObject, x, y } = message;
      this._attack(gameObject, x, y, messageBus);
    });
  }
}

export default FightSystem;
