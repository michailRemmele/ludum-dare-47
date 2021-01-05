import { MathOps, VectorOps } from '@flyer-engine/core';

import Fighter from './fighter';

const DAMAGE_MSG = 'DAMAGE';
const ADD_EFFECT_MSG = 'ADD_EFFECT';
const ADD_FORCE_MSG = 'ADD_FORCE';

const TRANSFORM_COMPONENT_NAME = 'transform';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const HEALTH_COMPONENT_NAME = 'health';

const SHOT_POWER = 'shotPower';

const ACCELERATION_DURATION = 10;
const ACCELERATION_DURATION_IN_SEC = ACCELERATION_DURATION / 1000;
const FETTER_DURATION = 250;

class RangeFighter extends Fighter {
  onHit = (target, attack) => {
    const attackHealth = attack.getComponent(HEALTH_COMPONENT_NAME);

    this.messageBus.send({
      type: DAMAGE_MSG,
      id: attack.getId(),
      gameObject: attack,
      value: attackHealth.points,
    });
    this.messageBus.send({
      type: DAMAGE_MSG,
      id: target.getId(),
      gameObject: target,
      value: this.properties.damage,
    });
    this.messageBus.send({
      type: ADD_EFFECT_MSG,
      id: target.getId(),
      gameObject: target,
      name: 'weaponFetter',
      effect: 'fetter',
      effectType: 'timeLimited',
      applicatorOptions: {
        duration: FETTER_DURATION,
      },
    });
  }

  createAttack(angle) {
    const {
      range,
      projectileSpeed,
      projectileModel,
      projectileRadius,
    } = this.properties;
    const { positionX, positionY } = this.gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

    const attack = this._gameObjectSpawner.spawn(projectileModel);
    const attackTransform = attack.getComponent(TRANSFORM_COMPONENT_NAME);
    const attackCollider = attack.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME).collider;
    const attackHealth = attack.getComponent(HEALTH_COMPONENT_NAME);

    attackCollider.radius = projectileRadius;

    attackTransform.offsetX = positionX;
    attackTransform.offsetY = positionY;
    attackTransform.rotation = MathOps.radToDeg(angle);

    const directionVector = VectorOps.getVectorByAngle(angle);

    const forceValue = projectileSpeed / ACCELERATION_DURATION_IN_SEC;
    directionVector.multiplyNumber(forceValue);

    const flightTime = (1000 * range / projectileSpeed) + (ACCELERATION_DURATION / 2);

    this.messageBus.send({
      type: ADD_FORCE_MSG,
      id: attack.getId(),
      gameObject: attack,
      name: SHOT_POWER,
      value: directionVector,
      duration: ACCELERATION_DURATION,
    });

    this.messageBus.send({
      type: ADD_EFFECT_MSG,
      id: attack.getId(),
      gameObject: attack,
      name: 'lifetime',
      effect: 'damage',
      effectType: 'delayed',
      applicatorOptions: {
        timer: flightTime,
      },
      effectOptions: {
        value: attackHealth.points,
      },
    });

    return {
      gameObject: attack,
      onHit: this.onHit,
    };
  }
}

export default RangeFighter;
