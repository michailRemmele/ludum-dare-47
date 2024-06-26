import { VectorOps } from 'remiz';

import { attacks } from '../attacks';
import { Weapon, ViewDirection } from '../../../components';

import { Fighter } from './fighter';

const TIME_TO_ATTACK = 250;

export class SimpleFighter extends Fighter {
  constructor(actor, spawner, scene) {
    super();

    this._actor = actor;
    this._spawner = spawner;
    this._scene = scene;

    this._weapon = this._actor.getComponent(Weapon);
    this._weapon.cooldownRemaining = 0;

    this._viewDirection = null;
    this._viewTimer = 0;
  }

  isReady() {
    return this._weapon.cooldownRemaining <= 0;
  }

  attack(angle) {
    if (!this.isReady()) {
      return;
    }

    const { type, cooldown } = this._weapon;

    const Attack = attacks[type];

    if (!Attack) {
      throw new Error(`Not found attack with same type: ${type}`);
    }

    this._weapon.cooldownRemaining = cooldown;
    this._weapon.isActive = true;

    this._viewDirection = VectorOps.getVectorByAngle(angle);
    this._viewTimer = TIME_TO_ATTACK;

    return new Attack(this._actor, this._spawner, this._scene, angle);
  }

  update(deltaTime) {
    this._weapon.cooldownRemaining -= deltaTime;
    this._weapon.isActive = false;

    if (this._viewTimer > 0) {
      this._viewTimer -= deltaTime;

      const viewDirection = this._actor.getComponent(ViewDirection);

      viewDirection.x = this._viewDirection.x;
      viewDirection.y = this._viewDirection.y;
    }
  }
}
