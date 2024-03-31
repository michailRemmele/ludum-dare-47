import {
  MathOps,
  VectorOps,
  Transform,
  ColliderContainer,
} from 'remiz';
import { CollisionEnter, AddImpulse } from 'remiz/events';

import { EventType } from '../../../../events';
import { Weapon, Health, HitBox } from '../../../components';

import { Attack } from './attack';

export class RangeAttack extends Attack {
  constructor(actor, spawner, scene, angle) {
    super();

    this._actor = actor;
    this._spawner = spawner;
    this._scene = scene;
    this._angle = angle;

    this._weapon = this._actor.getComponent(Weapon);

    const { offsetX, offsetY } = this._actor.getComponent(Transform);
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

    this._scene.appendChild(shot);

    const directionVector = VectorOps.getVectorByAngle(this._angle);

    directionVector.multiplyNumber(projectileSpeed);

    const flightTime = 1000 * range / projectileSpeed;

    this._directionVector = directionVector;
    this._shot = shot;
    this._lifetime = flightTime;
    this._isFinished = false;

    this._shot.dispatchEvent(AddImpulse, { value: directionVector.clone() });

    this._shot.addEventListener(CollisionEnter, this._handleCollisionEnter);
  }

  destroy() {
    this._shot.removeEventListener(CollisionEnter, this._handleCollisionEnter);
  }

  _handleCollisionEnter = (event) => {
    if (this._lifetime === 0) {
      return;
    }

    const { actor } = event;

    const { damage } = this._weapon.properties;
    const hitBox = actor.getComponent(HitBox);
    const target = actor.parent;

    if (!hitBox || !target) {
      return;
    }

    if (this._actor.id === target.id || this._shot.id === target.id) {
      return;
    }

    target.dispatchEvent(EventType.Damage, { value: damage });
    target.dispatchEvent(EventType.AddEffect, {
      effectId: '039f1088-d693-48ab-9305-20a254658666',
    });
    target.dispatchEvent(AddImpulse, { value: this._directionVector.clone() });

    this._lifetime = 0;
  };

  isFinished() {
    return this._isFinished;
  }

  update(deltaTime) {
    if (this._isFinished) {
      return;
    }

    const shotHealth = this._shot.getComponent(Health);

    if (!shotHealth) {
      this._isFinished = true;
      return;
    }

    this._lifetime -= deltaTime;

    if (this._lifetime <= 0) {
      const shotHealth = this._shot.getComponent(Health);

      this._shot.dispatchEvent(EventType.Damage, { value: shotHealth.points });

      this._isFinished = true;
    }
  }
}
