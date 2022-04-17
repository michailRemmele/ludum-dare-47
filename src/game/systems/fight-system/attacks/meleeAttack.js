import { MathOps, VectorOps } from 'remiz';

import Attack from './attack';

const DAMAGE_MSG = 'DAMAGE';
const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const ADD_EFFECT_MSG = 'ADD_EFFECT';
const ADD_IMPULSE_MSG = 'ADD_IMPULSE';

const HIT_PREFAB_NAME = 'hit';

const WEAPON_COMPONENT_NAME = 'weapon';
const TRANSFORM_COMPONENT_NAME = 'transform';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const HEALTH_COMPONENT_NAME = 'health';
const HITBOX_COMPONENT_NAME = 'hitBox';

const HIT_LIFETIME = 100;
const PUSH_IMPULSE = 200;

class MeleeAttack extends Attack {
  constructor(entity, spawner, messageBus, angle) {
    super();

    this._entity = entity;
    this._spawner = spawner;
    this._messageBus = messageBus;
    this._angle = angle;

    this._weapon = this._entity.getComponent(WEAPON_COMPONENT_NAME);

    const { offsetX, offsetY } = this._entity.getComponent(TRANSFORM_COMPONENT_NAME);
    const { range } = this._weapon.properties;

    const degAngle = MathOps.radToDeg(this._angle);

    const hit = this._spawner.spawn(HIT_PREFAB_NAME);
    const hitTransform = hit.getComponent(TRANSFORM_COMPONENT_NAME);
    const hitCollider = hit.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME).collider;

    hitCollider.radius = range / 2;

    const hitCenter = MathOps.getLinePoint(
      degAngle + 180, offsetX, offsetY, hitCollider.radius
    );

    hitTransform.offsetX = hitCenter.x;
    hitTransform.offsetY = hitCenter.y;

    const directionVector = VectorOps.getVectorByAngle(this._angle);
    directionVector.multiplyNumber(PUSH_IMPULSE);

    this._directionVector = directionVector;
    this._hit = hit;
    this._lifetime = HIT_LIFETIME;
    this._isFinished = false;
  }

  isFinished() {
    return this._isFinished;
  }

  update(deltaTime) {
    if (this._isFinished) {
      return;
    }

    const hitId = this._hit.getId();

    const { damage } = this._weapon.properties;

    const collisionMessages = this._messageBus.getById(COLLISION_ENTER_MSG, hitId) || [];
    collisionMessages.forEach((message) => {
      const { entity2 } = message;

      const hitBox = entity2.getComponent(HITBOX_COMPONENT_NAME);
      const target = entity2.parent;

      if (!hitBox || !target) {
        return;
      }

      const targetId = target.getId();

      if (this._entity.getId() === targetId || hitId === targetId) {
        return;
      }

      this._messageBus.send({
        type: DAMAGE_MSG,
        id: targetId,
        entity: target,
        value: damage,
      });
      this._messageBus.send({
        type: ADD_EFFECT_MSG,
        id: targetId,
        entity: target,
        name: 'fetter',
      });
      this._messageBus.send({
        type: ADD_IMPULSE_MSG,
        value: this._directionVector.clone(),
        entity: target,
        id: targetId,
      });
    });

    this._lifetime -= deltaTime;

    if (this._lifetime <= 0) {
      const hitHealth = this._hit.getComponent(HEALTH_COMPONENT_NAME);

      this._messageBus.send({
        type: DAMAGE_MSG,
        id: hitId,
        entity: this._hit,
        value: hitHealth.points,
      });

      this._isFinished = true;
    }
  }
}

export default MeleeAttack;
