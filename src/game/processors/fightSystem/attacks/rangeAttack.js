import { MathOps, VectorOps } from '@flyer-engine/core';

import Attack from './attack';

const DAMAGE_MSG = 'DAMAGE';
const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const ADD_EFFECT_MSG = 'ADD_EFFECT';
const ADD_IMPULSE_MSG = 'ADD_IMPULSE';

const WEAPON_COMPONENT_NAME = 'weapon';
const TRANSFORM_COMPONENT_NAME = 'transform';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const HEALTH_COMPONENT_NAME = 'health';
const HITBOX_COMPONENT_NAME = 'hitBox';

class RangeAttack extends Attack {
  constructor(gameObject, spawner, messageBus, angle) {
    super();

    this._gameObject = gameObject;
    this._spawner = spawner;
    this._messageBus = messageBus;
    this._angle = angle;

    this._weapon = this._gameObject.getComponent(WEAPON_COMPONENT_NAME);

    const { offsetX, offsetY } = this._gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
    const {
      range,
      projectileSpeed,
      projectileModel,
      projectileRadius,
    } = this._weapon.properties;

    const shot = this._spawner.spawn(projectileModel);
    const shotTransform = shot.getComponent(TRANSFORM_COMPONENT_NAME);
    const shotCollider = shot.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME).collider;

    shotCollider.radius = projectileRadius;

    shotTransform.offsetX = offsetX;
    shotTransform.offsetY = offsetY;
    shotTransform.rotation = MathOps.radToDeg(this._angle);

    const directionVector = VectorOps.getVectorByAngle(this._angle);

    directionVector.multiplyNumber(projectileSpeed);

    const flightTime = 1000 * range / projectileSpeed;

    this._messageBus.send({
      type: ADD_IMPULSE_MSG,
      id: shot.getId(),
      gameObject: shot,
      value: directionVector.clone(),
    });

    this._directionVector = directionVector;
    this._shot = shot;
    this._lifetime = flightTime;
    this._isFinished = false;
  }

  isFinished() {
    return this._isFinished;
  }

  process(deltaTime) {
    if (this._isFinished) {
      return;
    }

    const shotId = this._shot.getId();
    const shotHealth = this._shot.getComponent(HEALTH_COMPONENT_NAME);

    if (!shotHealth) {
      this._isFinished = true;
      return;
    }

    const { damage } = this._weapon.properties;

    const collisionMessages = this._messageBus.getById(COLLISION_ENTER_MSG, shotId) || [];
    collisionMessages.some((message) => {
      const { gameObject2 } = message;

      const hitBox = gameObject2.getComponent(HITBOX_COMPONENT_NAME);
      const target = gameObject2.getParent();

      if (!hitBox || !target) {
        return false;
      }

      const targetId = target.getId();

      if (this._gameObject.getId() === targetId || shotId === targetId) {
        return false;
      }

      this._messageBus.send({
        type: DAMAGE_MSG,
        id: targetId,
        gameObject: target,
        value: damage,
      });
      this._messageBus.send({
        type: ADD_EFFECT_MSG,
        id: targetId,
        gameObject: target,
        name: 'fetter',
      });
      this._messageBus.send({
        type: ADD_IMPULSE_MSG,
        value: this._directionVector.clone(),
        gameObject: target,
        id: targetId,
      });

      this._lifetime = 0;

      return true;
    });

    this._lifetime -= deltaTime;

    if (this._lifetime <= 0) {
      const shotHealth = this._shot.getComponent(HEALTH_COMPONENT_NAME);

      this._messageBus.send({
        type: DAMAGE_MSG,
        id: shotId,
        gameObject: this._shot,
        value: shotHealth.points,
      });

      this._isFinished = true;
    }
  }
}

export default RangeAttack;
