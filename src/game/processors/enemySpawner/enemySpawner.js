import { Processor, MathOps } from '@flyer-engine/core';

const ENEMY_PREFAB_NAME = 'enemy';
const TRANSFORM_COMPONENT_NAME = 'transform';

const SPAWN_COOLDOWN = 2000;

class EnemySpawner extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._gameObjectSpawner = options.gameObjectSpawner;

    this._islandSize = {
      minX: -300,
      maxX: 300,
      minY: -300,
      maxY: 300,
    };
    this._cooldown = 0;
  }

  process(options) {
    const { deltaTime } = options;

    if (this._cooldown > 0) {
      this._cooldown -= deltaTime;
      return;
    }

    const enemy = this._gameObjectSpawner.spawn(ENEMY_PREFAB_NAME);
    const enemyTransform = enemy.getComponent(TRANSFORM_COMPONENT_NAME);

    enemyTransform.offsetX = MathOps.random(this._islandSize.minX, this._islandSize.maxX);
    enemyTransform.offsetY = MathOps.random(this._islandSize.minY, this._islandSize.maxY);

    this._cooldown = SPAWN_COOLDOWN;
  }
}

export default EnemySpawner;
