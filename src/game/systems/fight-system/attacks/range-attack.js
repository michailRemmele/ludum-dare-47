import {
  MathOps,
  VectorOps,
  Transform,
  ColliderContainer,
} from 'remiz';

import { Weapon, Health, HitBox } from '../../../components';

import { Attack } from './attack';

const DAMAGE_MSG = 'DAMAGE';
const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const ADD_EFFECT_MSG = 'ADD_EFFECT';
const ADD_IMPULSE_MSG = 'ADD_IMPULSE';

export class RangeAttack extends Attack {
  constructor(gameObject, spawner, messageBus, angle) {
    super();

    this._gameObject = gameObject;
    this._spawner = spawner;
    this._messageBus = messageBus;
    this._angle = angle;

    this._weapon = this._gameObject.getComponent(Weapon);

    const { offsetX, offsetY } = this._gameObject.getComponent(Transform);
    const {
      range,
      projectileSpeed,
      projectileModel,
      projectileRadius,
    } = this._weapon.properties;

    const shot = this._spawner.spawn(projectileModel);
    const shotTransform = shot.getComponent(Transform);
    const shotCollider = shot.getComponent(ColliderContainer).collider;

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

  update(deltaTime) {
    if (this._isFinished) {
      return;
    }

    const shotId = this._shot.getId();
    const shotHealth = this._shot.getComponent(Health);

    if (!shotHealth) {
      this._isFinished = true;
      return;
    }

    const { damage } = this._weapon.properties;

    const collisionMessages = this._messageBus.getById(COLLISION_ENTER_MSG, shotId) || [];
    collisionMessages.some((message) => {
      const { gameObject2 } = message;

      const hitBox = gameObject2.getComponent(HitBox);
      const target = gameObject2.parent;

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
        effectId: '039f1088-d693-48ab-9305-20a254658666',
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
      const shotHealth = this._shot.getComponent(Health);

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
