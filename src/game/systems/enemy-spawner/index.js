import {
  GameObjectObserver,
  MathOps,
  System,
  Transform,
} from 'remiz';

import { EventType } from '../../../events';
import {
  AI,
  Health,
  Weapon,
} from '../../components';
import { TimeService } from '../';

const ENEMY_TEMPLATE_ID = 'bde6add9-dcba-4a38-9829-b3f58eff93cb';
const RANGE_ENEMY_TEMPLATE_ID = 'e6ad51f9-a964-4830-9ce2-afb09de2a41e';

const ENEMY_SPAWN_COOLDOWN = 2000;
const RANGE_ENEMY_SPAWN_COOLDOWN = 4000;
const START_SPAWN_HOUR = 0;
const END_SPAWN_HOUR = 9;
const END_SPAWN_DAMAGE = 10000;

const MELEE_DAMAGE_MAGNIFIER = 2;
const MELEE_HP_MAGNIFIER = 5;

const RANGE_DAMAGE_MAGNIFIER = 4;
const RANGE_HP_MAGNIFIER = 2;

export class EnemySpawner extends System {
  constructor(options) {
    super();

    this.gameObjectObserver = new GameObjectObserver(options.scene, {
      components: [ AI ],
    });
    this._gameObjectSpawner = options.gameObjectSpawner;
    this.timeService = options.scene.context.getService(TimeService);

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
      const enemy = this._gameObjectSpawner.spawn(ENEMY_TEMPLATE_ID);
      const enemyTransform = enemy.getComponent(Transform);
      const enemyWeapon = enemy.getComponent(Weapon);
      const enemyHealth = enemy.getComponent(Health);

      enemyWeapon.properties.damage += days * MELEE_DAMAGE_MAGNIFIER;

      enemyHealth.maxPoints += days * MELEE_HP_MAGNIFIER;
      enemyHealth.points += days * MELEE_HP_MAGNIFIER;

      enemyTransform.offsetX = MathOps.random(this._islandSize.minX, this._islandSize.maxX);
      enemyTransform.offsetY = MathOps.random(this._islandSize.minY, this._islandSize.maxY);

      this._enemyCooldown = ENEMY_SPAWN_COOLDOWN;
    }
  }

  _spawnRangeEnemies(deltaTime, hour, days) {
    if (this._rangeEnemyCooldown > 0) {
      this._rangeEnemyCooldown -= deltaTime;
      return;
    }

    if (hour >= START_SPAWN_HOUR && hour < END_SPAWN_HOUR) {
      const enemy = this._gameObjectSpawner.spawn(RANGE_ENEMY_TEMPLATE_ID);
      const enemyTransform = enemy.getComponent(Transform);
      const enemyWeapon = enemy.getComponent(Weapon);
      const enemyHealth = enemy.getComponent(Health);

      enemyWeapon.properties.damage += days * RANGE_DAMAGE_MAGNIFIER;

      enemyHealth.maxPoints += days * RANGE_HP_MAGNIFIER;
      enemyHealth.points += days * RANGE_HP_MAGNIFIER;

      enemyTransform.offsetX = MathOps.random(this._islandSize.minX, this._islandSize.maxX);
      enemyTransform.offsetY = MathOps.random(this._islandSize.minY, this._islandSize.maxY);

      this._rangeEnemyCooldown = RANGE_ENEMY_SPAWN_COOLDOWN;
    }
  }

  update(options) {
    const { deltaTime } = options;

    const hour = this.timeService.getHours();
    const days = this.timeService.getDays() - 1;

    this._spawnMeleeEnemies(deltaTime, hour, days);
    this._spawnRangeEnemies(deltaTime, hour, days);

    if (hour >= END_SPAWN_HOUR) {
      this.gameObjectObserver.forEach((gameObject) => {
        gameObject.emit(EventType.Damage, { value: END_SPAWN_DAMAGE });
      });
    }
  }
}

EnemySpawner.systemName = 'EnemySpawner';
