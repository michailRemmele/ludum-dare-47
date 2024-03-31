
import { MathOps, Transform } from 'remiz';

import { EventType } from '../../../../events';
import { Weapon } from '../../../components';
import { PLAYER_ID } from '../../../../consts/actors';

import { AIStrategy } from './ai-strategy';

const SPAWN_COOLDOWN = 1000;
const PREPARE_TO_ATTACK_COOLDOWN = 500;
const MELEE_RADIUS = 20;

export class EnemyAIStrategy extends AIStrategy{
  constructor(player, scene) {
    super();

    this._player = player;
    this.scene = scene;

    this._playerId = this._player.id;
    this._cooldown = SPAWN_COOLDOWN;

    this._distance = null;
    this._isMeleeEnemy = false;
    this._prepareToAttack = false;
  }

  _updateDistances() {
    if (this._prepareToAttack) {
      return;
    }

    const enemy = this.scene.getEntityById(PLAYER_ID);

    if (!enemy) {
      return;
    }

    const { offsetX, offsetY } = this._player.getComponent(Transform);
    const { offsetX: enemyX, offsetY: enemyY } = enemy.getComponent(Transform);

    this._distance = MathOps.getDistanceBetweenTwoPoints(enemyX, offsetX, enemyY, offsetY);
  }

  _updateMeleeEnemies() {
    const weapon = this._player.getComponent(Weapon);

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

    const weapon = this._player.getComponent(Weapon);

    if (weapon.cooldownRemaining > 0) {
      return;
    }

    const enemy = this.scene.getEntityById(PLAYER_ID);

    if (!enemy) {
      return;
    }

    const { offsetX: enemyX, offsetY: enemyY } = enemy.getComponent(Transform);

    this._player.dispatchEvent(EventType.Attack, {
      x: enemyX,
      y: enemyY,
    });

    this._prepareToAttack = false;
  }

  _move() {
    if (this._isMeleeEnemy || this._prepareToAttack || this._cooldown > 0) {
      return;
    }

    const enemy = this.scene.getEntityById(PLAYER_ID);

    if (!enemy) {
      return;
    }

    const { offsetX: enemyX, offsetY: enemyY } = enemy.getComponent(Transform);
    const { offsetX, offsetY } = this._player.getComponent(Transform);

    const movementAngle = MathOps.radToDeg(MathOps.getAngleBetweenTwoPoints(
      enemyX,
      offsetX,
      enemyY,
      offsetY
    ));

    this._player.dispatchEvent(EventType.Movement, { angle: movementAngle });
  }

  update(deltaTime) {
    this._cooldown -= deltaTime;

    this._updateDistances();
    this._updateMeleeEnemies();
    this._attack();
    this._move();
  }
}
