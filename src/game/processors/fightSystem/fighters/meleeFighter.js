import { MathOps } from '@flyer-engine/core';

import Fighter from './fighter';

const ADD_EFFECT_MSG = 'ADD_EFFECT';

const HIT_PREFAB_NAME = 'hit';

const TRANSFORM_COMPONENT_NAME = 'transform';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const HEALTH_COMPONENT_NAME = 'health';

const HIT_LIFETIME = 500;

class MeleeFighter extends Fighter {
  // onHit() {

  // }

  createAttack(angle) {
    const { positionX, positionY } = this.gameObject.getComponent(TRANSFORM_COMPONENT_NAME);

    const attack = this._gameObjectSpawner.spawn(HIT_PREFAB_NAME);
    const attackTransform = attack.getComponent(TRANSFORM_COMPONENT_NAME);
    const attackCollider = attack.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME).collider;
    const attackHealth = attack.getComponent(HEALTH_COMPONENT_NAME);

    attackCollider.radius = this.properties.range / 2;

    const hitCenter = MathOps.getLinePoint(
      MathOps.radToDeg(angle) + 180, positionX, positionY, attackCollider.radius
    );

    attackTransform.offsetX = hitCenter.x;
    attackTransform.offsetY = hitCenter.y;

    this.messageBus.send({
      type: ADD_EFFECT_MSG,
      id: attack.getId(),
      gameObject: attack,
      name: 'lifetime',
      effect: 'damage',
      effectType: 'delayed',
      applicatorOptions: {
        timer: HIT_LIFETIME,
      },
      effectOptions: {
        value: attackHealth.points,
      },
    });

    return attack;
  }
}

export default MeleeFighter;
