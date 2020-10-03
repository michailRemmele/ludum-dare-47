
import { MathOps } from '@flyer-engine/core';

import AIStrategy from './aiStrategy';

const HIT_MSG = 'HIT';
const MOVEMENT_MSG = 'MOVEMENT';

const PLAYER_KEY = 'player';

const TRANSFORM_COMPONENT_NAME = 'transform';
const WEAPON_COMPONENT_NAME = 'meleeWeapon';

const COOLDOWN = 1000;
const MELEE_RADIUS = 40;

class EnemyAIStrategy extends AIStrategy{
  constructor(player, store) {
    super();

    this._player = player;
    this._store = store;

    this._playerId = this._player.getId();
    this._cooldown = MathOps.random(0, COOLDOWN);

    this._distance = null;
    this._isMeleeEnemy = false;
  }

  _updateDistances() {
    const enemy = this._store.get(PLAYER_KEY);

    if (!enemy) {
      return;
    }

    const { offsetX, offsetY } = this._player.getComponent(TRANSFORM_COMPONENT_NAME);
    const { offsetX: enemyX, offsetY: enemyY } = enemy.getComponent(TRANSFORM_COMPONENT_NAME);

    this._distance = MathOps.getDistanceBetweenTwoPoints(enemyX, offsetX, enemyY, offsetY);
  }

  _updateMeleeEnemies() {
    this._isMeleeEnemy = this._distance <= MELEE_RADIUS;
  }

  _attack(messageBus) {
    if (!this._isMeleeEnemy) {
      return;
    }

    const weapon = this._player.getComponent(WEAPON_COMPONENT_NAME);

    if (weapon.cooldownRemaining > 0) {
      return;
    }

    const enemy = this._store.get(PLAYER_KEY);

    if (!enemy) {
      return;
    }

    const { offsetX: enemyX, offsetY: enemyY } = enemy.getComponent(TRANSFORM_COMPONENT_NAME);

    messageBus.send({
      gameObject: this._player,
      id: this._player.getId(),
      type: HIT_MSG,
      x: enemyX,
      y: enemyY,
    });
  }

  _move(messageBus) {
    if (this._isMeleeEnemy) {
      return;
    }

    const enemy = this._store.get(PLAYER_KEY);

    if (!enemy) {
      return;
    }

    const { offsetX: enemyX, offsetY: enemyY } = enemy.getComponent(TRANSFORM_COMPONENT_NAME);
    const { offsetX, offsetY } = this._player.getComponent(TRANSFORM_COMPONENT_NAME);

    const movementAngle = MathOps.radToDeg(MathOps.getAngleBetweenTwoPoints(
      enemyX,
      offsetX,
      enemyY,
      offsetY
    ));

    messageBus.send({
      type: MOVEMENT_MSG,
      gameObject: this._player,
      id: this._player.getId(),
      directionAngle: movementAngle,
    });
  }

  update(messageBus, deltaTime) {
    // this._cooldown -= deltaTime;

    // if (this._cooldown <= 0) {

    //   this._cooldown += COOLDOWN;
    // }

    this._updateDistances();
    this._updateMeleeEnemies();
    this._attack(messageBus);
    this._move(messageBus);
  }
}

export default EnemyAIStrategy;
