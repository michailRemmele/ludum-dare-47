import {
  MathOps,
  VectorOps,
  Transform,
  ColliderContainer,
} from 'remiz';

import {
  Weapon,
  Health,
  HitBox,
} from '../../../components';

import { Attack } from './attack';

const DAMAGE_MSG = 'DAMAGE';
const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const ADD_EFFECT_MSG = 'ADD_EFFECT';
const ADD_IMPULSE_MSG = 'ADD_IMPULSE';

const HIT_TEMPLATE_ID = '6f3548cb-9a1c-4ddc-9609-29d80eedd99c';

const HIT_LIFETIME = 100;
const PUSH_IMPULSE = 200;

export class MeleeAttack extends Attack {
  constructor(gameObject, spawner, messageBus, angle) {
    super();

    this._gameObject = gameObject;
    this._spawner = spawner;
    this._messageBus = messageBus;
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
      const { gameObject2 } = message;

      const hitBox = gameObject2.getComponent(HitBox);
      const target = gameObject2.parent;

      if (!hitBox || !target) {
        return;
      }

      const targetId = target.getId();

      if (this._gameObject.getId() === targetId || hitId === targetId) {
        return;
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
    });

    this._lifetime -= deltaTime;

    if (this._lifetime <= 0) {
      const hitHealth = this._hit.getComponent(Health);

      this._messageBus.send({
        type: DAMAGE_MSG,
        id: hitId,
        gameObject: this._hit,
        value: hitHealth.points,
      });

      this._isFinished = true;
    }
  }
}
