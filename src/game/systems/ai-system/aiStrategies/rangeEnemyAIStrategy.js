import { MathOps } from 'remiz';

import AIStrategy from './aiStrategy';

const ATTACK_MSG = 'ATTACK';
const MOVEMENT_MSG = 'MOVEMENT';

const PLAYER_KEY = 'player';

const TRANSFORM_COMPONENT_NAME = 'transform';
const WEAPON_COMPONENT_NAME = 'weapon';
const COLLIDER_COMPONENT_NAME = 'colliderContainer';

const COOLDOWN = 1000;
const WAYPOINT_ERROR = 1;
const MELEE_RADIUS = 50;
const RETREAT_DISTANCE = 100;

class RangeEnemyAIStrategy extends AIStrategy{
  constructor(player, store, messageBus) {
    super();

    this._player = player;
    this._store = store;
    this.messageBus = messageBus;

    this._playerId = this._player.getId();
    this._cooldown = MathOps.random(0, COOLDOWN);
    this._waypoint = null;
    this._enemy = null;

    this._meleeEnemy = null;
    this._distance = null;

    this._islandSize = {
      minX: -200,
      maxX: 200,
      minY: -200,
      maxY: 200,
    };
  }

  _getMovementBoundaries() {
    const { collider } = this._player.getComponent(COLLIDER_COMPONENT_NAME);
    const { centerX, centerY } = collider;

    return {
      minX: this._islandSize.minX - centerX,
      maxX: this._islandSize.maxX - centerX,
      minY: this._islandSize.minY - centerY,
      maxY: this._islandSize.maxY - centerY,
    };
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
    const enemy = this._store.get(PLAYER_KEY);

    if (!enemy) {
      return;
    }

    this._meleeEnemy = this._distance <= MELEE_RADIUS ? enemy : null;
  }

  _updateTargetEnemy() {
    const enemy = this._store.get(PLAYER_KEY);

    if (!enemy) {
      this._enemy = null;
      return;
    }

    this._enemy = this._store.get(PLAYER_KEY);
  }

  _findWayToRetreat() {
    let moveDirection;

    const { minX, maxX, minY, maxY } = this._getMovementBoundaries();
    const { offsetX, offsetY } = this._player.getComponent(TRANSFORM_COMPONENT_NAME);
    const enemy = this._store.get(PLAYER_KEY);

    if (!this._meleeEnemy || !enemy) {
      return;
    }

    const { offsetX: enemyX, offsetY: enemyY } = enemy.getComponent(TRANSFORM_COMPONENT_NAME);

    const direction = MathOps.radToDeg(
      MathOps.getAngleBetweenTwoPoints(offsetX, enemyX, offsetY, enemyY)
    );

    moveDirection = (direction + 180) % 360;

    const waypoint = MathOps.getLinePoint(moveDirection, offsetX, offsetY, RETREAT_DISTANCE);

    if (waypoint.x > minX && waypoint.x < maxX && waypoint.y > minY && waypoint.y < maxY) {
      return waypoint;
    }
  }

  _updateWaypoint() {
    const { minX, maxX, minY, maxY } = this._getMovementBoundaries();

    const waypoint = this._findWayToRetreat();

    this._waypoint = waypoint || { x: MathOps.random(minX, maxX), y: MathOps.random(minY, maxY) };
  }

  _attack() {
    const weapon = this._player.getComponent(WEAPON_COMPONENT_NAME);
    const { range } = weapon.properties;

    if (weapon.cooldownRemaining > 0 || !this._enemy || range < this._distance) {
      return;
    }

    const { offsetX: enemyX, offsetY: enemyY } = this._enemy.getComponent(TRANSFORM_COMPONENT_NAME);

    this.messageBus.send({
      gameObject: this._player,
      id: this._player.getId(),
      type: ATTACK_MSG,
      x: enemyX,
      y: enemyY,
    });
  }

  _move() {
    if (!this._waypoint) {
      return;
    }

    const { offsetX, offsetY } = this._player.getComponent(TRANSFORM_COMPONENT_NAME);
    const { x, y } = this._waypoint;

    if (Math.abs(x - offsetX) < WAYPOINT_ERROR && Math.abs(y - offsetY) < WAYPOINT_ERROR) {
      this._waypoint = null;
      return;
    }

    const movementAngle = MathOps.radToDeg(MathOps.getAngleBetweenTwoPoints(
      this._waypoint.x,
      offsetX,
      this._waypoint.y,
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

    if (this._cooldown <= 0) {
      this._updateDistances();
      this._updateTargetEnemy();
      this._updateWaypoint();

      this._cooldown += COOLDOWN;
    }

    this._attack();
    this._move();
  }
}

export default RangeEnemyAIStrategy;
