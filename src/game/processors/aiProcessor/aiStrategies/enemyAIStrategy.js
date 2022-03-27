
import { MathOps } from '@flyer-engine/core';

import AIStrategy from './aiStrategy';

const ATTACK_MSG = 'ATTACK';
const MOVEMENT_MSG = 'MOVEMENT';

const PLAYER_KEY = 'player';

const TRANSFORM_COMPONENT_NAME = 'transform';
const WEAPON_COMPONENT_NAME = 'weapon';

const SPAWN_COOLDOWN = 1000;
const PREPARE_TO_ATTACK_COOLDOWN = 500;
const MELEE_RADIUS = 20;

class EnemyAIStrategy extends AIStrategy{
  constructor(player, store, messageBus) {
    super();

    this._player = player;
    this._store = store;
    this.messageBus = messageBus;

    this._playerId = this._player.getId();
    this._cooldown = SPAWN_COOLDOWN;

    this._distance = null;
    this._isMeleeEnemy = false;
    this._prepareToAttack = false;
  }

  _updateDistances() {
    if (this._prepareToAttack) {
      return;
    }

    const enemy = this._store.get(PLAYER_KEY);

    if (!enemy) {
      return;
    }

    const { offsetX, offsetY } = this._player.getComponent(TRANSFORM_COMPONENT_NAME);
    const { offsetX: enemyX, offsetY: enemyY } = enemy.getComponent(TRANSFORM_COMPONENT_NAME);

    this._distance = MathOps.getDistanceBetweenTwoPoints(enemyX, offsetX, enemyY, offsetY);
  }

  _updateMeleeEnemies() {
    const weapon = this._player.getComponent(WEAPON_COMPONENT_NAME);

    if (this._prepareToAttack || weapon.cooldownRemaining > 0) {
      return;
    }

    this._isMeleeEnemy = this._distance <= MELEE_RADIUS;

    if (this._isMeleeEnemy) {
      this._cooldown = PREPARE_TO_ATTACK_COOLDOWN;
      this._prepareToAttack = true;
    }
  }

  _attack() {
    if (!this._isMeleeEnemy || this._cooldown > 0) {
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

    this.messageBus.send({
      gameObject: this._player,
      id: this._player.getId(),
      type: ATTACK_MSG,
      x: enemyX,
      y: enemyY,
    });

    this._prepareToAttack = false;
  }

  _move() {
    if (this._isMeleeEnemy || this._prepareToAttack || this._cooldown > 0) {
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

    this.messageBus.send({
      type: MOVEMENT_MSG,
      gameObject: this._player,
      id: this._player.getId(),
      angle: movementAngle,
    });
  }

  update(deltaTime) {
    this._cooldown -= deltaTime;

    this._updateDistances();
    this._updateMeleeEnemies();
    this._attack();
    this._move();
  }
}

export default EnemyAIStrategy;
