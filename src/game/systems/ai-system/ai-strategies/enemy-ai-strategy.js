
import { MathOps, Transform } from 'remiz';

import { Weapon } from '../../../components';
import { PLAYER_ID } from '../../../../consts/game-objects';

import { AIStrategy } from './ai-strategy';

const ATTACK_MSG = 'ATTACK';
const MOVEMENT_MSG = 'MOVEMENT';

const SPAWN_COOLDOWN = 1000;
const PREPARE_TO_ATTACK_COOLDOWN = 500;
const MELEE_RADIUS = 20;

export class EnemyAIStrategy extends AIStrategy{
  constructor(player, gameObjectObserver, messageBus) {
    super();

    this._player = player;
    this.gameObjectObserver = gameObjectObserver;
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

    const enemy = this.gameObjectObserver.getById(PLAYER_ID);

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

    const enemy = this.gameObjectObserver.getById(PLAYER_ID);

    if (!enemy) {
      return;
    }

    const { offsetX: enemyX, offsetY: enemyY } = enemy.getComponent(Transform);

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

    const enemy = this.gameObjectObserver.getById(PLAYER_ID);

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
