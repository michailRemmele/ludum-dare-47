import { Processor, MathOps } from '@flyer-engine/core';

const DAMAGE_MSG = 'DAMAGE';

const ENEMY_PREFAB_NAME = 'enemy';
const RANGE_ENEMY_PREFAB_NAME = 'rangeEnemy';
const TRANSFORM_COMPONENT_NAME = 'transform';
const MELEE_WEAPON_COMPONENT_NAME = 'meleeWeapon';
const HEALTH_COMPONENT_NAME = 'health';

const ENEMY_SPAWN_COOLDOWN = 2000;
const RANGE_ENEMY_SPAWN_COOLDOWN = 4000;
const START_SPAWN_HOUR = 0;
const END_SPAWN_HOUR = 9;
const END_SPAWN_DAMAGE = 10000;

const DAMAGE_MAGNIFIER = 3;
const HP_MAGNIFIER = 5;

const TIME_OF_DAY_KEY = 'timeOfDay';

class EnemySpawner extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._gameObjectSpawner = options.gameObjectSpawner;
    this._store = options.store;

    this._islandSize = {
      minX: -200,
      maxX: 200,
      minY: -200,
      maxY: 200,
    };
    this._enemyCooldown = 0;
    this._rangeEnemyCooldown = 0;
  }

  _spawnMeleeEnemies(deltaTime, hour, days) {
    if (this._enemyCooldown > 0) {
      this._enemyCooldown -= deltaTime;
      return;
    }

    if (hour >= START_SPAWN_HOUR && hour < END_SPAWN_HOUR) {
      const enemy = this._gameObjectSpawner.spawn(ENEMY_PREFAB_NAME);
      const enemyTransform = enemy.getComponent(TRANSFORM_COMPONENT_NAME);
      const enemyWeapon = enemy.getComponent(MELEE_WEAPON_COMPONENT_NAME);
      const enemyHealth = enemy.getComponent(HEALTH_COMPONENT_NAME);

      enemyWeapon.damage += days * DAMAGE_MAGNIFIER;

      enemyHealth.maxPoints += days * HP_MAGNIFIER;
      enemyHealth.points += days * HP_MAGNIFIER;

      enemyTransform.offsetX = MathOps.random(this._islandSize.minX, this._islandSize.maxX);
      enemyTransform.offsetY = MathOps.random(this._islandSize.minY, this._islandSize.maxY);

      this._enemyCooldown = ENEMY_SPAWN_COOLDOWN;
    }
  }

  _spawnRangeEnemies(deltaTime, hour, _days) {
    if (this._rangeEnemyCooldown > 0) {
      this._rangeEnemyCooldown -= deltaTime;
      return;
    }

    if (hour >= START_SPAWN_HOUR && hour < END_SPAWN_HOUR) {
      const enemy = this._gameObjectSpawner.spawn(RANGE_ENEMY_PREFAB_NAME);
      const enemyTransform = enemy.getComponent(TRANSFORM_COMPONENT_NAME);

      enemyTransform.offsetX = MathOps.random(this._islandSize.minX, this._islandSize.maxX);
      enemyTransform.offsetY = MathOps.random(this._islandSize.minY, this._islandSize.maxY);

      this._rangeEnemyCooldown = RANGE_ENEMY_SPAWN_COOLDOWN;
    }
  }

  process(options) {
    const { messageBus, deltaTime } = options;

    const time = this._store.get(TIME_OF_DAY_KEY);
    const hour = time.getHours();
    const days = time.getDays() - 1;

    this._spawnMeleeEnemies(deltaTime, hour, days);
    this._spawnRangeEnemies(deltaTime, hour, days);

    if (this._gameObjectObserver.size() && hour >= END_SPAWN_HOUR) {
      this._gameObjectObserver.forEach((gameObject) => {
        messageBus.send({
          type: DAMAGE_MSG,
          id: gameObject.getId(),
          gameObject: gameObject,
          value: END_SPAWN_DAMAGE,
        });
      });
    }
  }
}

export default EnemySpawner;
