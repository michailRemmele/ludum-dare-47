import { Processor, MathOps } from '@flyer-engine/core';

const DAMAGE_MSG = 'DAMAGE';

const ENEMY_PREFAB_NAME = 'enemy';
const TRANSFORM_COMPONENT_NAME = 'transform';

const SPAWN_COOLDOWN = 2000;
const START_SPAWN_HOUR = 0;
const END_SPAWN_HOUR = 9;
const END_SPAWN_DAMAGE = 10000;

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
    this._cooldown = 0;
  }

  process(options) {
    const { messageBus, deltaTime } = options;

    if (this._cooldown > 0) {
      this._cooldown -= deltaTime;
      return;
    }

    const time = this._store.get(TIME_OF_DAY_KEY);
    const hour = time.getHours();

    if (hour >= START_SPAWN_HOUR && hour < END_SPAWN_HOUR) {
      const enemy = this._gameObjectSpawner.spawn(ENEMY_PREFAB_NAME);
      const enemyTransform = enemy.getComponent(TRANSFORM_COMPONENT_NAME);

      enemyTransform.offsetX = MathOps.random(this._islandSize.minX, this._islandSize.maxX);
      enemyTransform.offsetY = MathOps.random(this._islandSize.minY, this._islandSize.maxY);

      this._cooldown = SPAWN_COOLDOWN;
    } else if (this._gameObjectObserver.size()) {
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
