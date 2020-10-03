import { ProcessorPlugin } from '@flyer-engine/core';

import EnemySpawner from 'game/processors/enemySpawner/enemySpawner';

class EnemySpawnerPlugin extends ProcessorPlugin {
  async load(options) {
    return new EnemySpawner({
      gameObjectSpawner: options.gameObjectSpawner,
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default EnemySpawnerPlugin;
