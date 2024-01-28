import {
  MathOps,
  VectorOps,
  Transform,
  ColliderContainer,
  CollisionEnter,
  AddImpulse,
} from 'remiz';

import { EventType } from '../../../../events';
import {
  Weapon,
  Health,
  HitBox,
} from '../../../components';

import { Attack } from './attack';

const HIT_TEMPLATE_ID = '6f3548cb-9a1c-4ddc-9609-29d80eedd99c';

const HIT_LIFETIME = 100;
const PUSH_IMPULSE = 200;

export class MeleeAttack extends Attack {
  constructor(gameObject, spawner, angle) {
    super();

    this._gameObject = gameObject;
    this._spawner = spawner;
    this._angle = angle;

    this._weapon = this._gameObject.getComponent(Weapon);

    const { offsetX, offsetY } = this._gameObject.getComponent(Transform);
    const { range } = this._weapon.properties;

    const degAngle = MathOps.radToDeg(this._angle);

    const hit = this._spawner.spawn(HIT_TEMPLATE_ID);
    const hitTransform = hit.getComponent(Transform);
    const hitCollider = hit.getComponent(ColliderContainer).collider;

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

    this._hit.addEventListener(CollisionEnter, this._handleCollisionEnter);
  }

  destroy() {
    this._hit.removeEventListener(CollisionEnter, this._handleCollisionEnter);
  }

  _handleCollisionEnter = (event) => {
    const { gameObject } = event;

    const { damage } = this._weapon.properties;
    const hitBox = gameObject.getComponent(HitBox);
    const target = gameObject.parent;

    if (!hitBox || !target) {
      return;
    }

    if (this._gameObject.id === target.id || this._hit.id === target.id) {
      return;
    }

    target.emit(EventType.Damage, { value: damage });
    target.emit(EventType.AddEffect, {
      effectId: '039f1088-d693-48ab-9305-20a254658666',
    });
    target.emit(AddImpulse, { value: this._directionVector.clone() });
  };

  isFinished() {
    return this._isFinished;
  }

  update(deltaTime) {
    if (this._isFinished) {
      return;
    }

    this._lifetime -= deltaTime;

    if (this._lifetime <= 0) {
      const hitHealth = this._hit.getComponent(Health);

      this._hit.emit(EventType.Damage, { value: hitHealth.points });

      this._isFinished = true;
    }
  }
}
